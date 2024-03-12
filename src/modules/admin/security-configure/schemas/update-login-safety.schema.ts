// 登录安全配置 参数验证
export const updateLoginSafetySchema = {
    type: 'object',
    properties: {
        numOfLoginFailedToLocked: {
            type: 'number',
            positiveRange: [1, 5],
            errorMessage: {
                type: 'api.validate.number',
                positiveRange: 'api.validate.positiveRange|{"range":"1-5"}',
            },
        },
        timeOfLoginFailedToLocked: {
            type: 'number',
            positiveRange: [30, 525600],
            errorMessage: {
                type: 'api.validate.number',
                positiveRange: 'api.validate.positiveRange|{"range":"30-525600"}',
            },
        },
        timeOfLogout: {
            type: 'number',
            positiveRange: [1, 10],
            errorMessage: {
                type: 'api.validate.number',
                positiveRange: 'api.validate.positiveRange|{"range":"1-10"}',
            },
        },
        timeLimitOfPassword: {
            type: 'number',
            positiveRange: [1, 30],
            errorMessage: {
                type: 'api.validate.number',
                positiveRange: 'api.validate.positiveRange|{"range":"1-30"}',
            },
        },
        timeOfMaintain: {
            type: 'number',
            positiveRange: [3, 10],
            errorMessage: {
                type: 'api.validate.number',
                positiveRange: 'api.validate.positiveRange|{"range":"3-10"}',
            },
        },
        statusOfcaptcha: {
            type: 'boolean',
            errorMessage: {
                type: 'api.validate.boolean',
            },
        },
        forceReset: {
            type: 'boolean',
            errorMessage: {
                type: 'api.validate.boolean',
            },
        },
    },
};
