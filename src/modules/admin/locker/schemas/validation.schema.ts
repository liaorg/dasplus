import { paginationSchema } from '@/common/schemas';

// 以下为参数验证
// 查询
export const queryLockerSchema = {
    type: 'object',
    properties: {
        ...paginationSchema,
    },
};

// 解锁
export const unLockerSchema = {
    type: 'object',
    required: ['address'],
    properties: {
        // IP地址
        address: {
            type: 'array',
            uniqueItemsBlur: true,
            items: { type: 'string', oneOf: [{ format: 'ipv4' }, { format: 'ipv6' }] },
            errorMessage: {
                type: 'api.validate.array',
                uniqueItemsBlur: 'api.validate.uniqueItemsBlur',
            },
        },
    },
    errorMessage: {
        required: {
            address: 'api.validate.required',
        },
        properties: {
            address: 'api.validate.ip',
        },
    },
};

// 添加
export const createLockerSchema = {
    type: 'object',
    required: ['address'],
    properties: {
        // IP地址
        address: {
            type: 'string',
            oneOf: [{ format: 'ipv4' }, { format: 'ipv6' }],
        },
        // 状态 0-锁定|1-解锁
        status: {
            type: 'number',
            enum: [0, 1],
            errorMessage: {
                type: 'api.validate.number',
                enum: 'api.validate.enum|{"enum": "0,1"}',
            },
        },
        // 锁定次数
        times: {
            type: 'number',
            positive: true,
            errorMessage: {
                type: 'api.validate.number',
                positive: 'api.validate.positive',
            },
        },
        // 锁定秒数
        seconds: {
            type: 'number',
            positive: true,
            errorMessage: {
                type: 'api.validate.number',
                positive: 'api.validate.positive',
            },
        },
    },
    errorMessage: {
        required: {
            address: 'api.validate.required',
        },
        properties: {
            address: 'api.validate.ip',
        },
    },
};
