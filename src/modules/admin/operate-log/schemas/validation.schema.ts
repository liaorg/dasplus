import { OPERATE_LOG } from '@/common/constants/log.const';
import { DateTimeSchema, arrayObjectIdSchema, paginationSchema } from '@/common/schemas';

const operateLogComonSchema = {
    // 开始结束时间
    ...DateTimeSchema,
    type: {
        type: 'number',
        enum: [...OPERATE_LOG],
        errorMessage: {
            type: 'api.validate.number',
            enum: 'api.validate.logType',
        },
    },
    content: {
        type: 'string',
        maxLength: 64,
        // 匹配 '、"、<、>
        not: { type: 'string', format: 'charQuote' },
        errorMessage: {
            type: 'api.validate.string',
            maxLength: 'api.validate.maxLength|{"length":64}',
            not: 'api.validate.notCharQuote',
        },
    },
    operator: {
        type: 'string',
        minLength: 3,
        maxLength: 32,
        format: 'letterNumber_',
        errorMessage: {
            type: 'api.validate.string',
            minLength: 'api.validate.maxLength|{"length":3}',
            maxLength: 'api.validate.maxLength|{"length":32}',
            format: 'api.validate.letterNumber_',
        },
    },
};
// 导出
export const exportOperateLogSchema = {
    type: 'object',
    properties: {
        ids: {
            ...arrayObjectIdSchema,
        },
        // 其他查询参数
        ...operateLogComonSchema,
    },
    errorMessage: {
        properties: {
            ids: 'api.validate.string',
        },
    },
};
// 查询
export const queryOperateLogSchema = {
    type: 'object',
    properties: {
        // 分页
        ...paginationSchema,
        // 其他查询参数
        ...operateLogComonSchema,
    },
};
