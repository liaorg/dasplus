// 可以有哪些操作类型 取值范围 ["GET", "POST", "DELETE", "PATCH", "PUT", "HEAD"];
// method: string;
// 拥有权限的角色组id集合，*表示所有角色都有的操作
// roleGroupType: "*" | RoleGroupTypeEnum[];

import { MongoDbService, ObjectIdType } from '@/common/services';
import { Menu, MenuSchema } from '@/modules/admin/menu/schemas';
import { Role, RoleSchema } from '@/modules/admin/role/schemas';
import { PermissionSchema } from '@/modules/core/permission/schemas';
import { RoleGroupTypeEnum } from '@/modules/core/role-group/enums';
import { RoleGroup, RoleGroupSchema } from '@/modules/core/role-group/schemas';
import { Logger } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { MenuInterface } from '../auth/consts';
import { InitDBService } from '../common/init-db';
import { menuData } from './consts';

export const initLogger = new Logger('authdb', { timestamp: true });

interface ServiceInterface {
    menu: MongoDbService<Menu>;
    permission: MongoDbService;
    role: MongoDbService<Role>;
    roleGroup: MongoDbService<RoleGroup>;
}

// 循环添加菜单，子菜单
async function updateMenu(
    service: ServiceInterface,
    roleGroup: RoleGroup[],
    data: MenuInterface[],
    session: ClientSession,
    parentId?: ObjectIdType,
) {
    try {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            // 获取角色和角色组信息
            let roleGroupTypeData: RoleGroup[];
            if (item.roleGroupType === '*') {
                roleGroupTypeData = [...roleGroup];
            } else {
                roleGroupTypeData = roleGroup.filter((group) =>
                    (item.roleGroupType as RoleGroupTypeEnum[]).includes(group.type),
                );
            }
            // 查询是否在
            const exists = await service.menu.findOne({
                filter: {
                    menuUrl: item.menuUrl,
                },
            });
            if (exists) {
                // 更新菜单
                await service.menu.updateOne({
                    filter: { _id: exists._id },
                    // 需要更新的字段
                    doc: { order: item.order },
                    options: { session },
                });
                // 存在则查询角色组是否有该菜单，如果有就忽略，没有就要添加
                for (let j = 0; j < roleGroupTypeData.length; j++) {
                    const group = roleGroupTypeData[j];
                    if (!group.permissions?.includes(exists.permission as any)) {
                        // 添加角色组权限
                        await service.roleGroup.updateOne({
                            filter: { _id: group._id },
                            doc: { $addToSet: { permissions: exists.permission } },
                            options: { session },
                        });
                        // 添加角色权限
                        await service.role.updateMany({
                            filter: { roleGroup: group._id },
                            doc: { $addToSet: { permissions: exists.permission } },
                            options: { session },
                        });
                    }
                }
                // 添加子菜单
                if (item?.children?.length > 0) {
                    const addedChild = await updateMenu(
                        service,
                        roleGroup,
                        item.children,
                        session,
                        exists._id,
                    );
                    if (!addedChild) {
                        return false;
                    }
                }
            } else {
                // 添加权限 permission
                const permissionData = await service.permission.insert({
                    doc: { type: 'menu' },
                    options: { session },
                });
                if (permissionData) {
                    // 添加菜单
                    const added = await service.menu.insert({
                        doc: { ...item, parentId: parentId || '', permission: permissionData._id },
                        options: { session },
                    });
                    // 更新角色权限
                    for (let j = 0; j < roleGroupTypeData.length; j++) {
                        const group = roleGroupTypeData[j];
                        // 添加角色组权限
                        await service.roleGroup.updateOne({
                            filter: { _id: group._id },
                            doc: { $addToSet: { permissions: permissionData._id } },
                            options: { session },
                        });
                        // 添加角色权限
                        await service.role.updateMany({
                            filter: { roleGroup: group._id },
                            doc: { $addToSet: { permissions: permissionData._id } },
                            options: { session },
                        });
                    }
                    // 添加子菜单
                    if (item?.children?.length > 0) {
                        const addedChild = await updateMenu(
                            service,
                            roleGroup,
                            item.children,
                            session,
                            added._id,
                        );
                        if (!addedChild) {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
            }
        }
        return true;
    } catch (error) {
        initLogger.error(error);
        return false;
    }
}

// 升级菜单
export async function upgradeMenuData(dasService: InitDBService, i18n: I18nService) {
    try {
        // 添加页面菜单权限
        const tablename = 'menus';
        initLogger.log(i18n.t('init.begainUpgradeTable', { args: { tablename } }));
        const connection = dasService.getConnection();
        const service: ServiceInterface = {
            menu: new MongoDbService(connection.model('menus', MenuSchema)),
            permission: new MongoDbService(connection.model('Permission', PermissionSchema)),
            role: new MongoDbService(connection.model('Role', RoleSchema)),
            roleGroup: new MongoDbService(connection.model('RoleGroup', RoleGroupSchema)),
        };
        // 获取系统角色组
        const roleGroup = await service.roleGroup.find();
        // 添加菜单
        const updated = await service.menu.transaction(async (session) => {
            const added = await updateMenu(service, roleGroup, menuData, session);
            if (!added) {
                return false;
            }
            return true;
        });
        if (!updated) {
            initLogger.error(i18n.t('init.upgeadeFailed'));
        } else {
            initLogger.log(i18n.t('init.finishedUpgradeTable', { args: { tablename } }));
        }
    } catch (error) {
        initLogger.error(i18n.t('init.upgeadeFailed'));
        throw error;
    }
}
