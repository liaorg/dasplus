import { NetMaskArr } from '../../network/consts';

// 添加管理主机校验规则
export const createNetworkSchema = {
    type: 'object',
    properties: {
        ipv4: {
            // ipv4地址和子网掩码必填
            type: 'object',
            ipv4Host: {
                type: 'object',
                required: ['address', 'netmask'],
                properties: {
                    address: { type: 'string', format: 'ipv4' },
                    netmask: { type: 'string', enum: NetMaskArr },
                    netmaskInt: { type: 'number', positiveRange: [1, 32] },
                    gateway: { type: 'string', format: 'ipv4' },
                },
                errorMessage: {
                    properties: {
                        address: 'api.validate.ipv4',
                        netmask: 'api.validate.netmask',
                        netmaskInt: 'api.validate.positiveRange|{"range": "1-32"}',
                        gateway: 'api.validate.ipv4',
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
                    gateway: { type: 'string', format: 'ipv6' },
                },
                errorMessage: {
                    properties: {
                        address: 'api.validate.ipv6',
                        gateway: 'api.validate.ipv6',
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
    },
};
