import { paginationSchema } from '@/common/schemas';

// 查询管理主机校验规则
export const queryAdminHostSchema = {
    type: 'object',
    properties: {
        ...paginationSchema,
        // 目标网络
        address: {
            type: 'string',
            maxLength: 45,
            ipLike: true,
            errorMessage: {
                type: 'api.validate.string',
                maxLength: 'api.validate.maxLength|{"length": 45}',
                ipLike: 'api.validate.ipLike',
            },
        },
        // 状态为数字0/1
        status: {
            type: 'number',
            enum: [0, 1, -1],
            errorMessage: {
                type: 'api.validate.number',
                enum: 'api.validate.enum|{"enum": "0,1,-1"}',
            },
        },
        // MAC 地址
        mac: {
            type: 'string',
            maxLength: 17,
            macColonLike: true,
            errorMessage: {
                type: 'api.validate.string',
                maxLength: 'api.validate.maxLength|{"length": 17}',
                macColonLike: 'api.validate.macColonLike',
            },
        },
        description: {
            type: 'string',
            maxLength: 64,
            // 匹配 '、"、<、>
            not: { type: 'string', format: 'charQuote' },
            errorMessage: {
                maxLength: 'api.validate.maxLength|{"length":64}',
                not: 'api.validate.notCharQuote',
            },
        },
    },
};
