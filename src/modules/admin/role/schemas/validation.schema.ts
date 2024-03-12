import { arrayObjectIdSchema, objectIdSchema } from '@/common/schemas';

const roleSchema = {
    name: {
        type: 'string',
        minLength: 3,
        maxLength: 32,
        format: 'letterNumber_',
        errorMessage: {
            minLength: 'api.validate.maxLength|{"length":3}',
            maxLength: 'api.validate.maxLength|{"length":32}',
            format: 'api.validate.letterNumber_',
        },
    },
    roleGroupId: { ...objectIdSchema },
    permissionIds: {
        ...arrayObjectIdSchema,
    },
    description: {
        type: 'string',
        maxLength: 128,
        charDesc: true,
        errorMessage: {
            type: 'api.validate.string',
            maxLength: 'api.validate.maxLength|{"length": 128}',
            charDesc: 'api.validate.charDesc',
        },
    },
};
// 添加角色
export const createRoleSchema = {
    type: 'object',
    required: ['name', 'roleGroupId', 'permissionIds'],
    properties: {
        ...roleSchema,
    },
    errorMessage: {
        required: {
            name: 'api.validate.required',
            roleGroupId: 'api.validate.required',
            permissionIds: 'api.validate.required',
        },
    },
};
// 更新角色信息
export const updateRoleSchema = {
    type: 'object',
    properties: {
        ...roleSchema,
        userId: { ...objectIdSchema },
    },
    errorMessage: {},
};
// 设置默认管理员
export const updateDefaultAdminerSchema = {
    type: 'object',
    required: ['roleGroupId', 'userId'],
    properties: {
        roleGroupId: { ...objectIdSchema },
        userId: { ...objectIdSchema },
    },
    errorMessage: {
        required: {
            roleGroupId: 'api.validate.required',
            userId: 'api.validate.required',
        },
    },
};
