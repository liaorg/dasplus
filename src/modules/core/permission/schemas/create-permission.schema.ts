// 请求输入输出规范
// 请求参数验证基于 ajv [https://github.com/ajv-validator/ajv]

export const createPermissionSchema = {
    type: 'object',
    required: ['type'],
    properties: {
        type: {
            type: 'string',
            title: 'permission.type',
            default: 'menu',
            errorMessage: {
                type: 'api.validate.string',
            },
        },
    },
    errorMessage: {
        properties: {
            type: 'api.validate.string',
        },
        required: {
            type: 'api.validate.required',
        },
    },
};
