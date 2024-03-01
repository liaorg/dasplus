import { FuncKeywordDefinition } from 'ajv';
import { ajv } from '../validation';
import { isArray, isNumber, isString } from '../../help';

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

// 判断该项是否存在，忽略大小写
export const uniqueItemsBlur: FuncKeywordDefinition = {
    keyword: 'uniqueItemsBlur',
    validate: (schema: any, data: any[]) => {
        if (isArray(data) && schema === true) {
            const arr = data.map((item: string) => {
                if (isString(item)) return item.toLowerCase();
                return item;
            });
            const set = new Set(arr);
            return set.size === arr.length;
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(uniqueItemsBlur);

// 判断数组内容总长度
export const maxItemsLength: FuncKeywordDefinition = {
    keyword: 'maxItemsLength',
    validate: (schema: number, data: any[]) => {
        if (isArray(data) && isNumber(schema)) {
            let len = 0;
            data?.forEach((value) => {
                len += String(value).length;
            });
            return len <= schema;
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(maxItemsLength);
