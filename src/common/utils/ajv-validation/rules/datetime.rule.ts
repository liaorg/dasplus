import { FuncKeywordDefinition } from 'ajv';
import { dayjs } from '@/common/utils/datetime';
import { ajv } from '../validation';
/**
 * 参数验证规则
 * 参考 https://ajv.js.org/json-schema.html
 * https://ajv.js.org/keywords.html
 */
// export const constant = {
//     keyword: 'constant',
//     validate: (schema, data) => (typeof schema == 'object' && schema !== null ? false : schema === data),
//     errors: false,
// };

// 时间范围
const timeRange: FuncKeywordDefinition = {
    keyword: 'timeRange',
    validate: (schema: boolean, data: any[]) => {
        if (schema === true) {
            if (data?.length === 2) {
                const [fromTime, toTime] = data;
                return dayjs(toTime).isAfter(dayjs(fromTime));
            }
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(timeRange);
