// 请求输入输出规范
// 请求参数验证基于 ajv [https://github.com/ajv-validator/ajv]

import { arrayObjectIdSchema } from '@/common/schemas';

export const resetPasswordSchema = {
    type: 'object',
    required: ['ids', 'password', 'repassword'],
    properties: {
        ids: { ...arrayObjectIdSchema },
        // 密码要计算sm3值
        password: {
            type: 'string',
            charSM3: true,
            errorMessage: {
                type: 'api.validate.string',
                charSM3: 'api.validate.charError',
            },
        },
        repassword: {
            type: 'string',
            // 要与 password 相等
            const: { $data: '1/password' },
            errorMessage: {
                type: 'api.validate.string',
                // const: 'api.validate.const|{"const": ${1/password}}',
                const: 'user.error.repasswordError',
            },
        },
    },
    errorMessage: {
        required: {
            ids: 'api.validate.required',
            password: 'api.validate.required',
            repassword: 'api.validate.required',
        },
        properties: {
            ids: 'api.validate.positive',
        },
    },
};
