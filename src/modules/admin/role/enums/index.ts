/**
 * 角色, 出厂固定为:
 * @value defaultSystemAdmin 系统管理员
 * @value defaultSecurityAdmin 系统安全员
 * @value defaultAuditAdmin 系统审计员
 */

export enum RoleNameEnum {
    audit = 'defaultAuditAdmin',
    security = 'defaultSecurityAdmin',
    system = 'defaultSystemAdmin',
}
