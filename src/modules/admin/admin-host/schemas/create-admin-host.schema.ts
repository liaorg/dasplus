import { NetMaskArr } from '../../network/consts';

// 添加管理主机校验规则
export const createAdminHostSchema = {
    type: 'object',
    // 状态必填
    required: ['status'],
    properties: {
        // 状态为数字0/1
        status: {
            type: 'integer',
            enum: [0, 1],
            errorMessage: {
                type: 'api.validate.integer',
                enum: 'api.validate.enum|{"enum": "0,1"}',
            },
        },
        ipv4: {
            // ipv4地址和子网掩码必填
            type: 'object',
            ipv4Host: {
                type: 'object',
                required: ['address', 'netmask'],
                properties: {
                    address: { type: 'string', format: 'ipv4' },
                    netmask: { type: 'string', enum: NetMaskArr },
                    mac: {
                        type: 'string',
                        macColon: true,
                        // not: { enum: ['FF:FF:FF:FF:FF:FF', '00:00:00:00:00:00', 'ff:ff:ff:ff:ff:ff'] },
                        errorMessage: {
                            macColon: 'api.validate.macColon',
                            // not: 'api.validate.not|{"not": "FF:FF:FF:FF:FF:FF,00:00:00:00:00:00,ff:ff:ff:ff:ff:ff"}',
                        },
                    },
                },
                errorMessage: {
                    properties: {
                        address: 'api.validate.ipv4',
                        netmask: 'api.validate.netmask',
                    },
                    required: {
                        address: 'api.validate.required',
                        netmask: 'api.validate.required',
                    },
                },
            },
            errorMessage: {
                type: 'api.validate.object',
            },
        },
        ipv6: {
            // ipv6地址和前缀长度必填
            type: 'object',
            ipv6Host: {
                type: 'object',
                required: ['address', 'prefixlen'],
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
                    mac: {
                        type: 'string',
                        macColon: true,
                        // not: { enum: ['FF:FF:FF:FF:FF:FF', '00:00:00:00:00:00', 'ff:ff:ff:ff:ff:ff'] },
                        errorMessage: {
                            macColon: 'api.validate.macColon',
                            // not: 'api.validate.not|{"not": "FF:FF:FF:FF:FF:FF,00:00:00:00:00:00,ff:ff:ff:ff:ff:ff"}',
                        },
                    },
                },
                errorMessage: {
                    properties: {
                        address: 'api.validate.ipv6',
                        mac: 'api.validate.macColon',
                    },
                    required: {
                        address: 'api.validate.required',
                        prefixlen: 'api.validate.required',
                    },
                },
            },
            errorMessage: {
                type: 'api.validate.object',
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
        },
    },
};
