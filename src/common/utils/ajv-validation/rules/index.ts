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

// export * from './ip-address.rule';
// export * from './number.rule';
// export * from './string.rule';

import './array.rule';
import './datetime.rule';
import './ip-address.rule';
import './number.rule';
import './string.rule';
