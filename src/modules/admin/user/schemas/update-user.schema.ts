// 请求输入输出规范
// 请求参数验证基于 ajv [https://github.com/ajv-validator/ajv]

import { objectIdSchema, userBusinessSchema } from '@/common/schemas';

export const updateUserSchema = {
    type: 'object',
    properties: {
        name: {
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
        roleId: { ...objectIdSchema },
        // 密码要计算sm3值
        oldPassword: {
            type: 'string',
            charSM3: true,
            errorMessage: {
                type: 'api.validate.string',
                charSM3: 'api.validate.charError',
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
        status: {
            type: 'number',
            enum: [0, 1],
            errorMessage: {
                type: 'api.validate.number',
                enum: 'api.validate.enum|{"enum":"0,1"}',
            },
        },
        email: {
            type: ['string', 'null'],
            format: 'email',
            maxLength: 64,
            errorMessage: {
                type: 'api.validate.string',
                format: 'api.validate.email',
                maxLength: 'api.validate.maxLength|{"length":64}',
            },
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
        fullName: {
            type: ['string', 'null'],
            maxLength: 32,
            format: 'cnFullName',
            errorMessage: {
                type: 'api.validate.string',
                maxLength: 'api.validate.maxLength|{"length": 32}',
                format: 'api.validate.cnFullName',
            },
        },
        gender: {
            type: ['number', 'null'],
            // 性别：0-未知|1-男|2-女
            enum: [0, 1, 2],
            errorMessage: {
                type: 'api.validate.number',
                enum: 'api.validate.enum|{"enum":"0,1,2"}',
            },
        },
        address: {
            type: ['string', 'null'],
            maxLength: 128,
            format: 'cnLetterNumberChar',
            errorMessage: {
                type: 'api.validate.string',
                maxLength: 'api.validate.maxLength|{"length": 128}',
                format: 'api.validate.cnLetterNumberChar',
            },
        },
        department: {
            type: ['string', 'null'],
            maxLength: 128,
            format: 'cnLetterNumberChar',
            errorMessage: {
                type: 'api.validate.string',
                maxLength: 'api.validate.maxLength|{"length": 128}',
                format: 'api.validate.cnLetterNumberChar',
            },
        },
        duty: {
            type: ['string', 'null'],
            maxLength: 128,
            format: 'cnLetterNumberChar',
            errorMessage: {
                type: 'api.validate.string',
                maxLength: 'api.validate.maxLength|{"length": 128}',
                format: 'api.validate.cnLetterNumberChar',
            },
        },
        idNumber: {
            type: ['string', 'null'],
            maxLength: 18,
            idNumber: true,
            errorMessage: {
                type: 'api.validate.string',
                maxLength: 'api.validate.maxLength|{"length": 18}',
                idNumber: 'api.validate.idNumber',
            },
        },
        phoneNumber: {
            type: 'string',
            nullable: true,
            anyOf: [{ format: 'cnPhoneNumber' }, { format: 'cnFixedPhoneNumber' }],
        },
        qq: {
            type: ['number', 'null'],
            format: 'qqNumber',
            errorMessage: {
                type: 'api.validate.number',
                format: 'api.validate.qqNumber',
            },
        },
        // 业务系统信息
        ...userBusinessSchema,
    },
    // 修改密码时必填项
    // if: { properties: { password: { charSM3: true } } },
    // then: {
    //     required: ['oldPassword', 'repassword'],
    //     errorMessage: {
    //         required: {
    //             oldPassword: 'api.validate.required',
    //             password: 'api.validate.required',
    //             repassword: 'api.validate.required',
    //         },
    //     },
    // },
    // else: { required: [] },
    errorMessage: {
        properties: {
            phoneNumber: 'api.validate.phoneNumber',
        },
    },
};
