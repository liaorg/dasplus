// 请求输入输出规范
// 请求参数验证基于 ajv [https://github.com/ajv-validator/ajv]

export const loginValidationSchema = {
    type: 'object',
    // required: ['username', 'password'],
    properties: {
        username: {
            type: 'string',
            minLength: 3,
            maxLength: 32,
            format: 'letterNumber_',
            not: { pattern: '^[\\d]+' },
            errorMessage: {
                type: 'api.validate.string',
                minLength: 'api.validate.minLength|{"length":3}',
                maxLength: 'api.validate.maxLength|{"length":32}',
                format: 'api.validate.letterNumber_',
                not: 'api.validate.unheadNumber',
            },
        },
        password: {
            type: 'string',
            charSM3: true,
            errorMessage: {
                type: 'api.validate.string',
                charSM3: 'api.validate.charError',
            },
        },
        nonce: {
            type: 'integer',
            errorMessage: {
                type: 'api.validate.integer',
            },
        },
        encryptData: {
            type: 'string',
            errorMessage: {
                type: 'api.validate.string',
            },
        },
    },
    errorMessage: {
        required: {
            username: 'api.validate.required',
            password: 'api.validate.required',
        },
    },
};
