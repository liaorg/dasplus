import { Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { sm3 } from 'hash-wasm';
import { defaultUser } from '../auth/consts';
import { createPassword } from '@/common/utils';
import { InitDBService } from '../common/init-db';
import { MongoDbService } from '@/common/services';
import { User, UserSchema } from '@/modules/admin/user/schemas';

/**
 * 恢复密码的相关操作
 */

export const initLogger = new Logger('restore', { timestamp: true });

// 恢复数据
async function restore(service: MongoDbService, user: Partial<User>) {
    const passwordHash = await sm3(user.password);
    const password = await createPassword(passwordHash);
    const filter = { name: user.name };
    const doc = { password, password_update_date: 0, update_date: Date.now() };
    await service.updateOne({ filter, doc });
}

export async function restorePasswordData(
    dasService: InitDBService,
    i18n: I18nService,
    userName: string,
) {
    try {
        initLogger.log(i18n.t('init.begainRestore') + ' users');
        const connection = dasService.getConnection();
        const service = new MongoDbService(connection.model('User', UserSchema));
        if (userName === 'all') {
            // 恢复所有用户
            await Promise.all(
                defaultUser.map(async (user) => {
                    return await restore(service, user);
                }),
            );
            initLogger.log(i18n.t('init.restoreSuccess'));
        } else {
            // 恢复单个用户
            // 获取默认数据
            const filterUser = defaultUser.filter((user) => user.name === userName);
            if (filterUser.length) {
                const user = filterUser[0];
                await restore(service, user);
                initLogger.log(i18n.t('init.restoreSuccess'));
            } else {
                initLogger.log(i18n.t('init.notDefaultUser', { args: { name: userName } }));
            }
        }
    } catch (error) {
        initLogger.error(error);
    } finally {
        // 结束恢复数据
        initLogger.log(i18n.t('init.finishedRestore') + ' users');
    }
}
