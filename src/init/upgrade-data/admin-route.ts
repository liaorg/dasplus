// 可以有哪些操作类型 取值范围 ["GET", "POST", "DELETE", "PATCH", "PUT", "HEAD"];
// method: string;
// 拥有权限的角色组id集合，*表示所有角色都有的操作
// roleGroupType: "*" | RoleGroupTypeEnum[];

import { MongoDbService } from '@/common/services';
import { Role, RoleDocument, RoleSchema } from '@/modules/admin/role/schemas';
import { AdminRoute, AdminRouteSchema } from '@/modules/core/admin-route/schemas';
import { PermissionSchema } from '@/modules/core/permission/schemas';
import { RoleGroupTypeEnum } from '@/modules/core/role-group/enums';
import { RoleGroup, RoleGroupSchema } from '@/modules/core/role-group/schemas';
import { Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InitDBService } from '../common/init-db';
import { upgradeAdminRouteData } from './consts';
// import { includesObjectId } from '@/common/utils';

export const initLogger = new Logger('authdb', { timestamp: true });

interface ServiceInterface {
    adminRoute: MongoDbService<AdminRoute>;
    permission: MongoDbService;
    role: MongoDbService<Role, RoleDocument>;
    roleGroup: MongoDbService<RoleGroup>;
}

// 升级 用户，角色组，角色，菜单，路由等
export async function upgradeAdminRoute(dasService: InitDBService, i18n: I18nService) {
    try {
        // 添加页面api权限
        const tablename = 'admin_routes';
        initLogger.log(i18n.t('init.begainUpgradeTable', { args: { tablename } }));
        const connection = dasService.getConnection();
        const service: ServiceInterface = {
            adminRoute: new MongoDbService(connection.model('AdminRoute', AdminRouteSchema)),
            permission: new MongoDbService(connection.model('Permission', PermissionSchema)),
            role: new MongoDbService(connection.model('Role', RoleSchema)),
            roleGroup: new MongoDbService(connection.model('RoleGroup', RoleGroupSchema)),
        };
        // 获取系统角色组
        const roleGroup = await service.roleGroup.find();
        // 添加路由
        const updated = await service.adminRoute.transaction(async (session) => {
            try {
                for (let i = 0; i < upgradeAdminRouteData.length; i++) {
                    const item = upgradeAdminRouteData[i];
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
                    const exists = await service.adminRoute.findOne({
                        filter: {
                            path: item.path,
                            method: item.method,
                        },
                    });
                    if (exists) {
                        // 存在则查询角色组是否有该路由，如果有就忽略，没有就要添加
                        for (let j = 0; j < roleGroupTypeData.length; j++) {
                            const group = roleGroupTypeData[j];
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
                    } else {
                        // 添加权限 permission
                        const permissionData = await service.permission.insert({
                            doc: { type: 'admin_route' },
                            options: { session },
                        });
                        if (permissionData) {
                            // 添加路由
                            await service.adminRoute.insert({
                                doc: {
                                    path: item.path,
                                    locale: item.locale,
                                    menuPath: item.menuPath,
                                    method: item.method,
                                    permission: permissionData._id,
                                },
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
