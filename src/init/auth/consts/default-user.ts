import { getUTCTime } from '@/common/utils';
import { RoleNameEnum } from '@/modules/admin/role/enums';
import { defaultRoleOid, defaultUserOid } from './default-role';

// 当前时间戳
const now = getUTCTime();

// 默认密码
// 当前年份
const year = now.year();
const defaultAdmin = {
    systemAdmin: {
        _id: defaultUserOid.system,
        name: 'admin',
        password: `Admin@${year}`,
        business: { id: [], name: [] },
        role: defaultRoleOid.systemAdmin,
        order: 1,
    },
    securityAdmin: {
        _id: defaultUserOid.security,
        name: 'sec',
        password: `Sec@${year}`,
        business: { id: [-1], name: [] },
        role: defaultRoleOid.securityAdmin,
        order: 2,
    },
    auditAdmin: {
        _id: defaultUserOid.audit,
        name: 'audit',
        password: `Audit@${year}`,
        business: { id: [], name: [] },
        role: defaultRoleOid.auditAdmin,
        order: 3,
    },
};

// 一个用户只能属于一个角色
export const defaultUser = [
    // 默认系统管理员
    {
        ...defaultAdmin.systemAdmin,
        isDefault: true,
        status: 1,
        roleName: RoleNameEnum.system,
    },
    // 默认业务安全员
    {
        ...defaultAdmin.securityAdmin,
        isDefault: true,
        status: 1,
        roleName: RoleNameEnum.security,
    },
    // 默认系统审计员
    {
        ...defaultAdmin.auditAdmin,
        isDefault: true,
        status: 1,
        roleName: RoleNameEnum.audit,
    },
];
