import { SystemConfigureError } from '@/common/constants';
import { ApiResult, ApiSecurityAuth } from '@/common/decorators';
import { OperateLogEnum } from '@/common/enum';
import { isObject, success } from '@/common/utils';
import {
    defaultLoginSafety,
    defaultPasswordSafety,
    defaultRemoteDebug,
    defaultServerPort,
} from '@/modules/core/system-configure/constants';
import { ConfigTypeEnum } from '@/modules/core/system-configure/enum';
import { SystemConfigureException } from '@/modules/core/system-configure/system-configure.exception';
import { SystemConfigureService } from '@/modules/core/system-configure/system-configure.service';
import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AdminHostService } from '../admin-host/admin-host.service';
import {
    LoginSafetyDto,
    PasswordSafetyDto,
    PortStatusDto,
    RemoteDebugDto,
    SecurityConfigureDto,
    ServerPortDto,
    UpdateLoginSafetyDto,
    UpdatePasswordSafetyDto,
    UpdateRemoteDebugDto,
    UpdateServerPortDto,
} from './dto';
import { SecurityConfigureService } from './security-configure.service';

// 抛出 400类(客户端错误)异常 500类(服务器错误)异常
// 出现多级路由时，多级的要排前面定义 role/role-group-list > role/:id

// -- swagger 设置 --begain
// 设置标题
@ApiTags('系统配置-系统安全配置')
// token 参数设置
@ApiSecurityAuth()
// -- swagger 设置 --end
@Controller('security-configure')
export class SecurityConfigureController {
    private logType = OperateLogEnum.systemAdmin;
    constructor(
        private readonly service: SecurityConfigureService,
        private readonly systemConfigureService: SystemConfigureService,
        private readonly adminHostService: AdminHostService,
    ) {}

    @ApiOperation({ summary: '保存登录安全配置' })
    @ApiResult({ type: Boolean })
    @Patch('login-safety')
    async saveLoginSafetyConfigure(@Body() update: UpdateLoginSafetyDto, @I18n() i18n: I18nContext) {
        const configType = ConfigTypeEnum.loginSafety;
        const logMoudle = 'configure.security.loginSafety.module';
        const logContent = 'configure.security.loginSafety.modify';
        const { updated, log } = await this.service.saveConfigure<LoginSafetyDto>(
            {
                configType,
                logMoudle,
                logContent,
                update,
            },
            i18n,
            defaultLoginSafety,
        );
        // 创建带操作日志信息的返回数据
        return success(updated, log);
    }

    @ApiOperation({ summary: '保存密码安全配置' })
    @ApiResult({ type: Boolean })
    @Patch('password-safety')
    async savePasswordSafetyConfigure(
        @Body() update: UpdatePasswordSafetyDto,
        @I18n() i18n: I18nContext,
    ) {
        const configType = ConfigTypeEnum.passwordSafety;
        const logMoudle = 'configure.security.passwordSafety.module';
        const logContent = 'configure.security.passwordSafety.modify';
        const { updated, log } = await this.service.saveConfigure<PasswordSafetyDto>(
            {
                configType,
                logMoudle,
                logContent,
                update,
            },
            i18n,
            defaultPasswordSafety,
        );
        // 创建带操作日志信息的返回数据
        return success(updated, log);
    }

    @ApiOperation({ summary: '端口安全配置启停' })
    @ApiResult({ type: Boolean })
    @Patch('server-port')
    async saveServerPortConfigure(@Body() update: UpdateServerPortDto, @I18n() i18n: I18nContext) {
        const configType = ConfigTypeEnum.serverPort;
        // 判断服务是否存在允许配置中
        const defaultServer = defaultServerPort.filter((item) => item.name === update.name);
        if (!defaultServer?.length) {
            const error = {
                ...SystemConfigureError.serverNotExisted,
                args: { server: update?.name },
            };
            throw new SystemConfigureException(error);
        }
        // 服务对应端口
        const serverPort = [];
        // 允许停用的端口
        const allowChangePort = [];
        defaultServer.forEach((item) =>
            item.port.forEach((port) => {
                serverPort.push(port.value);
                if (port.allowChange) {
                    allowChangePort.push(port.value);
                }
            }),
        );
        update?.port?.forEach((item, index) => {
            // 判断端口是否存在
            if (!serverPort.includes(item.value)) {
                const error = {
                    ...SystemConfigureError.portNotExisted,
                    args: { port: item.value },
                };
                throw new SystemConfigureException(error);
            }
            // 判断端口状态是否允许停用
            update.port[index].allowChange = true;
            if (!allowChangePort.includes(item.value)) {
                update.port[index].status = true;
                update.port[index].allowChange = false;
            }
        });
        // 合并提交数据与默认数据
        let newUpdateData: any = {};
        if (isObject(defaultServer[0])) {
            newUpdateData = { ...defaultServer[0], ...update };
        } else {
            newUpdateData = { ...update };
        }
        // 端口配置单独处理
        const updateNewData = [];
        // 修改值
        let hasName = false;
        const upPort = [];
        const downPort = [];
        const change = [];
        const content = [];
        let isNew = true;
        // 检查安全配置是否存在
        const oldData = await this.systemConfigureService.findOne({ filter: { type: configType } });
        if (oldData) {
            isNew = false;
            // 提取修改内容
            (oldData?.content as any[]).forEach((item) => {
                if (item.name === update.name) {
                    hasName = true;
                    (item.port as PortStatusDto[]).forEach((p, index) => {
                        const portData = (newUpdateData as ServerPortDto).port.filter((v) => {
                            if (p.allowChange && v.value === p.value && v.status !== p.status) {
                                return true;
                            }
                            return false;
                        });
                        if (portData?.length) {
                            change.push('port');
                            item.port[index] = {
                                value: portData[0].value,
                                status: portData[0].status,
                                allowChange: p.allowChange,
                            };
                            if (portData[0].status) {
                                upPort.push(portData[0].value);
                            } else {
                                downPort.push(portData[0].value);
                            }
                        }
                    });
                }
                updateNewData.push(item);
            });
            if (!hasName) {
                change.push('port');
                isNew = true;
                // 数据库中没有就添加
                updateNewData.push(newUpdateData);
            }
            if (upPort.length) {
                content.push(
                    i18n.t('configure.security.serverPort.log.up', {
                        args: { port: upPort.join() },
                    }),
                );
            }
            if (downPort.length) {
                content.push(
                    i18n.t('configure.security.serverPort.log.down', {
                        args: { port: downPort.join() },
                    }),
                );
            }
        }
        let updated: any = true;
        let log: any = {};
        if (change.length) {
            if (isNew) {
                update?.port?.forEach((p) => {
                    if (p.status) {
                        upPort.push(p.value);
                    } else {
                        downPort.push(p.value);
                    }
                });
                if (upPort.length) {
                    content.push(
                        i18n.t('configure.security.serverPort.log.up', {
                            args: { port: upPort.join() },
                        }),
                    );
                }
                if (downPort.length) {
                    content.push(
                        i18n.t('configure.security.serverPort.log.down', {
                            args: { port: downPort.join() },
                        }),
                    );
                }
            }
            if (updateNewData.length) {
                updated = await this.systemConfigureService.updateConfigure(configType, updateNewData);
            } else {
                updated = await this.systemConfigureService.create({
                    type: configType,
                    content: [{ ...newUpdateData }],
                });
            }
            // 端口启停 远程调试启停时
            // 更新 iptables
            await this.adminHostService.refreshIptables();
            log = {
                module: 'configure.security.serverPort.module',
                type: this.logType,
                content: 'configure.security.serverPort.modify',
                lanArgs: { server: update.name, content: content.join() },
            };
        }
        // 创建带操作日志信息的返回数据
        return success(updated, log);
    }

    @ApiOperation({ summary: '远程调试启停' })
    @ApiResult({ type: Boolean })
    @Patch('remote-debug')
    async saveRemoteDebugConfigure(@Body() update: UpdateRemoteDebugDto, @I18n() i18n: I18nContext) {
        const configType = ConfigTypeEnum.remoteDebug;
        const logMoudle = 'configure.security.remoteDebug.module';
        const logContent = 'configure.security.remoteDebug.modify';
        const { updated, log } = await this.service.saveConfigure<RemoteDebugDto>(
            {
                configType,
                logMoudle,
                logContent,
                update,
            },
            i18n,
            defaultRemoteDebug,
        );
        // 创建带操作日志信息的返回数据
        return success(updated, log);
    }

    @ApiOperation({ summary: '获取安全配置信息' })
    @ApiResult({ type: SecurityConfigureDto })
    @Get()
    async findAll() {
        return this.service.getSafetyConfigure();
    }
}
