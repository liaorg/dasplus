import { AdminHostError } from '@/common/constants';
import { ApiResult, ApiSecurityAuth } from '@/common/decorators';
import { OperateLogEnum } from '@/common/enum';
import { ParseObjectIdPipe } from '@/common/pipes';
import { hasChangeWith, success } from '@/common/utils';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AdminHostException } from './admin-host.exception';
import { AdminHostService } from './admin-host.service';
import {
    AdminHostDto,
    AdminHostListDto,
    CreateAdminHostDto,
    DeleteAdminHostDto,
    QueryAdminHostDto,
    UpOrDownAdminHostDto,
    UpdateAdminHostDto,
} from './dto';

// 抛出 400类(客户端错误)异常 500类(服务器错误)异常
// 出现多级路由时，多级的要排前面定义 role/role-group-list > role/:id

// -- swagger 设置 --begain
// 设置标题
@ApiTags('系统配置-系统安全配置-管理主机')
// token 参数设置
@ApiSecurityAuth()
// -- swagger 设置 --end
@Controller('admin-host')
export class AdminHostController {
    private logMoudle = 'adminHost.module';
    private logType = OperateLogEnum.systemAdmin;
    constructor(private readonly service: AdminHostService) {}

    @ApiOperation({ summary: '管理主机分页-查询' })
    @ApiResult({ type: AdminHostListDto, isPage: true })
    @Post('query')
    async findAll(@Body() query: QueryAdminHostDto) {
        const { current, pageSize, sort } = query;
        const filter = this.service.createQueryWhere(query);
        const [list, total] = await this.service.findPagination({ filter, sort, current, pageSize });
        return { list, current, pageSize, total };
    }

    @ApiOperation({ summary: '删除/批量删除管理主机' })
    @ApiResult({ type: Boolean })
    @Post('deletion')
    async removeByAddress(@Body() post: DeleteAdminHostDto) {
        const address = post.address;
        const deleted = await this.service.removeByAddress(address);
        if (!deleted) {
            const error = {
                ...AdminHostError.deleteFailed,
            };
            throw new AdminHostException(error);
        }
        // 更新 iptables
        await this.service.refreshIptables();
        // 日志
        const log = {
            module: this.logMoudle,
            type: this.logType,
            content: 'adminHost.del',
            lanArgs: { address: address.join(',') },
        };
        // 创建带操作日志信息的返回数据
        return success<boolean>(true, log);
    }

    @ApiOperation({ summary: '启用/停用管理主机' })
    @ApiResult({ type: Boolean })
    @Patch('status')
    async status(@Body() post: UpOrDownAdminHostDto, @I18n() i18n: I18nContext) {
        const { address, status } = post;
        const addressStr = address.join(',');
        // 所有必须存在
        await this.service.mustHasByAddress(address);
        let error = {
            ...AdminHostError.downFailed,
            args: { address: addressStr },
        };
        let statusContent = i18n.t('adminHost.log.statusFalse');
        if (status === 'up') {
            error = {
                ...AdminHostError.upFailed,
                args: { address: addressStr },
            };
            statusContent = i18n.t('adminHost.log.statusTrue');
        }
        const doc = { status: status === 'up' ? 1 : 0 };
        const filter = {
            address: { $in: address },
        };
        const updated = await this.service.updateMany({ filter, doc }, error);
        // 更新 iptables
        await this.service.refreshIptables();
        // 日志
        let log: any = {};
        if (updated.modifiedCount) {
            log = {
                module: this.logMoudle,
                type: this.logType,
                content: 'adminHost.status',
                lanArgs: { address: addressStr, status: statusContent },
            };
        }
        // 创建带操作日志信息的返回数据
        return success(updated, log);
    }

    @ApiOperation({ summary: '添加管理主机' })
    @ApiResult({ type: Boolean })
    @Post()
    async create(@Body() post: CreateAdminHostDto) {
        const addr = [];
        if (post.ipv4?.address) {
            addr.push(post.ipv4.address);
        }
        if (post.ipv6?.address) {
            addr.push(post.ipv6.address);
        }
        if (addr.length < 1) {
            const error = {
                ...AdminHostError.mustLeastOne,
            };
            throw new AdminHostException(error);
        }
        const added = await this.service.create(post);
        const address = addr.join(',');
        if (!added) {
            const error = {
                ...AdminHostError.addFailed,
                args: { address },
            };
            throw new AdminHostException(error);
        }
        // 更新 iptables
        await this.service.refreshIptables();
        // 日志
        const log = {
            module: this.logMoudle,
            type: this.logType,
            content: 'adminHost.add',
            lanArgs: { address },
        };
        // 创建带操作日志信息的返回数据
        return success<boolean>(true, log);
    }

    @ApiOperation({ summary: '获取指定管理主机信息' })
    @ApiResult({ type: AdminHostDto })
    @Get(':adminHostId')
    async findInfo(@Param('adminHostId', ParseObjectIdPipe) adminHostId: string) {
        return await this.service.findInfo(adminHostId);
    }

    @ApiOperation({ summary: '修改管理主机' })
    @ApiResult({ type: Boolean })
    @Patch(':adminHostId')
    async update(
        @Param('adminHostId', ParseObjectIdPipe) adminHostId: string,
        @Body() post: UpdateAdminHostDto,
        @I18n() i18n: I18nContext,
    ) {
        // 检查数据是否存在
        const oldData = await this.service.findInfo(adminHostId);
        // 提取修改内容
        const withKey = ['status', 'description', 'address', 'mac', 'netmask', 'prefixlen'];
        const { change, target } = hasChangeWith(withKey, oldData, post);
        let updated: any = true;
        let log: any = {};
        if (change.length) {
            // 如果地址改变判断是否已经存在
            if (change.includes('address')) {
                await this.service.hasAddress(post.address);
            }
            updated = await this.service.updateById(adminHostId, post);
            if (!updated) {
                const error = {
                    ...AdminHostError.updateFailed,
                    args: { address: oldData.address },
                };
                throw new AdminHostException(error);
            }
            const content = [];
            if (change.includes('status')) {
                let status = '';
                if (target.status) {
                    status = i18n.t('adminHost.log.statusTrue');
                } else {
                    status = i18n.t('adminHost.log.statusFalse');
                }
                content.push(i18n.t('adminHost.log.status', { args: { content: status } }));
            }
            if (oldData.type === 4) {
                if (change.includes('address') && target.address) {
                    content.push(
                        i18n.t('adminHost.log.ipv4address', { args: { content: target.address } }),
                    );
                }
                if (change.includes('netmask') && target.netmask) {
                    content.push(
                        i18n.t('adminHost.log.ipv4netmask', { args: { content: target.netmask } }),
                    );
                }
            } else if (oldData.type === 6) {
                if (change.includes('address') && target.address) {
                    content.push(
                        i18n.t('adminHost.log.ipv6address', { args: { content: target.address } }),
                    );
                }
                if (change.includes('prefixlen') && target.prefixlen) {
                    content.push(
                        i18n.t('adminHost.log.ipv6prefixlen', { args: { content: target.prefixlen } }),
                    );
                }
            }
            if (change.includes('mac') && target.mac) {
                content.push(i18n.t('adminHost.log.mac', { args: { content: target.mac } }));
            }
            if (change.includes('description') && target.description) {
                content.push(
                    i18n.t('adminHost.log.description', { args: { content: target.description } }),
                );
            }
            // 更新 iptables
            await this.service.refreshIptables();
            // 日志
            log = {
                module: this.logMoudle,
                type: this.logType,
                content: 'adminHost.modify',
                lanArgs: { address: oldData.address, content: content.join() },
            };
        }
        // 创建带操作日志信息的返回数据
        return success(updated, log);
    }
}
