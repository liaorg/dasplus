import { DesensitizationError } from '@/common/constants';
import { ApiResult, ApiSecurityAuth } from '@/common/decorators';
import { OperateLogEnum } from '@/common/enum';
import { LogParam } from '@/common/interfaces';
import { ParseObjectIdPipe } from '@/common/pipes';
import { ObjectIdType } from '@/common/services';
import { coverContent, generateLog, hasChangeWith, success } from '@/common/utils';
import { UpdateStatusDto } from '@/modules/engine/common/dto';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { DataException } from '../data.exception';
import { DesensitizationService } from './desensitization.service';
import {
    CreateDesensitizationDto,
    DeleteDesensitizationDto,
    DesensitizationDto,
    DesensitizationListDto,
    QueryDesensitizationDto,
    UpdateDesensitizationDto,
} from './dto';
import { DesensitizationAuthorEnum } from './enums';

// -- swagger 设置 --begain
// 设置标题
@ApiTags('策略管理-数据脱敏')
// token 参数设置
@ApiSecurityAuth()
// -- swagger 设置 --end
@Controller('desensitization')
export class DesensitizationController {
    private logMoudle = 'desensitization.module';
    private logType = OperateLogEnum.businessOperate;
    constructor(private readonly service: DesensitizationService) {}

    @ApiOperation({ summary: '获取数据脱敏列表' })
    @ApiResult({ type: DesensitizationListDto, isPage: true })
    @Post('list')
    async list(@Body() post: QueryDesensitizationDto) {
        const { pageSize, current, author, enable, name, sort = { _id: -1 } } = post;
        const filter: any = { author, enable };
        // 名称
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        const [list, total] = await this.service.findPagination({
            filter,
            sort,
            current,
            pageSize,
        });
        if (list?.length) {
            // 示例进行脱敏处理
            const newList = list.map((data) => {
                // 替换前缀和后缀
                data.sample = coverContent(
                    data.sample,
                    data.mask_public_left,
                    data.mask_public_right,
                    data.maskchr,
                );
                return data;
            });
            return { list: newList as unknown as DesensitizationDto[], current, pageSize, total };
        }
        return { list: list as unknown as DesensitizationDto[], current, pageSize, total };
    }

    @ApiOperation({ summary: '删除/批量删除数据脱敏' })
    @ApiResult({ type: Boolean })
    @Post('deletion')
    async removeByIds(@Body() post: DeleteDesensitizationDto) {
        const { oidlist, nameList } = post;
        const now = Date.now();
        const name = nameList?.join() || '';
        let filter = { _id: { $in: oidlist }, author: DesensitizationAuthorEnum.user };
        const updated = await this.service.deleteMany(
            { filter },
            { ...DesensitizationError.deleteFailed, args: { name } },
        );

        const log = {
            module: this.logMoudle,
            type: this.logType,
            operateDate: now,
            content: 'desensitization.delete',
            lanArgs: { name },
        };
        // 创建带操作日志信息的返回数据
        return success(updated, log);
    }

    @ApiOperation({ summary: '(批量)启用/停用数据脱敏' })
    @ApiResult({ type: Boolean })
    @Patch('status')
    async updateStatus(@Body() post: UpdateStatusDto) {
        const { oidlist, enable, nameList } = post;
        const now = Date.now();
        const doc = { enable };
        const name = nameList?.join();
        const updated = await this.service.updateMany(
            { filter: { _id: { $in: oidlist } }, doc },
            { ...DesensitizationError.updateStatusFailed, args: { name } },
        );
        const log = {
            module: this.logMoudle,
            type: this.logType,
            operateDate: now,
            content: enable ? 'desensitization.statusEnable' : 'desensitization.statusDisable',
            lanArgs: { name },
        };
        // 创建带操作日志信息的返回数据
        return success(updated, log);
    }

    @ApiOperation({ summary: '获取数据脱敏信息' })
    @ApiResult({ type: DesensitizationDto })
    @Get(':id')
    async findDoc(@Param('id', ParseObjectIdPipe) id: ObjectIdType) {
        return await this.service.findById(id, {}, DesensitizationError.queryFailed);
    }

    @ApiOperation({ summary: '修改数据脱敏' })
    @ApiResult({ type: Boolean })
    @Patch(':id')
    async updateDoc(
        @Param('id', ParseObjectIdPipe) id: ObjectIdType,
        @Body() post: UpdateDesensitizationDto,
        @I18n() i18n: I18nContext,
    ) {
        // 查询是否存在
        const old = await this.service.findById(id);
        if (!old) {
            const error = {
                ...DesensitizationError.notExisted,
                args: {
                    name: post.name,
                },
            };
            throw new DataException(error);
        }
        // 查询名称是否存在
        // 名称要唯一
        const hasName = await this.service.findOne({ filter: { _id: { $ne: id }, name: post.name } });
        if (hasName) {
            const error = {
                ...DesensitizationError.existedName,
                args: {
                    name: post.name,
                },
            };
            throw new DataException(error);
        }
        const withKey = ['mask_public_left', 'mask_public_right', 'maskchr'];
        if (post?.author === 'factory') {
            // 如果是默认
            Reflect.deleteProperty(post, 'name');
            Reflect.deleteProperty(post, 'regex');
            Reflect.deleteProperty(post, 'sample');
            Reflect.deleteProperty(post, 'description');
        } else {
            withKey.push('name', 'regex', 'sample', 'description');
            post.description = post?.description ?? '';
        }
        // 不能修改类型
        Reflect.deleteProperty(post, 'author');
        Reflect.deleteProperty(post, 'algorithm');

        // 提取修改内容
        const { change, target } = hasChangeWith(withKey, old, post);
        // 生成日志内容
        let updated: any = true;
        let log: any = {};
        if (change.length) {
            const now = Date.now();
            const param = {
                filter: { _id: id },
                doc: {
                    ...target,
                    updated_date: now,
                },
            };
            updated = await this.service.updateOne(param, DesensitizationError.updateFailed);
            const logParam: LogParam = {
                change,
                name: old.name,
                module: 'desensitization',
                logType: this.logType,
                i18n,
            };
            if (change.includes('name') && post.name) {
                logParam.other = i18n.t('desensitization.log.changeName', { args: { name: post.name } });
            }
            log = generateLog(logParam);
        }
        // 创建带操作日志信息的返回数据
        return success(updated, log);
    }

    @ApiOperation({ summary: '添加数据脱敏信息' })
    @ApiResult({ type: Boolean })
    @Post()
    async addDoc(@Body() post: CreateDesensitizationDto) {
        // 名称要唯一
        const hasName = await this.service.findOne({ filter: { name: post.name } });
        if (hasName) {
            const error = {
                ...DesensitizationError.existedName,
                args: {
                    name: post.name,
                },
            };
            throw new DataException(error);
        }
        const doc = {
            ...post,
            description: post?.description ?? '',
            maskchr: post?.maskchr ?? '*',
            mask_public_left: post?.mask_public_left ?? 1,
            mask_public_right: post?.mask_public_right ?? 1,
            author: DesensitizationAuthorEnum.user,
            algorithm: false,
        };
        const added = await this.service.insert({ doc }, DesensitizationError.addFailed);
        const log = {
            module: this.logMoudle,
            type: this.logType,
            operateDate: Date.now(),
            content: 'desensitization.add',
            lanArgs: { name: post.name },
        };
        // 创建带操作日志信息的返回数据
        return success(added, log);
    }
}
