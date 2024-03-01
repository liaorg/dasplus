import { Code, CodeKeywordDefinition, FuncKeywordDefinition, KeywordCxt, nil, _ } from 'ajv';
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

// 数字范围
const range: CodeKeywordDefinition = {
    keyword: 'range',
    type: 'number',
    code(cxt: KeywordCxt) {
        const { schema, parentSchema, data } = cxt;
        const [min, max] = schema;
        const eq: Code = parentSchema.exclusiveRange ? _`=` : nil;
        cxt.fail(_`${data} <${eq} ${min} || ${data} >${eq} ${max}`);
    },
    metaSchema: {
        type: 'array',
        items: [{ type: 'number' }, { type: 'number' }],
        minItems: 2,
        maxItems: 2,
        additionalItems: false,
    },
};
ajv.addKeyword(range);

// 正整数
const positive: FuncKeywordDefinition = {
    keyword: 'positive',
    validate: (schema: boolean, data: any) => {
        if (schema === true) {
            const RE = /^[1-9]\d*$/;
            return RE.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(positive);

// 整数数字范围 如： -1 0 1
const integerRange: FuncKeywordDefinition = {
    keyword: 'integerRange',
    compile([min, max], parentSchema) {
        const RE = /^-?[0-9]\d*$/;
        return parentSchema.exclusiveRange === true
            ? (data) => RE.test(data) && data > min && data < max
            : (data) => RE.test(data) && data >= min && data <= max;
    },
    metaSchema: {
        type: 'array',
        items: [{ type: 'number' }, { type: 'number' }],
        minItems: 2,
        maxItems: 2,
        additionalItems: false,
    },
};
ajv.addKeyword(integerRange);

// 正整数数字范围
const positiveRange: FuncKeywordDefinition = {
    keyword: 'positiveRange',
    compile([min, max], parentSchema) {
        const RE = /^[1-9]\d*$/;
        return parentSchema.exclusiveRange === true
            ? (data) => RE.test(data) && data > min && data < max
            : (data) => RE.test(data) && data >= min && data <= max;
    },
    metaSchema: {
        type: 'array',
        items: [{ type: 'number' }, { type: 'number' }],
        minItems: 2,
        maxItems: 2,
        additionalItems: false,
    },
};
ajv.addKeyword(positiveRange);

// 只允许输入数字且首位不为 0，最大长度为 20
export const characterD: FuncKeywordDefinition = {
    keyword: 'characterD',
    validate: (schema: any, data: any) => {
        if (schema === true) {
            return /^[1-9]\d{0,19}$/gi.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(characterD);

export default null;
