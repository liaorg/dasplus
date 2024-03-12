// 网卡启停
export const upOrDownNetworkSchema = {
    type: 'object',
    required: ['device', 'status'],
    properties: {
        device: {
            type: 'string',
            format: 'letterNumberSnak_',
            maxLength: 20,
            not: { enum: ['eth0-1', 'eth0-2'] },
            errorMessage: {
                type: 'api.validate.string',
                maxLength: 'api.validate.maxLength|{"length":20}',
                format: 'api.validate.letterNumberSnak_',
                not: 'api.validate.not|{"not":"eth0-1,eth0-2"}',
            },
        },
        status: {
            type: 'string',
            enum: ['up', 'down'],
        },
    },
    errorMessage: {
        required: {
            device: 'api.validate.required',
            status: 'api.validate.required',
        },
        properties: {
            device: 'api.validate.letterNumberSnak_',
            status: 'api.validate.enum|{"enum":"up,down"}',
        },
    },
};
// 网卡监听
export const listenNetworkSchema = {
    type: 'object',
    required: ['device', 'status'],
    properties: {
        device: {
            type: 'string',
            format: 'letterNumberSnak_',
            maxLength: 20,
            not: { enum: ['eth0-1', 'eth0-2'] },
            errorMessage: {
                type: 'api.validate.string',
                format: 'api.validate.letterNumberSnak_',
                maxLength: 'api.validate.maxLength|{"length":20}',
                not: 'api.validate.not|{"not":"eth0-1,eth0-2"}',
            },
        },
        status: {
            type: 'string',
            enum: ['yes', 'no'],
        },
    },
    errorMessage: {
        required: {
            device: 'api.validate.required',
            status: 'api.validate.required',
        },
        properties: {
            status: 'api.validate.enum|{"enum":"yes,no"}',
        },
    },
};
// 网卡删除IP
export const deleteIpSchema = {
    type: 'object',
    required: ['device', 'type'],
    properties: {
        device: {
            type: 'string',
            format: 'letterNumberSnak_',
            maxLength: 20,
            not: { enum: ['eth0-1', 'eth0-2'] },
            errorMessage: {
                type: 'api.validate.string',
                maxLength: 'api.validate.maxLength|{"length":20}',
                format: 'api.validate.letterNumberSnak_',
                not: 'api.validate.not|{"not":"eth0-1,eth0-2"}',
            },
        },
        type: {
            type: 'string',
            enum: ['all', 'ipv4', 'ipv6'],
        },
    },
    errorMessage: {
        required: {
            device: 'api.validate.required',
            type: 'api.validate.required',
        },
        properties: {
            type: 'api.validate.enum|{"enum":"all,ipv4,ipv6"}',
        },
    },
};
