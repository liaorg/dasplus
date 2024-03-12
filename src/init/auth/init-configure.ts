import { MongoDbService } from '@/common/services';
import {
    defaultLoginSafety,
    defaultPasswordSafety,
    defaultRemoteDebug,
} from '@/modules/core/system-configure/constants';
import { Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { defaultServerPort } from '@/modules/core/system-configure/constants';
import { ConfigTypeEnum } from '@/modules/core/system-configure/enum';
import { SystemConfigure, SystemConfigureSchema } from '@/modules/core/system-configure/schemas';
import { DesensitizationCfg, DesensitizationCfgSchema } from '@/modules/data/desensitization/schemas';
import { InitDBService } from '../common/init-db';
import { defaultDesensitization } from './consts/default-desensitization';

export const initLogger = new Logger('das', { timestamp: true });

// 初始化默认的配置
export async function initDefaultConfigure(
    dasService: InitDBService,
    dbfwService: InitDBService,
    i18n: I18nService,
) {
    // 数据库初始化
    const dbName = ' default configure';
    try {
        const connectionDas = dasService.getConnection();
        const tablename = 'system_configures desensitization_cfg';
        initLogger.log(i18n.t('init.begainInitTable', { args: { tablename } }));
        // 安全配置 登录安全 密码安全 端口安全 远程调试
        const model = connectionDas.model('SystemConfigure', SystemConfigureSchema);
        const service = new MongoDbService<SystemConfigure>(model);

        // 默认数据脱敏规则
        const connectionDfbw = dbfwService.getConnection();
        const modelDesen = connectionDfbw.model('DesensitizationCfg', DesensitizationCfgSchema);
        const serviceDesen = new MongoDbService<DesensitizationCfg>(modelDesen);

        const doc = [
            {
                type: ConfigTypeEnum.loginSafety,
                content: { ...defaultLoginSafety },
            },
            {
                type: ConfigTypeEnum.passwordSafety,
                content: { ...defaultPasswordSafety },
            },
            {
                type: ConfigTypeEnum.serverPort,
                content: defaultServerPort,
            },
            {
                type: ConfigTypeEnum.remoteDebug,
                content: { ...defaultRemoteDebug },
            },
        ];
        await Promise.all([
            // 添加安全配置 登录安全 密码安全 端口安全 远程调试
            service.insertMany({ doc }),
            // 默认数据脱敏规则
            serviceDesen.insertMany({ doc: defaultDesensitization }),
        ]);

        initLogger.log(i18n.t('init.finishedInitTable', { args: { tablename } }));
    } catch (error) {
        initLogger.log(i18n.t('init.initDbFailed') + dbName);
        throw error;
    }
}
