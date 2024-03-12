// 请求输入输出规范
// 请求参数验证基于 ajv [https://github.com/ajv-validator/ajv]

// import { objectIdSchema, paginationSchema } from '@/common/schemas';
import { paginationSchema } from '@/common/schemas';

export const queryUserSchema = {
    type: 'object',
    properties: {
        ...paginationSchema,
        name: {
            type: 'string',
            minLength: 3,
            maxLength: 32,
            format: 'letterNumber_',
            errorMessage: {
                type: 'api.validate.string',
                minLength: 'api.validate.minLength|{"length":3}',
                maxLength: 'api.validate.maxLength|{"length":32}',
                format: 'api.validate.letterNumber_',
            },
        },
        status: {
            type: 'number',
            enum: [0, 1],
            errorMessage: {
                type: 'api.validate.number',
                enum: 'api.validate.enum|{"enum":"0,1"}',
            },
        },
        // roleId: {
        //     type: 'string',
        //     mongodbObjectId: true,
        //     errorMessage: {
        //         type: 'api.validate.string',
        //         mongodbObjectId: 'api.validate.objectIdError',
        //     },
        // },
    },
};
