import { RoleGroupNameEnum, RoleGroupTypeEnum } from '../enums';

/**
 * 角色组, 出厂固定为:
 * @value 1 systemAdmin 系统管理员
 * @value 2 securityAdmin 系统安全员
 * @value 3 auditAdmin 系统审计员
 */
export const roleGroupTypeConst = [
    RoleGroupTypeEnum.systemAdmin,
    RoleGroupTypeEnum.securityAdmin,
    RoleGroupTypeEnum.auditAdmin,
];

// 默认角色组名
// 初始化时与默认角色名相同
export const defaultRoleGroupNameConst = [
    RoleGroupNameEnum.auditAdmin,
    RoleGroupNameEnum.securityAdmin,
    RoleGroupNameEnum.systemAdmin,
];
