/**
 * 角色组, 出厂固定为:
 * @value 1 systemAdmin 系统管理员
 * @value 2 securityAdmin 系统安全员
 * @value 3 auditAdmin 系统审计员
 */
export enum RoleGroupTypeEnum {
    // 系统管理员
    systemAdmin = 1,
    // 系统安全员
    securityAdmin = 2,
    // 系统审计员
    auditAdmin = 3,
}

export enum RoleGroupNameEnum {
    auditAdmin = 'defaultAuditAdmin',
    securityAdmin = 'defaultSecurityAdmin',
    systemAdmin = 'defaultSystemAdmin',
}
