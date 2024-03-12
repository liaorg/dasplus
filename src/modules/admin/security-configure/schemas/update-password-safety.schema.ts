// 密码安全配置 参数验证
export const updatePasswordSafetySchema = {
    type: 'object',
    properties: {
        minLength: {
            type: 'number',
            positiveRange: [8, 64],
            errorMessage: {
                type: 'api.validate.number',
                positiveRange: 'api.validate.positiveRange|{"range":"8-64"}',
            },
        },
        maxSameLetter: {
            type: 'integer',
            integerRange: [0, 9],
            errorMessage: {
                type: 'api.validate.integer',
                integerRange: 'api.validate.integerRange|{"range":"0-9"}',
            },
        },
        lowercase: {
            type: 'boolean',
            errorMessage: {
                type: 'api.validate.boolean',
            },
        },
        uppercase: {
            type: 'boolean',
            errorMessage: {
                type: 'api.validate.boolean',
            },
        },
        number: {
            type: 'boolean',
            errorMessage: {
                type: 'api.validate.boolean',
            },
        },
        specialLetter: {
            type: 'boolean',
            errorMessage: {
                type: 'api.validate.boolean',
            },
        },
        weakCheck: {
            type: 'boolean',
            errorMessage: {
                type: 'api.validate.boolean',
            },
        },
        excludeWord: {
            type: 'array',
            uniqueItemsBlur: true,
            maxItems: 15,
            items: { type: 'string', format: 'letterNumber_' },
            errorMessage: {
                type: 'api.validate.array',
                maxItems: 'api.validate.maxItems|{"value": 15}',
                uniqueItemsBlur: 'api.validate.uniqueItemsBlur',
            },
        },
    },
    errorMessage: {
        properties: {
            excludeWord: 'api.validate.letterNumber_',
        },
    },
};
