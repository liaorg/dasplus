import { paginationSchema } from '@/common/schemas';

// 以下为参数验证
// 查询
export const queryDesensitizationSchema = {
    type: 'object',
    properties: {
        ...paginationSchema,
        author: {
            type: 'string',
            enum: ['user', 'factory'],
            errorMessage: {
                type: 'api.validate.string',
                enum: 'api.validate.enum|{"enum": "user,factory"}',
            },
        },
        name: {
            type: 'string',
            format: 'cnLetterNumberChar',
            maxLength: 32,
            errorMessage: {
                type: 'api.validate.string',
                format: 'api.validate.cnLetterNumberChar',
                maxLength: 'api.validate.maxLength|{"length":32}',
            },
        },
        enable: {
            type: 'boolean',
            errorMessage: {
                type: 'api.validate.boolean',
            },
        },
    },
    errorMessage: {
        properties: {
            ipList: 'api.validate.ipExcludeFirstRule',
            ids: 'api.validate.array',
        },
    },
};

// 添加，修改
export const createDesensitizationSchema = {
    type: 'object',
    required: ['name', 'regex', 'sample'],
    properties: {
        author: {
            type: 'string',
            enum: ['user', 'factory'],
            errorMessage: {
                type: 'api.validate.string',
                enum: 'api.validate.enum|{"enum": "user,factory"}',
            },
        },
        name: {
            type: 'string',
            format: 'cnLetterNumberChar',
            maxLength: 32,
            errorMessage: {
                type: 'api.validate.string',
                format: 'api.validate.cnLetterNumberChar',
                maxLength: 'api.validate.maxLength|{"length":32}',
            },
        },
        // 正则表达式
        regex: {
            type: 'string',
            format: 'unheadAsterisk',
            maxLength: 370,
            errorMessage: {
                type: 'api.validate.string',
                format: 'api.validate.unheadAsterisk',
                maxLength: 'api.validate.maxLength|{"length":370}',
            },
        },
        // 描述
        description: {
            type: 'string',
            charDesc: true,
            maxLength: 128,
            errorMessage: {
                type: 'api.validate.string',
                charDesc: 'api.validate.charDesc',
                maxLength: 'api.validate.maxLength|{"length":128}',
            },
        },
        // 示例
        // sample: {
        //     type: 'string',
        // },
        mask_public_left: {
            type: 'number',
            enum: [0, 1, 2, 3, 4, 5],
            errorMessage: {
                type: 'api.validate.string',
                enum: 'api.validate.enum|{"enum": "0,1,2,3,4,5"}',
            },
        },
        mask_public_right: {
            type: 'number',
            enum: [0, 1, 2, 3, 4, 5],
            errorMessage: {
                type: 'api.validate.string',
                enum: 'api.validate.enum|{"enum": "0,1,2,3,4,5"}',
            },
        },
        maskchr: {
            type: 'string',
            enum: ['*', 'X', 'Y'],
            errorMessage: {
                type: 'api.validate.string',
                enum: 'api.validate.enum|{"enum": "*,X,Y"}',
            },
        },
    },
    errorMessage: {
        required: {
            name: 'api.validate.required',
            regex: 'api.validate.required',
            sample: 'api.validate.required',
        },
    },
};
