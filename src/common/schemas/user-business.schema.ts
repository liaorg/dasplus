// 业务系统信息要验证的参数
export const userBusinessSchema = {
    business: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
            id: {
                type: 'array',
                uniqueItems: true,
                items: { type: 'integer' },
                errorMessage: {
                    type: 'api.validate.array',
                    uniqueItems: 'api.validate.uniqueItems',
                },
            },
            name: {
                type: 'array',
                uniqueItemsBlur: true,
                items: { type: 'string' },
                errorMessage: {
                    type: 'api.validate.array',
                    uniqueItemsBlur: 'api.validate.uniqueItemsBlur',
                },
            },
        },
        errorMessage: 'api.validate.userBusiness',
    },
};
