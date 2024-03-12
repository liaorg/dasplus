/**
 * 添加菜单及权限关系
 */

import { MongoDbService, ObjectIdType } from '@/common/services';
import { Menu, MenuDocument, MenuSchema } from '@/modules/admin/menu/schemas';
import { Role, RoleSchema } from '@/modules/admin/role/schemas';
import { Permission, PermissionSchema } from '@/modules/core/permission/schemas';
import { roleGroupTypeConst } from '@/modules/core/role-group/consts';
import { RoleGroupTypeEnum } from '@/modules/core/role-group/enums';
import { RoleGroup, RoleGroupSchema } from '@/modules/core/role-group/schemas';
import { I18nService } from 'nestjs-i18n';
import { InitDBService } from '../common/init-db';
import { MenuInterface } from './consts';
import { initLogger } from './init-auth';

interface ServiceInterface {
    menu: MongoDbService<Menu>;
    permission: MongoDbService<Permission>;
    role: MongoDbService<Role>;
    roleGroup: MongoDbService<RoleGroup>;
}

// 添加菜单权限 menus permission
// 添加角色组权限  role_groups permissions
// 添加角色权限 roles permissions
const addPermissionRelationData = async (
    menuId: ObjectIdType,
    roleGroupTypeData: RoleGroupTypeEnum[],
    service: ServiceInterface,
    dasService: InitDBService,
) => {
    const { menu, permission, role, roleGroup } = service;
    // 添加权限 permission
    const permissionData = await permission.insert({ doc: { type: 'menu' } });
    // 更新角色权限
    const update = dasService.updateRolePermission(
        roleGroupTypeData,
        roleGroup,
        role,
        permissionData._id,
    );
    return await Promise.all([
        // 添加菜单权限
        menu.updateOne({ filter: { _id: menuId }, doc: { permission: permissionData._id } }),
        // 更新角色权限
        ...update,
    ]);
};

// 添加子菜单
export const addChildMenuData = async (
    children: MenuInterface[],
    parentId: ObjectIdType,
    roleGroupTypeData: RoleGroupTypeEnum[],
    service: ServiceInterface,
    dasService: InitDBService,
) => {
    const { menu } = service;
    await Promise.all(
        children.map(async (child) => {
            child.parentId = parentId;
            const data = await menu.insert({ doc: child });
            const chileRoleGroup = child.roleGroupType
                ? child.roleGroupType === '*'
                    ? roleGroupTypeConst
                    : child.roleGroupType.filter((type) => roleGroupTypeData.includes(type))
                : roleGroupTypeData;
            // 添加子菜单
            if (child.children?.length > 0) {
                await addChildMenuData(child.children, data._id, chileRoleGroup, service, dasService);
            }
            // 添加权限及关联关系
            return addPermissionRelationData(data._id, chileRoleGroup, service, dasService);
        }),
    );
};
// 添加菜单
export const initMenuData = async (
    dasService: InitDBService,
    menuData: MenuInterface[],
    i18n: I18nService,
) => {
    const tablename = 'menus';
    initLogger.log(i18n.t('init.begainInitTable', { args: { tablename } }));
    const connection = dasService.getConnection();
    const model = {
        menu: connection.model('Menu', MenuSchema),
        permission: connection.model('Permission', PermissionSchema),
        role: connection.model('Role', RoleSchema),
        roleGroup: connection.model('RoleGroup', RoleGroupSchema),
    };
    const service: ServiceInterface = {
        menu: new MongoDbService<Menu, MenuDocument>(model.menu),
        permission: new MongoDbService(model.permission),
        role: new MongoDbService(model.role),
        roleGroup: new MongoDbService(model.roleGroup),
    };
    await Promise.all(
        menuData.map(async (item) => {
            const data = await service.menu.insert({ doc: { ...item } });
            // 添加子菜单
            const roleGroupTypeData = item.roleGroupType
                ? item.roleGroupType === '*'
                    ? roleGroupTypeConst
                    : item.roleGroupType
                : [];
            if (item.children?.length > 0) {
                await addChildMenuData(item.children, data._id, roleGroupTypeData, service, dasService);
            }
            // 添加权限及关联关系
            return await addPermissionRelationData(data._id, roleGroupTypeData, service, dasService);
        }),
    );

    initLogger.log(i18n.t('init.finishedInitTable', { args: { tablename } }));
};
