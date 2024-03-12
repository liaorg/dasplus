import { createPassword } from '@/common/utils';
import { RoleSchema } from '@/modules/admin/role/schemas';
import { UserSchema } from '@/modules/admin/user/schemas';
import { RoleGroupSchema } from '@/modules/core/role-group/schemas';
import { Logger } from '@nestjs/common';
import { sm3 } from 'hash-wasm';
import { I18nService } from 'nestjs-i18n';
import { InitDBService } from '../common/init-db';
import {
    defaultAdminRoute,
    defaultElement,
    defaultMenu,
    defaultRole,
    defaultRoleGroup,
    defaultUser,
} from './consts';
import { initAdminRouteData } from './init-admin-route';
import { initElementData } from './init-element';
import { initMenuData } from './init-menu';

export const initLogger = new Logger('das', { timestamp: true });

// 初始化默认用户，菜单，角色组，角色等
export async function initAuthDefaultData(dasService: InitDBService, i18n: I18nService) {
    // initLogger.log(i18n.t('init.begainInitDb'));
    // 数据库初始化
    const dbName = ' default auth';
    try {
        const connection = dasService.getConnection();
        // 添加默认数据
        // 角色组
        const roleGroupModel = connection.model('RoleGroup', RoleGroupSchema);
        const roleGroups = defaultRoleGroup.map((value) => {
            return new roleGroupModel(value);
        });
        // 角色
        const roleModel = connection.model('Role', RoleSchema);
        const roles = defaultRole.map((value) => {
            const role = new roleModel(value);
            // 所属角色组
            // 默认角色名与默认角色组名相同
            role.roleGroup = roleGroups.filter((group) => group.name === value.name)[0]._id;
            return role;
        });
        // 用户
        const userModel = connection.model('User', UserSchema);
        const users = await Promise.all(
            defaultUser.map(async (value) => {
                const user = new userModel(value);
                // 改变密码
                const password = await sm3(value.password);
                user.password = await createPassword(password);
                return user;
            }),
        );

        // 一个用户只能对应一个角色
        // 一个角色只能对应一个角色组
        const tablename = 'users roles role_groups';
        initLogger.log(i18n.t('init.begainInitTable', { args: { tablename } }));
        await Promise.all([
            // 角色组
            ...roleGroups.map((value) => value.save()),
            // 角色
            ...roles.map((value) => value.save()),
            // 用户
            ...users.map((value) => value.save()),
        ]);
        initLogger.log(i18n.t('init.finishedInitTable', { args: { tablename } }));
        // 添加权限
        await Promise.all([
            // 添加菜单权限
            initMenuData(dasService, defaultMenu, i18n),
            // 添加页面api权限
            initAdminRouteData(dasService, defaultAdminRoute, i18n),
            // 添加要隐藏的页面元素权限
            initElementData(dasService, defaultElement, i18n),
        ]);
    } catch (error) {
        initLogger.log(i18n.t('init.initDbFailed') + dbName);
        throw error;
    }
}
