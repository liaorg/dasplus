import { SystemConfigureError } from '@/common/constants';
import { OperateLogEnum } from '@/common/enum';
import { hasChangeWith, isObject } from '@/common/utils';
import {
    defaultLoginSafety,
    defaultPasswordSafety,
    defaultRemoteDebug,
    defaultServerPort,
} from '@/modules/core/system-configure/constants';
import { ConfigTypeEnum } from '@/modules/core/system-configure/enum';
import { SystemConfigureException } from '@/modules/core/system-configure/system-configure.exception';
import { SystemConfigureService } from '@/modules/core/system-configure/system-configure.service';
import { Injectable } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AdminHostService } from '../admin-host/admin-host.service';
import { RemoteDebugDto, SecurityConfigureDto, ServerPortDto } from './dto';

@Injectable()
export class SecurityConfigureService {
    private logType = OperateLogEnum.systemAdmin;
    // 配置类型为 2登录安全配置 3密码安全配置 4端口安全配置
    constructor(
        private readonly systemConfigureService: SystemConfigureService,
        private readonly adminHostService: AdminHostService,
    ) {}
    // 获取安全配置信息 2登录安全配置 3密码安全配置 4端口安全配置
    async getSafetyConfigure(): Promise<SecurityConfigureDto> {
        const systemConf: SecurityConfigureDto = {
            // 登录安全配置
            loginSafety: { ...defaultLoginSafety },
            // 密码安全配置
            passwordSafety: { ...defaultPasswordSafety },
            // 端口安全配置
            serverPort: { ...defaultServerPort },
            // 远程调试配置
            remoteDebug: { ...defaultRemoteDebug },
        };
        try {
            const data = await this.systemConfigureService.getCacheData([
                ConfigTypeEnum.loginSafety,
                ConfigTypeEnum.passwordSafety,
                ConfigTypeEnum.serverPort,
                ConfigTypeEnum.remoteDebug,
            ]);
            if (!data?.length) {
                const error = {
                    ...SystemConfigureError.getConfigureFailed,
                };
                throw new SystemConfigureException(error);
            }
            data?.forEach((value) => {
                try {
                    if (value.type === ConfigTypeEnum.loginSafety) {
                        Object.assign(systemConf.loginSafety, value.content);
                    } else if (value.type === ConfigTypeEnum.passwordSafety) {
                        Object.assign(systemConf.passwordSafety, value.content);
                    } else if (value.type === ConfigTypeEnum.serverPort) {
                        systemConf.serverPort = value.content as ServerPortDto[];
                    } else if (value.type === ConfigTypeEnum.remoteDebug) {
                        systemConf.remoteDebug = value.content as RemoteDebugDto;
                        systemConf.remoteDebug.port = undefined;
                    }
                } catch (e) {
                    //
                }
            });
            // 不返回远程调试端口号
            Reflect.deleteProperty(systemConf.remoteDebug, 'port');
        } catch (error) {}
        return systemConf;
    }

    // 保存配置
    async saveConfigure<T>(options: any, @I18n() i18n: I18nContext, defaultData?: T) {
        const { configType, logMoudle, logContent, update } = options;
        // 合并提交数据与默认数据
        let newUpdateData: any = {};
        if (isObject(defaultData)) {
            newUpdateData = { ...defaultData, ...update };
        } else {
            newUpdateData = { ...update };
        }
        let change = [];
        // 检查安全配置是否存在
        const oldData = await this.systemConfigureService.getCacheData([configType]);
        if (oldData.length) {
            // 提取修改内容
            const withKey = [];
            let hasChange: any;
            switch (configType) {
                case ConfigTypeEnum.loginSafety:
                    withKey.push(
                        'numOfLoginFailedToLocked',
                        'timeOfLoginFailedToLocked',
                        'timeOfLogout',
                        'timeLimitOfPassword',
                        'timeOfMaintain',
                        'statusOfcaptcha',
                        'forceReset',
                    );
                    hasChange = hasChangeWith(withKey, oldData[0].content, newUpdateData);
                    change = [...hasChange.change];
                    break;
                case ConfigTypeEnum.passwordSafety:
                    withKey.push(
                        'minLength',
                        'maxSameLetter',
                        'lowercase',
                        'uppercase',
                        'number',
                        'specialLetter',
                        'weakCheck',
                        'excludeWord',
                    );
                    hasChange = hasChangeWith(withKey, oldData[0].content, newUpdateData);
                    change = [...hasChange.change];
                    break;
                case ConfigTypeEnum.remoteDebug:
                    withKey.push('status');
                    hasChange = hasChangeWith(withKey, oldData[0].content, newUpdateData);
                    change = [...hasChange.change];
                    break;
                default:
                    break;
            }
        } else {
            // 添加
            switch (configType) {
                case ConfigTypeEnum.loginSafety:
                    change.push(
                        'numOfLoginFailedToLocked',
                        'timeOfLoginFailedToLocked',
                        'timeOfLogout',
                        'timeLimitOfPassword',
                        'timeOfMaintain',
                        'statusOfcaptcha',
                        'forceReset',
                    );
                    break;
                case ConfigTypeEnum.passwordSafety:
                    change.push(
                        'minLength',
                        'maxSameLetter',
                        'lowercase',
                        'uppercase',
                        'number',
                        'specialLetter',
                        'weakCheck',
                        'excludeWord',
                    );
                    break;
                case ConfigTypeEnum.remoteDebug:
                    change.push('status');
                    break;
                default:
                    break;
            }
        }
        let updated: any = true;
        let log: any = {};
        const content = [];
        if (change.length) {
            switch (configType) {
                case ConfigTypeEnum.loginSafety:
                    // 登录失败次数锁定次数
                    if (change.includes('numOfLoginFailedToLocked')) {
                        content.push(
                            i18n.t('configure.security.loginSafety.log.numOfLoginFailedToLocked', {
                                args: {
                                    source: oldData[0].content.numOfLoginFailedToLocked,
                                    target: newUpdateData.numOfLoginFailedToLocked,
                                },
                            }),
                        );
                    }
                    // 登录失败锁定时间
                    if (change.includes('timeOfLoginFailedToLocked')) {
                        content.push(
                            i18n.t('configure.security.loginSafety.log.timeOfLoginFailedToLocked', {
                                args: {
                                    source: oldData[0].content.timeOfLoginFailedToLocked,
                                    target: newUpdateData.timeOfLoginFailedToLocked,
                                },
                            }),
                        );
                    }
                    // 无操作自动注销时间
                    if (change.includes('timeOfLogout')) {
                        content.push(
                            i18n.t('configure.security.loginSafety.log.timeOfLogout', {
                                args: {
                                    source: oldData[0].content.timeOfLogout,
                                    target: newUpdateData.timeOfLogout,
                                },
                            }),
                        );
                    }
                    // 口令使用期限
                    if (change.includes('timeLimitOfPassword')) {
                        content.push(
                            i18n.t('configure.security.loginSafety.log.timeLimitOfPassword', {
                                args: {
                                    source: oldData[0].content.timeLimitOfPassword,
                                    target: newUpdateData.timeLimitOfPassword,
                                },
                            }),
                        );
                    }
                    // 维护提醒周期
                    if (change.includes('timeOfMaintain')) {
                        content.push(
                            i18n.t('configure.security.loginSafety.log.timeOfMaintain', {
                                args: {
                                    source: oldData[0].content.timeOfMaintain,
                                    target: newUpdateData.timeOfMaintain,
                                },
                            }),
                        );
                    }
                    // 验证码开关
                    if (change.includes('statusOfcaptcha')) {
                        let status = '';
                        if (newUpdateData.statusOfcaptcha) {
                            status = i18n.t('configure.security.enableToTrue');
                        } else {
                            status = i18n.t('configure.security.enableToFalse');
                        }
                        content.push(
                            i18n.t('configure.security.loginSafety.log.statusOfcaptcha', {
                                args: { status },
                            }),
                        );
                    }
                    // 强制重置密码
                    if (change.includes('forceReset')) {
                        let status = '';
                        if (newUpdateData.forceReset) {
                            status = i18n.t('configure.security.yes');
                        } else {
                            status = i18n.t('configure.security.no');
                        }
                        content.push(
                            i18n.t('configure.security.loginSafety.log.forceReset', {
                                args: { status },
                            }),
                        );
                    }
                    break;
                case ConfigTypeEnum.passwordSafety:
                    // 最短密码长度
                    if (change.includes('minLength')) {
                        content.push(
                            i18n.t('configure.security.passwordSafety.log.minLength', {
                                args: {
                                    source: oldData[0].content.minLength,
                                    target: newUpdateData.minLength,
                                },
                            }),
                        );
                    }
                    // 密码中允许同一字符连续出现的最大次数
                    if (change.includes('maxSameLetter')) {
                        content.push(
                            i18n.t('configure.security.passwordSafety.log.maxSameLetter', {
                                args: {
                                    source: oldData[0].content.maxSameLetter,
                                    target: newUpdateData.maxSameLetter,
                                },
                            }),
                        );
                    }
                    // 密码复杂度
                    const complexity = [];
                    if (
                        change.includes('lowercase') ||
                        change.includes('uppercase') ||
                        change.includes('number') ||
                        change.includes('specialLetter')
                    ) {
                        if (newUpdateData.lowercase) {
                            complexity.push(i18n.t('configure.security.passwordSafety.log.lowercase'));
                        }
                        if (newUpdateData.uppercase) {
                            complexity.push(i18n.t('configure.security.passwordSafety.log.uppercase'));
                        }
                        if (newUpdateData.number) {
                            complexity.push(i18n.t('configure.security.passwordSafety.log.number'));
                        }
                        if (newUpdateData.specialLetter) {
                            complexity.push(
                                i18n.t('configure.security.passwordSafety.log.specialLetter'),
                            );
                        }
                    }
                    if (complexity.length) {
                        content.push(
                            i18n.t('configure.security.passwordSafety.log.complexity', {
                                args: { content: complexity.join() },
                            }),
                        );
                    }
                    // 弱密码检测
                    if (change.includes('weakCheck')) {
                        let status = '';
                        if (newUpdateData.weakCheck) {
                            status = i18n.t('configure.security.enableToTrue');
                        } else {
                            status = i18n.t('configure.security.enableToFalse');
                        }
                        content.push(
                            i18n.t('configure.security.passwordSafety.log.weakCheck', {
                                args: { status },
                            }),
                        );
                    }
                    break;
                case ConfigTypeEnum.remoteDebug:
                    if (change.includes('status')) {
                        let status = i18n.t('configure.security.remoteDebug.log.down');
                        if (update.status === true) {
                            status = i18n.t('configure.security.remoteDebug.log.up');
                        }
                        content.push(status);
                    }
                    break;
                default:
                    break;
            }
            if (oldData) {
                updated = await this.systemConfigureService.updateConfigure(configType, newUpdateData);
            } else {
                updated = await this.systemConfigureService.create({
                    type: configType,
                    content: { ...newUpdateData },
                });
            }
            log = {
                module: logMoudle,
                type: this.logType,
                content: logContent,
                lanArgs: { content: content.join() },
            };
            if (configType === ConfigTypeEnum.remoteDebug) {
                // 端口启停 远程调试启停时
                // 更新 iptables
                await this.adminHostService.refreshIptables();
            }
        }
        // 创建带操作日志信息的返回数据
        return { updated, log };
    }
}
