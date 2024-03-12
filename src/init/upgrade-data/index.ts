import { Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InitDBService } from '../common/init-db';
import { upgradeMenuData } from './menu';
import { upgradeAdminRouteData } from './admin-route';
// import { MongoDbService } from '@/common/services';

export const initLogger = new Logger('authdb', { timestamp: true });

// 升级 用户，角色组，角色，菜单，路由等
export async function upgradeAuthData(dasService: InitDBService, i18n: I18nService) {
    try {
        // 升级菜单
        await upgradeMenuData(dasService, i18n);
        // 升级路由
        await upgradeAdminRouteData(dasService, i18n);
    } catch (error) {
        initLogger.error(i18n.t('init.upgeadeFailed', { args: { tablename: 'menus admin_routes' } }));
        throw error;
    }
}

// 升级其他数据
export async function upgradeData(_dbfwService: InitDBService, _i18n: I18nService) {
    return true;
    // const tablename = 'desensitization_cfg';
    // try {
    //     const connectionDfbw = dbfwService.getConnection();
    //     // 升级默认数据脱敏规则
    //     initLogger.log(i18n.t('init.begainUpgradeTable', { args: { tablename } }));
    //     const serviceDesen = new MongoDbService(
    //         connectionDfbw.model('DesensitizationCfg', DesensitizationCfgSchema),
    //     );
    //     await Promise.all(
    //         defaultDesensitization.map((item) => {
    //             return serviceDesen.updateMany({
    //                 filter: { name: item.name },
    //                 doc: item,
    //                 // 不存在就插入
    //                 options: { upsert: true },
    //             });
    //         }),
    //     );
    //     initLogger.log(i18n.t('init.finishedUpgradeTable', { args: { tablename } }));
    // } catch (error) {
    //     initLogger.error(i18n.t('init.upgeadeFailed', { args: { tablename } }));
    //     throw error;
    // }
}
