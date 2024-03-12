// 日期时间
const dateTimeSchema = {
    dateTime: {
        type: 'string',
        format: 'date-time',
        errorMessage: {
            type: 'api.validate.string',
            format: 'api.validate.dateTime',
        },
    },
};
const TimezoneArr: string[] = ['Asia/Shanghai', 'Europe/London'];
// 保存配置
export const updateTimeConfigureSchema = {
    type: 'object',
    properties: {
        ...dateTimeSchema,
        timezone: {
            type: 'string',
            enum: TimezoneArr,
            errorMessage: {
                type: 'api.validate.string',
                enum: 'api.validate.enum|{"enum":"Asia/Shanghai,Europe/London"}',
            },
        },
        asyncType: {
            type: 'number',
            enum: [0, 1, 2],
            errorMessage: {
                type: 'api.validate.number',
                enum: 'api.validate.enum|{"enum":"0,1,2"}',
            },
        },
        ntpIpOrDomain: {
            type: 'string',
            oneOf: [{ ipv4ExcludeRule: true }, { format: 'domain' }],
        },
        orcleIp: {
            type: 'string',
            ipExcludeRule: true,
            errorMessage: {
                type: 'api.validate.string',
                ipExcludeRule: 'api.validate.ipExcludeRule',
            },
        },
        orclePort: {
            type: 'number',
            positiveRange: [1, 65535],
            errorMessage: {
                type: 'api.validate.number',
                positiveRange: 'api.validate.positiveRange|{"range":"1-65535"}',
            },
        },
        orcleUsername: {
            type: 'string',
            maxLength: 32,
            errorMessage: {
                type: 'api.validate.string',
                maxLength: 'api.validate.maxLength|{"length":32}',
            },
        },
        orclePassword: {
            type: 'string',
            maxLength: 64,
            format: 'password',
            errorMessage: {
                type: 'api.validate.string',
                maxLength: 'api.validate.maxLength|{"length":64}',
                format: 'api.validate.password',
            },
        },
        orcleInstanceName: {
            type: 'string',
            maxLength: 32,
            errorMessage: {
                type: 'api.validate.string',
                maxLength: 'api.validate.maxLength|{"length":32}',
            },
        },
    },
    if: { properties: { asyncType: { const: 1 } } },
    then: { required: ['ntpIpOrDomain'] },
    else: {
        if: { properties: { asyncType: { const: 2 } } },
        then: { required: ['orcleIp', 'orclePort', 'orcleUsername', 'orclePassword'] },
    },
    errorMessage: {
        required: {
            ntpIpOrDomain: 'api.validate.required',
            orcleIp: 'api.validate.required',
            orclePort: 'api.validate.required',
            orcleUsername: 'api.validate.required',
            orclePassword: 'api.validate.required',
        },
        properties: {
            ntpIpOrDomain: 'api.validate.ipv4Domain',
        },
    },
};

// 立即更新/手动同步
export const updateTimeSchema = {
    type: 'object',
    required: ['dateTime'],
    properties: {
        ...dateTimeSchema,
    },
    errorMessage: {
        required: {
            dateTime: 'api.validate.required',
        },
    },
};
