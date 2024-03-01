// 分页要验证的参数
export const paginationSchema = {
    current: {
        type: 'number',
        positive: true,
        errorMessage: {
            type: 'api.validate.number',
            positive: 'api.validate.positive',
        },
    },
    pageSize: {
        type: 'number',
        positive: true,
        errorMessage: {
            type: 'api.validate.number',
            positive: 'api.validate.positive',
        },
    },
    sort: {
        type: 'object',
        errorMessage: {
            type: 'api.validate.object',
        },
    },
};
