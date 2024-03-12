/**
 * 添加页面route及权限关系
 */
import { MongoDbService, ObjectIdType } from '@/common/services';
import { RoleSchema } from '@/modules/admin/role/schemas';
import { AdminRoute, AdminRouteSchema } from '@/modules/core/admin-route/schemas';
import { PermissionSchema } from '@/modules/core/permission/schemas';
import { roleGroupTypeConst } from '@/modules/core/role-group/consts';
import { RoleGroupTypeEnum } from '@/modules/core/role-group/enums';
import { RoleGroupSchema } from '@/modules/core/role-group/schemas';
import { I18nService } from 'nestjs-i18n';
import { InitDBService } from '../common/init-db';
import { AdminRouteInterface } from './consts';
import { initLogger } from './init-auth';

interface ServiceInterface {
    adminRoute: MongoDbService;
    permission: MongoDbService;
    role: MongoDbService;
    roleGroup: MongoDbService;
}

// 添加权限及关联关系
const addPermissionRelationData = async (
    adminRouteId: ObjectIdType,
    roleGroupTypeData: RoleGroupTypeEnum[],
    service: ServiceInterface,
    dasService: InitDBService,
) => {
    const { adminRoute, permission, role, roleGroup } = service;
    // 添加权限 permission
    const permissionData = await permission.insert({ doc: { type: 'admin_route' } });
    // 更新角色权限
    const update = dasService.updateRolePermission(
        roleGroupTypeData,
        roleGroup,
        role,
        permissionData._id,
    );
    return await Promise.all([
        // 添加 route 权限
        adminRoute.updateOne({ filter: { _id: adminRouteId }, doc: { permission: permissionData._id } }),
        // 更新角色权限
        ...update,
    ]);
};

// 添加页面route数据
export const initAdminRouteData = async (
    dasService: InitDBService,
    adminRouteData: AdminRouteInterface[],
    i18n: I18nService,
) => {
    const tablename = 'admin_routes';
    initLogger.log(i18n.t('init.begainInitTable', { args: { tablename } }));
    const connection = dasService.getConnection();
    const service: ServiceInterface = {
        adminRoute: new MongoDbService<AdminRoute>(connection.model('AdminRoute', AdminRouteSchema)),
        permission: new MongoDbService(connection.model('Permission', PermissionSchema)),
        role: new MongoDbService(connection.model('Role', RoleSchema)),
        roleGroup: new MongoDbService(connection.model('RoleGroup', RoleGroupSchema)),
    };
    await Promise.all(
        adminRouteData.map(async (item) => {
            const data = await service.adminRoute.insert({
                doc: {
                    path: item.path,
                    locale: item.locale,
                    menuPath: item.menuPath,
                    method: item.method,
                },
            });
            // 添加route操作权限
            const roleGroupTypeData =
                item.roleGroupType === '*' ? roleGroupTypeConst : item.roleGroupType;
            return await addPermissionRelationData(data._id, roleGroupTypeData, service, dasService);
        }),
    );
    initLogger.log(i18n.t('init.finishedInitTable', { args: { tablename } }));
};
