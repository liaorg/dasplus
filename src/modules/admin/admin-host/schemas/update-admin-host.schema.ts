import { NetMaskArr } from '../../network/consts';

// 修改管理主机校验规则
export const updateAdminHostSchema = {
    type: 'object',
    required: ['status', 'type', 'address'],
    properties: {
        // 状态为数字0/1
        status: {
            type: 'number',
            enum: [0, 1],
            errorMessage: {
                type: 'api.validate.number',
                enum: 'api.validate.enum|{"enum": "0,1"}',
            },
        },
        // 类型 4 ipv4 6 ipv6
        type: {
            type: 'number',
            enum: [4, 6],
            errorMessage: {
                type: 'api.validate.number',
                enum: 'api.validate.enum|{"enum": "4,6"}',
            },
        },
        // MAC 地址
        mac: {
            type: 'string',
            macColon: true,
            // not: { enum: ['FF:FF:FF:FF:FF:FF', '00:00:00:00:00:00', 'ff:ff:ff:ff:ff:ff'] },
            errorMessage: {
                macColon: 'api.validate.macColon',
                // not: 'api.validate.not|{"not": "FF:FF:FF:FF:FF:FF,00:00:00:00:00:00,ff:ff:ff:ff:ff:ff"}',
            },
        },
        // 描述
        description: {
            type: 'string',
            maxLength: 128,
            // 只允许输入中文、字母、数字、中文符号、英文符号（英文单、双引号除外）
            // 允许的符号：  `~!@#$%^&*()_+-={}[]:;<>?,./|\·《》？，。、；’：”【】、
            charDesc: true,
            errorMessage: {
                type: 'api.validate.string',
                maxLength: 'api.validate.maxLength|{"length": 128}',
                charDesc: 'api.validate.charDesc',
            },
        },
    },
    errorMessage: {
        required: {
            status: 'api.validate.required',
            type: 'api.validate.required',
            address: 'api.validate.required',
        },
    },
    // 目标网络
    if: { properties: { type: { const: 6 } } },
    then: {
        // IPV6
        required: ['prefixlen'],
        properties: {
            address: { type: 'string', format: 'ipv6' },
            prefixlen: {
                type: 'number',
                positiveRange: [1, 128],
                errorMessage: {
                    type: 'api.validate.number',
                    positiveRange: 'api.validate.positiveRange|{"range": "1-128"}',
                },
            },
        },
        errorMessage: {
            properties: {
                address: 'api.validate.ipv6',
            },
            required: {
                prefixlen: 'api.validate.required',
            },
        },
    },
    else: {
        // IPV4
        required: ['netmask'],
        properties: {
            address: { type: 'string', format: 'ipv4' },
            netmask: { type: 'string', enum: NetMaskArr },
        },
        errorMessage: {
            properties: {
                address: 'api.validate.ipv4',
                netmask: 'api.validate.netmask',
            },
            required: {
                netmask: 'api.validate.required',
            },
        },
    },
};

// 删除管理主机
export const deleteAdminHostSchema = {
    type: 'object',
    required: ['address'],
    properties: {
        // 目标网络
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
            status: 'api.validate.required',
        },
        properties: {
            address: 'api.validate.ip',
        },
    },
};
// 启用/停用
export const upOrDownAdminHostSchema = {
    type: 'object',
    required: ['status', 'address'],
    properties: {
        // 状态为数字0/1
        status: {
            type: 'string',
            enum: ['up', 'down'],
            errorMessage: {
                type: 'api.validate.number',
                enum: 'api.validate.enum|{"enum": "up,down"}',
            },
        },
        // 目标网络
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
            status: 'api.validate.required',
            address: 'api.validate.required',
        },
        properties: {
            address: 'api.validate.ip',
        },
    },
};
