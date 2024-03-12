/**
 * 添加页面元素及权限关系
 * element
 */
import { MongoDbService, ObjectIdType } from '@/common/services';
import { RoleSchema } from '@/modules/admin/role/schemas';
import { ElementSchema } from '@/modules/core/element/schemas';
import { PermissionSchema } from '@/modules/core/permission/schemas';
import { roleGroupTypeConst } from '@/modules/core/role-group/consts';
import { RoleGroupTypeEnum } from '@/modules/core/role-group/enums';
import { RoleGroupSchema } from '@/modules/core/role-group/schemas';
import { I18nService } from 'nestjs-i18n';
import { InitDBService } from '../common/init-db';
import { ElementInterface } from './consts';
import { initLogger } from './init-auth';

interface ServiceInterface {
    element: MongoDbService;
    permission: MongoDbService;
    role: MongoDbService;
    roleGroup: MongoDbService;
}

// 添加权限及关联关系
const addElementPermissionRelationData = async (
    elementId: ObjectIdType,
    roleGroupTypeData: RoleGroupTypeEnum[],
    service: ServiceInterface,
    dasService: InitDBService,
) => {
    const { element, permission, role, roleGroup } = service;
    // 添加权限 permission
    const permissionData = await permission.insert({ doc: { type: 'element' } });
    // 更新角色权限
    const update = dasService.updateRolePermission(
        roleGroupTypeData,
        roleGroup,
        role,
        permissionData._id,
    );
    return await Promise.all([
        // 添加 element 权限
        element.updateOne({ filter: { _id: elementId }, doc: { permission: permissionData._id } }),
        // 更新角色权限
        ...update,
    ]);
};

// 添加页面元素数据
export const initElementData = async (
    dasService: InitDBService,
    elementData: ElementInterface[],
    i18n: I18nService,
) => {
    const tablename = 'elements';
    initLogger.log(i18n.t('init.begainInitTable', { args: { tablename } }));
    const connection = dasService.getConnection();
    const service: ServiceInterface = {
        element: new MongoDbService(connection.model('Element', ElementSchema)),
        permission: new MongoDbService(connection.model('Permission', PermissionSchema)),
        role: new MongoDbService(connection.model('Role', RoleSchema)),
        roleGroup: new MongoDbService(connection.model('RoleGroup', RoleGroupSchema)),
    };
    await Promise.all(
        elementData.map(async (item) => {
            const data = await service.element.insert({ doc: item });
            // 添加权限
            const roleGroupTypeData =
                item.roleGroupType === '*' ? roleGroupTypeConst : item.roleGroupType;
            return await addElementPermissionRelationData(
                data._id,
                roleGroupTypeData,
                service,
                dasService,
            );
        }),
    );
    initLogger.log(i18n.t('init.finishedInitTable', { args: { tablename } }));
};
