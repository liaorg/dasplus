import { NetworkError } from '@/common/constants';
import { ApiResult, ApiSecurityAuth } from '@/common/decorators';
import { OperateLogEnum } from '@/common/enum';
import { execSh, success } from '@/common/utils';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import {
    CreateNetworkDto,
    DeleteIpDto,
    DeviceDto,
    ListenNetworkDto,
    NetworkDto,
    NetworkInfoDto,
    UpOrDownNetworkDto,
} from './dto';
import { NetworkException } from './network.exception';
import { NetworkService } from './network.service';

// 抛出 400类(客户端错误)异常 500类(服务器错误)异常
// 出现多级路由时，多级的要排前面定义 role/role-group-list > role/:id

// -- swagger 设置 --begain
// 设置标题
@ApiTags('系统配置-网卡配置')
// token 参数设置
@ApiSecurityAuth()
// -- swagger 设置 --end
// 不要验证 token
@Controller('network')
export class NetworkController {
    private logMoudle = 'network.module';
    private logType = OperateLogEnum.systemAdmin;
    // private defaultAdminPort = 'eth0-1';
    // private defaultMaintainPort = 'eth0-2';
    constructor(private readonly service: NetworkService) {}

    // 启停网卡
    @ApiOperation({ summary: '网卡启停' })
    @ApiResult({ type: Boolean })
    @Patch('status')
    async status(@Body() post: UpOrDownNetworkDto) {
        const { device, status } = post;
        // 获取网卡状态信息
        const oldStatus = await this.service.getStatus(device);
        if (oldStatus.up === status) {
            // 状态没变
            return true;
        }
        let error = {
            ...NetworkError.downFailed,
        };
        // 日志
        const log = {
            module: this.logMoudle,
            type: this.logType,
            content: 'network.down',
            lanArgs: { device },
        };
        if (status === 'up') {
            error = {
                ...NetworkError.upFailed,
            };
            log.content = 'network.up';
        }
        try {
            await execSh('updown-network.sh', [device, status]);
            // await spawnPromise('sh', [`${BIN_PATH}/updown-network.sh`, device, status]);
        } catch (e) {
            throw new NetworkException(error, e);
        }
        // 创建带操作日志信息的返回数据
        return success<boolean>(true, log);
    }

    // 监听网卡
    @ApiOperation({ summary: '网卡监听' })
    @ApiResult({ type: Boolean })
    @Patch('listen')
    async listen(@Body() post: ListenNetworkDto) {
        const { device, status } = post;
        // const filter = { info: { device } };
        const [networkInfo, ipinfo] = await Promise.all([
            // 查询表格，找出网卡名及监听信息
            this.service.findAll(),
            // 获取网卡IP信息
            this.service.findIpInfo(device),
        ]);
        if (status === 'yes' && (ipinfo.ipv4.address || ipinfo.ipv6.address)) {
            // 如果存在 IP 不能设置为监听
            const error = {
                ...NetworkError.notAllowedListenIp,
                args: { device },
            };
            throw new NetworkException(error);
        }
        // 网卡信息
        const network: NetworkInfoDto[] = networkInfo[0]?.info?.filter(
            (item: NetworkInfoDto) => item.device === device,
        );
        if (network?.length) {
            // 不能监听管理口和检修口
            if (network[0].isMaintainPort || network[0].isAdminPort) {
                const error = {
                    ...NetworkError.notAllowedListenPort,
                    args: { device },
                };
                throw new NetworkException(error);
            }
        }
        // 监听口
        let listening = 0;
        let error = {
            ...NetworkError.unListenFailed,
        };
        // 日志
        const log = {
            module: this.logMoudle,
            type: this.logType,
            content: 'network.unlisten',
            lanArgs: { device },
        };
        if (status === 'yes') {
            const networkListening: DeviceDto[] = networkInfo[0]?.listening?.filter(
                (item: DeviceDto) => item.device === device,
            );
            if (networkListening?.length) {
                const error = {
                    ...NetworkError.isListened,
                    args: { device },
                };
                throw new NetworkException(error);
            }
            listening = 1;
            error = {
                ...NetworkError.listenFailed,
            };
            log.content = 'network.listen';
        }
        // 更新网卡记录
        const update = await this.service.updateListening(networkInfo[0]._id, { device, listening });
        if (!update.acknowledged) {
            throw new NetworkException(error);
        }
        // 创建带操作日志信息的返回数据
        return success<boolean>(true, log);
    }
    @ApiOperation({ summary: '删除IP' })
    @ApiResult({ type: Boolean })
    @Post('deletion')
    async delIp(@Body() post: DeleteIpDto) {
        const { device, type } = post;
        // 查询表格，找出网卡名及监听信息
        const filter = { info: { device } };
        const [networkInfo] = await Promise.all([
            // 查询表格，找出网卡名及监听信息
            this.service.findAll(filter),
            // 获取网卡IP信息
            this.service.findIpInfo(device),
        ]);
        const network: NetworkInfoDto[] = networkInfo[0]?.info?.filter(
            (item: NetworkInfoDto) => item.device === device,
        );
        if (network?.length) {
            // 默认管理口/检修口不允许删除IP
            if (network[0].isAdminPort || network[0].isMaintainPort) {
                const error = {
                    ...NetworkError.notAllowDel,
                };
                throw new NetworkException(error);
            }
        }
        await this.service.applyDelete(device, type);
        // 日志
        const log = {
            module: this.logMoudle,
            type: this.logType,
            content: `network.del${type}`,
            lanArgs: { device },
        };
        // 创建带操作日志信息的返回数据
        return success<boolean>(true, log);
    }

    @ApiOperation({ summary: '网卡配置卡片/表格' })
    @ApiResult({ type: [NetworkDto] })
    @Get()
    async findAll(@I18n() i18n: I18nContext) {
        const [networkInfo, interfaces] = await Promise.all([
            // 查询表格，找出网卡名及监听信息
            this.service.findAll(),
            // 获取网卡信息
            this.service.findInterfaces(i18n),
        ]);
        // 数据合并
        interfaces?.forEach((inte, index) => {
            // 网卡信息
            const info: NetworkInfoDto[] = networkInfo[0]?.info?.filter(
                (item: NetworkInfoDto) => item.device === inte.device,
            );
            if (info?.length) {
                if (info[0].name) {
                    interfaces[index].name = info[0].name;
                }
                interfaces[index].isAdminPort = !!info[0].isAdminPort;
                interfaces[index].isMaintainPort = !!info[0].isMaintainPort;
            }
            // 监听口
            const networkListening: DeviceDto[] = networkInfo[0]?.listening?.filter(
                (item: DeviceDto) => item.device === inte.device,
            );
            if (networkListening?.length) {
                interfaces[index].listening = true;
            }
        });
        return interfaces;
    }

    @ApiOperation({ summary: '获取单张网卡信息' })
    @ApiResult({ type: NetworkDto })
    @Get(':device')
    async findOne(@Param('device') device: string, @I18n() i18n: I18nContext) {
        const [networkInfo, interfaces] = await Promise.all([
            // 查询表格，找出网卡名及监听信息
            this.service.findAll(),
            // 获取网卡信息
            this.service.findInterface(device, i18n),
        ]);
        // 数据合并
        // 网卡信息
        const network: NetworkInfoDto[] = networkInfo[0]?.info?.filter(
            (item: NetworkInfoDto) => item.device === device,
        );
        if (network?.length) {
            if (network[0].name) {
                interfaces.name = network[0].name;
            }
            interfaces.isAdminPort = !!network[0]?.isAdminPort;
            interfaces.isMaintainPort = !!network[0]?.isMaintainPort;
        }
        // 监听口
        const networkListening: DeviceDto[] = networkInfo[0]?.listening?.filter(
            (item: DeviceDto) => item.device === device,
        );
        if (networkListening?.length) {
            interfaces.listening = true;
        }
        return interfaces;
    }

    @ApiOperation({ summary: '配置IP' })
    @ApiResult({ type: Boolean })
    @Patch(':device')
    async setIp(
        @Param('device') device: string,
        @Body() post: CreateNetworkDto,
        @I18n() i18n: I18nContext,
    ) {
        // 至少要有一组IP地址
        if (!post.ipv4?.address && !post.ipv6?.address) {
            const error = {
                ...NetworkError.mustOneAddress,
            };
            throw new NetworkException(error);
        }
        const { ipv4, ipv6 } = post;
        const [networkInfo, ipinfo] = await Promise.all([
            // 查询表格，找出网卡名及监听信息
            this.service.findAll(),
            // 获取网卡IP信息
            this.service.findIpInfo(device),
        ]);
        // 判断IP有没改变
        if (
            post.ipv4?.address === ipinfo.ipv4.address &&
            post.ipv4?.netmask === ipinfo.ipv4.netmask &&
            post.ipv6?.address === ipinfo.ipv6.address &&
            post.ipv6?.prefixlen === ipinfo.ipv6.prefixlen &&
            post.ipv4?.gateway === ipinfo.ipv4.gateway &&
            post.ipv6?.gateway === ipinfo.ipv6.gateway
        ) {
            // ip 信息没有变化时直接返回
            return true;
        }
        // 监听口
        const networkListening: DeviceDto[] = networkInfo[0]?.listening?.filter(
            (item: DeviceDto) => item.device === device,
        );
        // 监听网卡不允许设置IP
        if (networkListening?.length && (ipv4 || ipv6)) {
            const error = {
                ...NetworkError.notAllowedSetListenPort,
                args: { device },
            };
            throw new NetworkException(error);
        }
        // 网卡信息
        const network: NetworkInfoDto[] = networkInfo[0]?.info?.filter(
            (item: NetworkInfoDto) => item.device === device,
        );
        if (network?.length) {
            // 默认检修口不允许设置IP
            if (network[0]?.isMaintainPort && (ipv4 || ipv6)) {
                const error = {
                    ...NetworkError.notAllowedSetMaintainPort,
                    args: { device },
                };
                throw new NetworkException(error);
            }
            // 只有管理口才能配置网关
            if (!network[0]?.isAdminPort) {
                // 网关信息不变
                post.ipv4 && (post.ipv4.gateway = '');
                post.ipv6 && (post.ipv6.gateway = '');
            }
        }
        const logContent = [];
        if (post.ipv4?.address !== ipinfo.ipv4.address && post.ipv4?.address) {
            logContent.push(i18n.t('network.log.ipv4address', { args: { content: post.ipv4.address } }));
        }
        if (post.ipv4?.netmask !== ipinfo.ipv4.netmask && post.ipv4?.netmask) {
            logContent.push(i18n.t('network.log.ipv4netmask', { args: { content: post.ipv4.netmask } }));
        }
        if (post.ipv4?.gateway !== ipinfo.ipv4.gateway && post.ipv4?.gateway) {
            logContent.push(i18n.t('network.log.ipv4gateway', { args: { content: post.ipv4.gateway } }));
        }
        if (post.ipv6?.address !== ipinfo.ipv6.address && post.ipv6?.address) {
            logContent.push(i18n.t('network.log.ipv6address', { args: { content: post.ipv6.address } }));
        }
        if (post.ipv6?.prefixlen !== ipinfo.ipv6.prefixlen && post.ipv6?.prefixlen) {
            logContent.push(
                i18n.t('network.log.ipv6prefixlen', { args: { content: post.ipv6.prefixlen } }),
            );
        }
        if (post.ipv6?.gateway !== ipinfo.ipv6.gateway && post.ipv6?.gateway) {
            logContent.push(i18n.t('network.log.ipv6gateway', { args: { content: post.ipv6.gateway } }));
        }
        const updated: any = true;
        let log: any = {};
        if (logContent.length) {
            // ip生效
            await this.service.applyAdd(device, post);
            // 日志
            log = {
                module: this.logMoudle,
                type: this.logType,
                content: 'network.setIp',
                lanArgs: { device, content: logContent.join(',') },
            };
        }
        // 创建带操作日志信息的返回数据
        return success<boolean>(updated, log);
    }

    // @ApiOperation({ summary: '删除IP' })
    // @ApiParam({ name: 'type', enum: DeleteIpTypeEnum })
    // @Delete(':device/type/:type')
    // async delIp(@Param('device') device: string, @Param('type') type: DeleteIpTypeEnum) {
    //     // 查询表格，找出网卡名及监听信息
    //     const where = { device };
    //     const [network] = await Promise.all([
    //         // 查询表格，找出网卡名及监听信息
    //         this.service.findOneBy(where),
    //         // 获取网卡IP信息
    //         this.service.findIpInfo(device),
    //     ]);
    //     if (!isEmpty(network)) {
    //         // 默认管理口/检修口不允许删除IP
    //         if (network.isAdminPort && network.isMaintainPort) {
    //             const error = {
    //                 ...NetworkError.notAllowDel,
    //             };
    //             throw new NetworkException(error);
    //         }
    //     }
    //     await this.service.applyDelete(device, type);
    //     // 日志
    //     const log = {
    //         module: this.logMoudle,
    //         type: this.logType,
    //         content: 'network.delIp',
    //         lanArgs: { device },
    //     };
    //     // 创建带操作日志信息的返回数据
    //     return success<boolean>(true, log);
    // }
}
