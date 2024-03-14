import { ApiError } from '@/common/constants';
import { PaginationDto } from '@/common/dto';
import { AnyObject } from '@/common/interfaces';
import { InjectMongooseRepository, MongooseRepository } from '@/common/repository';
import { BaseService } from '@/common/services';
import { catchAwait, formatDateTime, isEmpty, strToTimestamp, writeExcel } from '@/common/utils';
import { RoleGroupTypeEnum } from '@/modules/core/role-group/enums';
import { SystemConfigureService } from '@/modules/core/system-configure/system-configure.service';
import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { RoleService } from '../role/role.service';
import { RoleDocument } from '../role/schemas';
import { CreateOperateLogDto, ExportOperateLogDto } from './dto';
import { OperateLogException } from './operate-log.exception';
import { OperateLog } from './schemas';

@Injectable()
export class OperateLogService extends BaseService<OperateLog> {
    protected logger = new Logger(OperateLogService.name);
    public context: ExecutionContext;
    constructor(
        @InjectMongooseRepository(OperateLog.name)
        protected readonly repository: MongooseRepository<OperateLog>,
        private readonly roleService: RoleService,
        private readonly systemConfigureService: SystemConfigureService,
    ) {
        super(repository);
    }

    /**
     * 添加日志
     * @param create
     * @returns
     */
    async create(create: CreateOperateLogDto) {
        const now = Date.now();
        let operateDate = create?.operateDate || now;
        if (String(operateDate).length !== 10) {
            // 豪秒要转换成秒
            operateDate = Math.ceil(operateDate / 1000);
        }
        const data = {
            ...create,
            operateDate,
            createDate: Math.ceil(now / 1000),
        };
        await this.add(data)
            .then((rep) => {
                return rep;
            })
            .catch((error) => {
                this.logger.error(`${error}\n`);
            });
    }

    /**
     * 添加
     * @param post
     * @returns
     */
    private async add(post: CreateOperateLogDto) {
        return await this.insert({ doc: post });
    }

    // 生成查询条件
    createQueryWhere(post: ExportOperateLogDto) {
        const { dateTime, type, content, operator } = post;
        const where: AnyObject = {};
        // 时间范围
        if (dateTime?.length === 2) {
            const [fromTime, toTime] = dateTime;
            const from = strToTimestamp(fromTime);
            const to = strToTimestamp(toTime);
            if (from && to) {
                where.operateDate = { $gte: from, $lte: to };
            }
        }
        // 日志类型
        if (type) {
            where.type = type;
        }
        // 日志内容
        if (content) {
            where.content = { $regex: content, $options: 'i' };
        }
        // 操作者
        if (operator) {
            where.operator = { $regex: operator, $options: 'i' };
        }
        return where;
    }

    /**
     * 查询数据
     * @param where
     * @param option
     * @returns
     */
    async findMany(
        where: AnyObject,
        roleGroupType: RoleGroupTypeEnum,
        option: PaginationDto = {},
        sort: AnyObject = { operateDate: -1 },
    ) {
        const filter = { ...where };
        // 获取角色组下所有用户 id
        //  系统安全员角色组用户，只能查看系统审计员角色组用户的操作日志
        //  系统审计员角色组用户，可查看非系统审计员角色组用户的操作日志
        filter.operatorId = -1;
        if (roleGroupType === RoleGroupTypeEnum.auditAdmin) {
            const userIds = await this.findRoleUser(roleGroupType);
            if (userIds.length) {
                filter.operatorId = { $nin: userIds };
            }
        } else if (roleGroupType === RoleGroupTypeEnum.securityAdmin) {
            const userIds = await this.findRoleUser(RoleGroupTypeEnum.auditAdmin);
            if (userIds.length) {
                filter.operatorId = { $in: userIds };
            }
        }
        if (!isEmpty(option)) {
            const { current, pageSize } = option;
            const [list, total] = await this.findPagination({ filter, current, pageSize, sort });
            return { list: list || [], total: total || 0 };
        } else {
            const list = await this.find({ filter, options: { sort } });
            return { list };
        }
    }

    // 生成下载文件
    async createFile(
        post: ExportOperateLogDto,
        path: string,
        i18n: I18nContext,
        roleGroupType: RoleGroupTypeEnum,
    ) {
        // 根据条件查询生成文件
        const { ids, sort = { operateDate: -1 } } = post;
        let where: AnyObject = {};
        if (ids?.length) {
            // 按选中id生成文件
            where = { _id: { $in: ids } };
        } else {
            // 按查询条件生成文件
            where = this.createQueryWhere(post);
        }
        const { list } = await this.findMany(where, roleGroupType, {}, sort);
        if (list?.length) {
            // 获取时区配置
            const timeOpt = await this.systemConfigureService.getTimeConfig();
            const excelData = [];
            // 处理多语言
            list.forEach(async (value) => {
                const log = {
                    logtype: value?.typeName,
                    operateDate: formatDateTime({
                        date: value?.operateDate * 1000,
                        timezone: timeOpt.timezone,
                    }),
                    content: value?.content,
                    operator: value?.operator,
                    operatorIp: value?.operatorIp,
                };
                const temp = {};
                // 翻译表头
                for (const key in log) {
                    if (Object.prototype.hasOwnProperty.call(log, key)) {
                        const indexLan = i18n.t(`log.${key}`);
                        temp[indexLan] = log[key];
                    }
                }
                excelData.push(temp);
            });
            // 生成 excel 文件
            if (excelData.length) {
                return writeExcel(excelData, path);
            } else {
                const error = {
                    ...ApiError.noData,
                };
                throw new OperateLogException(error);
            }
        } else {
            const error = {
                ...ApiError.noData,
            };
            throw new OperateLogException(error);
        }
    }

    /**
     * 获取角色组下所有用户 id
     * 系统安全员角色组用户，只能查看系统审计员角色组用户的操作日志
     * 系统审计员角色组用户，可查看非系统审计员角色组用户的操作日志
     * @param roleGroupType
     * @returns
     */
    async findRoleUser(roleGroupType: RoleGroupTypeEnum) {
        const [err, role] = await catchAwait(this.roleService.findUserListByType(roleGroupType));
        if (err) {
            return [];
        }
        const userIds = [];
        (role as unknown as RoleDocument[]).forEach((element) => {
            element?.users?.forEach((user: any) => userIds.push(user._id));
        });
        return userIds;
    }
}
