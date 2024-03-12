// 端口安全配置启停
export const updateServerPortSchema = {
    type: 'object',
    required: ['name', 'port'],
    properties: {
        name: {
            type: 'string',
            maxLength: 32,
            format: 'letterNumber_',
            errorMessage: {
                type: 'api.validate.string',
                maxLength: 'api.validate.maxLength|{"length":32}',
                format: 'api.validate.letterNumber_',
            },
        },
        port: {
            type: 'array',
            items: {
                type: 'object',
                required: ['value', 'status'],
                properties: {
                    value: {
                        type: 'number',
                        positiveRange: [1, 65535],
                        errorMessage: {
                            type: 'api.validate.number',
                            positiveRange: 'api.validate.positiveRange|{"range":"1-65535"}',
                        },
                    },
                    status: {
                        type: 'boolean',
                        errorMessage: {
                            type: 'api.validate.boolean',
                        },
                    },
                },
                errorMessage: {
                    required: {
                        value: 'api.validate.required',
                        status: 'api.validate.required',
                    },
                },
            },
            maxItems: 10,
            errorMessage: {
                type: 'api.validate.array',
                maxItems: 'api.validate.maxItems|{"value": 10}',
            },
        },
    },
    errorMessage: {
        required: {
            name: 'api.validate.required',
            port: 'api.validate.required',
        },
    },
};
