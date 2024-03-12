// 远程调试启停
export const updateRemoteDebugSchema = {
    type: 'object',
    required: ['status'],
    properties: {
        status: {
            type: 'boolean',
            errorMessage: {
                type: 'api.validate.boolean',
            },
        },
    },
    errorMessage: {
        required: {
            status: 'api.validate.required',
        },
    },
};
