// 请求输入输出规范
// 请求参数验证基于 ajv [https://github.com/ajv-validator/ajv]

import { arrayObjectIdSchema } from '@/common/schemas';

export const deleteUserSchema = {
    type: 'object',
    required: ['ids'],
    properties: {
        ids: { ...arrayObjectIdSchema },
    },
    errorMessage: {
        required: {
            ids: 'user.error.required',
        },
    },
};
