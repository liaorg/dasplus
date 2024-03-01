/**
 * 时间范围
 */
export const DateTimeSchema = {
    dateTime: {
        type: 'array',
        uniqueItems: true,
        timeRange: true,
        errorMessage: {
            type: 'api.validate.array',
            timeRange: 'api.validate.timeRange',
            uniqueItems: 'api.validate.uniqueItems',
        },
    },
};

/**
 * 开始结束时间
 */
export const FromToTimeSchema = {
    fromTime: {
        type: 'string',
        format: 'date-time',
        errorMessage: {
            type: 'api.validate.string',
            format: 'api.validate.dateTime',
        },
    },
    toTime: {
        type: 'string',
        format: 'date-time',
        formatMinimum: { $data: '1/fromTime' },
        errorMessage: {
            type: 'api.validate.string',
            format: 'api.validate.dateTime',
            formatMinimum: 'api.validate.formatMinimum|{"value": ${/fromTime} }',
        },
    },
};
