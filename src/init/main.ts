import { createFile, execSh } from '@/common/utils';
import { DATA_PATH, mongodbConfig } from '@/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import minimist from 'minimist';
import { I18nService } from 'nestjs-i18n';
import { initAuthDefaultData } from './auth/init-auth';
import { initDefaultConfigure } from './auth/init-configure';
import { InitDBService } from './common/init-db';
import { InitModule } from './init.module';
import { restorePasswordData } from './restore/password';
import { upgradeAuthData, upgradeData } from './upgrade-data';

const initLogger = new Logger('InitBootstrap', { timestamp: true });

// 启动应用
async function bootstrap() {
    const app = await NestFactory.createApplicationContext(InitModule);

    // 连接数据库
    const { dasConfig, dbfwConfig } = mongodbConfig();
    // 系统管理
    const dasUri = dasConfig.uri;
    const dasOpt = { ...dasConfig };
    Reflect.deleteProperty(dasOpt, 'uri');
    Reflect.deleteProperty(dasOpt, 'lazyConnection');
    const dasService = new InitDBService(dasUri, dasOpt);

    // 引擎相关
    const dbfwUri = dbfwConfig.uri;
    const dbfwOpt = { ...dbfwConfig };
    Reflect.deleteProperty(dbfwOpt, 'uri');
    Reflect.deleteProperty(dbfwOpt, 'lazyConnection');
    const dbfwService = new InitDBService(dbfwUri, dbfwOpt);

    // application logic...
    const i18n: I18nService = app.get(I18nService);
    // 获取命令行参数
    const argvs = minimist(process.argv.slice(2));

    const dbName = ' das';
    initLogger.log(i18n.t('init.dbConnected') + dbName);

    if (argvs.restorePassword) {
        // 恢复默认用户的默认密码
        // node dist/init/main.js --restorePassword all
        // node dist/init/main.js --restorePassword admin
        await restorePasswordData(dasService, i18n, argvs.restorePassword);
    } else {
        // 初始化默认用户，路由菜单，角色类型，角色等
        if (argvs.init === true) {
            // node dist/init/main.js --init
            initLogger.log(i18n.t('init.begainInit'));
            // 删除数据库及其所有数据
            await dasService.dropDatabase();
            await dbfwService.dropDatabase();
            await Promise.all([
                // 角色用户权限相关
                initAuthDefaultData(dasService, i18n),
                // 系统配置
                initDefaultConfigure(dasService, dbfwService, i18n),
            ]);
            initLogger.log(i18n.t('init.finishedInit'));
            const initedFile = `${DATA_PATH}/inited.lock`;
            await createFile(initedFile);
            initLogger.log('create inited lock file inited.lock');
            // 添加默认 IP
            execSh('init-network.sh').catch((e) => {
                initLogger.error(i18n.t('init.initNetworkFailed') + e);
            });
        } else if (argvs.upgrade === 'auth') {
            // 升级权限
            // node dist/init/main.js --upgrade auth
            initLogger.log(i18n.t('init.begainUpgeade'));
            await Promise.all([
                // 升级权限
                upgradeAuthData(dasService, i18n),
                // 升级其他数据
                upgradeData(dbfwService, i18n),
            ]);
        } else {
            initLogger.error(i18n.t('init.requiredParam'));
        }
    }
    await dasService.close();
    await dbfwService.close();
    await app.close();
}
(async (): Promise<void> => {
    try {
        await bootstrap();
    } catch (error) {
        initLogger.error(error);
        process.exit(1);
    }
})();
