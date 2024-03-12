import { Types } from 'mongoose';

import { RoleNameEnum } from '@/modules/admin/role/enums';
import { RoleGroupNameEnum, RoleGroupTypeEnum } from '@/modules/core/role-group/enums';

// id 值计算
// 9999-12-31 23:59:59 => 253402271999 => fff3d0ff0000000000000000
// 9999-12-31 23:59:58 => 253402271998 => fff3d0fe0000000000000000
export const defaultRoleGroupOid = {
    // 系统管理员
    systemAdmin: new Types.ObjectId('652552f15079d1b694df3ed1'),
    // 系统安全员
    securityAdmin: new Types.ObjectId('652552f15079d1b694df3ed2'),
    // 系统审计员
    auditAdmin: new Types.ObjectId('652552f15079d1b694df3ed3'),
};

export const defaultRoleOid = {
    // 系统管理员
    systemAdmin: new Types.ObjectId('652552f15079d1b694df3ed4'),
    // 系统安全员
    securityAdmin: new Types.ObjectId('652552f15079d1b694df3ed5'),
    // 系统审计员
    auditAdmin: new Types.ObjectId('652552f15079d1b694df3ed6'),
};

export const defaultUserOid = {
    // 系统管理员
    system: new Types.ObjectId('652552f15079d1b694df3eda'),
    // 系统安全员
    security: new Types.ObjectId('652552f15079d1b694df3edb'),
    // 系统审计员
    audit: new Types.ObjectId('652552f15079d1b694df3edc'),
};

// 默认角色组
export const defaultRoleGroup = [
    {
        // 系统管理员组
        _id: defaultRoleGroupOid.systemAdmin,
        type: RoleGroupTypeEnum.systemAdmin,
        name: RoleGroupNameEnum.systemAdmin,
        locale: 'roleGroup.systemAdmin',
        roles: [defaultRoleOid.systemAdmin],
        defaultRole: defaultRoleOid.systemAdmin,
        order: 1,
    },
    {
        // 业务安全员组
        _id: defaultRoleGroupOid.securityAdmin,
        type: RoleGroupTypeEnum.securityAdmin,
        name: RoleGroupNameEnum.securityAdmin,
        locale: 'roleGroup.securityAdmin',
        roles: [defaultRoleOid.securityAdmin],
        defaultRole: defaultRoleOid.securityAdmin,
        order: 2,
    },
    {
        // 系统审计员组
        _id: defaultRoleGroupOid.auditAdmin,
        type: RoleGroupTypeEnum.auditAdmin,
        name: RoleGroupNameEnum.auditAdmin,
        locale: 'roleGroup.auditAdmin',
        roles: [defaultRoleOid.auditAdmin],
        defaultRole: defaultRoleOid.auditAdmin,
        order: 3,
    },
];
// 角色
// 默认角色
export const defaultRole = [
    // 默认系统管理员
    {
        _id: defaultRoleOid.systemAdmin,
        name: RoleNameEnum.system,
        isDefault: true,
        status: 1,
        locale: 'role.defaultSystemAdmin',
        users: [defaultUserOid.system],
        defaultUser: defaultUserOid.system,
        roleGroup: defaultRoleGroupOid.systemAdmin,
        order: 1,
    },
    // 默认业务安全员
    {
        _id: defaultRoleOid.securityAdmin,
        name: RoleNameEnum.security,
        isDefault: true,
        status: 1,
        locale: 'role.defaultSecurityAdmin',
        users: [defaultUserOid.security],
        defaultUser: defaultUserOid.security,
        roleGroup: defaultRoleGroupOid.securityAdmin,
        order: 2,
    },
    // 默认系统审计员
    {
        _id: defaultRoleOid.auditAdmin,
        name: RoleNameEnum.audit,
        isDefault: true,
        status: 1,
        locale: 'role.defaultAuditAdmin',
        users: [defaultUserOid.audit],
        defaultUser: defaultUserOid.audit,
        roleGroup: defaultRoleGroupOid.auditAdmin,
        order: 3,
    },
];
