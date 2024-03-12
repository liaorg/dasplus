// 请求输入输出规范
// 请求参数验证基于 ajv [https://github.com/ajv-validator/ajv]

export const CreateAdminRouteSchema = {
    type: 'object',
    required: ['path'],
    properties: {
        type: {
            type: 'string',
            title: 'route.type',
            errorMessage: {
                type: 'must be string',
            },
        },
    },
    errorMessage: {
        properties: {
            type: 'must be string',
        },
        required: {
            type: 'route.error.requiredType',
        },
    },
};
