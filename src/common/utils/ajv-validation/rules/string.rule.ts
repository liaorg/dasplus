import { FuncKeywordDefinition } from 'ajv';
import { AnyObject } from '@/common/interfaces';
import { ajv } from '../validation';
import { isObjectIdOrHexString } from 'mongoose';

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

// 中文
export const CN_RE = /^[\w\u4E00-\u9FA5]+$/gi;

// 只允许输入字母、数字
export const LETTER_NUMBER = /^[0-9a-z]+$/i;
ajv.addFormat('letterNumber', LETTER_NUMBER);
// 只允许输入数字
export const INPUT_NUMBER = /^[0-9]+$/i;
ajv.addFormat('InputNumber', INPUT_NUMBER);
// 只允许输入字母、数字、_
export const LETTER_NUMBER_RE = /^[0-9a-z_]+$/i;
ajv.addFormat('letterNumber_', LETTER_NUMBER_RE);
// 只允许输入字母、数字、-、_
export const LETTER_NUMBER_RE_1 = /^[0-9a-z_-]+$/i;
ajv.addFormat('letterNumberSnak_', LETTER_NUMBER_RE_1);
// 匹配 '、"、<、>
export const CHAR_QUOTE = /['"<>]+/;
ajv.addFormat('charQuote', CHAR_QUOTE);
// 密码限制 字母、数字和!"#$%&'()*+,-./:;<=>?@[]^_`{|}\~中的字符
export const CHAR_PASSWORD = /^[\w!"#$%&'()*+,-./:;<=>?@[\]^`{|}\\~]*$/;
ajv.addFormat('password', CHAR_PASSWORD);

// 密码限制 字母、数字和!"#$%&()*+,-./:;<=>?@[]^_`{|}\~中的字符
export const CHAR_PASSWORD_NOQUOTE = /^[\w!#$%&()*+,-./:;<=>?@[\]^`{|}\\~]*$/;
ajv.addFormat('passwordNoQuote', CHAR_PASSWORD_NOQUOTE);

// 只允许输入中文（中文符号除外）、字母、数字、英文符号（_、.）
export const CN_LETTER_NUMBER_CHAR = /^[\w\u4E00-\u9FA5.]+$/i;
ajv.addFormat('cnLetterNumberChar', CN_LETTER_NUMBER_CHAR);

// 只允许输入中文（中文符号除外）、字母
export const CN_FULL_NAME_CHAR = /^[a-z\u4E00-\u9FA5]+$/i;
ajv.addFormat('cnFullName', CN_FULL_NAME_CHAR);

// 不允许英文符号*号开头
export const UNHEAD_ASTERISK = /^[^*].*/;
ajv.addFormat('unheadAsterisk', UNHEAD_ASTERISK);

// md5值，长度为32
export const charMD5: FuncKeywordDefinition = {
    keyword: 'charMD5',
    validate: (schema: any, data: any) => {
        if (data !== '' && schema === true) {
            return data.length === 32 && LETTER_NUMBER.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(charMD5);

// 描述
// 只允许输入中文、字母、数字、中文符号、英文符号（英文单、双引号除外）
// 允许的符号：  `~!@#$%^&*()_+-={}[]:;<>?,./|\·《》？，。、；’：”【】、
export const charDesc: FuncKeywordDefinition = {
    keyword: 'charDesc',
    validate: (schema: any, data: any) => {
        if (schema === true) {
            return (
                CN_RE.test(data) ||
                /^[`~!@#$%^&*()_+-={}[\]:;<>?,./|\\·《》？，。、；’：”【】、]+$/gi.test(data) ||
                !/['"]/gi.test(data)
            );
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(charDesc);

// 请输入正确的手机号
// 电信：133、153、173、177、180、181、189、190、191、193、199
// 移动：134(0-8)、135、136、137、138、139、1440、147、148、150、151、152、157、158、159、172、178、182、183、184、187、188、195、197、198
// 联通：130、131、132、145、155、156、166、167、171、175、176、185、186、196
// 广电：192
// 上网卡专属号段：中国联通145，中国移动147，中国电信149
// 虚拟运营商：
// 电信：1700、1701、1702、162
// 移动：1703、1705、1706、165
// 联通：1704、1707、1708、1709、171、167
// 卫星通信：1349、174
// 物联网：140、141、144、146、148
const CN_PHONE_NUMBER = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
ajv.addFormat('cnPhoneNumber', CN_PHONE_NUMBER);

// 国内固定电话号码 0591-7834780-23
const CN_FIXED_PHONE_NUMBER = /^(0[0-9]{2,3}-)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/;
ajv.addFormat('cnFixedPhoneNumber', CN_FIXED_PHONE_NUMBER);

// 请输入正确的 QQ 号
const QQ_NUMBER = /^[1-9][0-9]\d{4,9}$/;
ajv.addFormat('qqNumber', QQ_NUMBER);

// 请输入正确的身份证号
/**
 * 身份证号合法性验证
 * 支持15位和18位身份证号
 * 支持地址编码、出生日期、校验位验证
 */
function identityCodeValid(code: string) {
    if (code === undefined || code === null) {
        return true;
    }
    if (!code) {
        return false;
    }
    // 35 个省地区
    const city: AnyObject = {
        11: 'city.Beijing',
        12: 'city.Tianjin',
        13: 'city.Hebei',
        14: 'city.Shanxi',
        // 内蒙古
        15: 'city.NeiMonggol',
        21: 'city.Liaoning',
        22: 'city.Jilin',
        23: 'city.Heilongjiang',
        31: 'city.Shanghai',
        32: 'city.Jiangsu',
        33: 'city.Zhejiang',
        34: 'city.Anhui',
        35: 'city.Fujian',
        36: 'city.Jiangxi',
        37: 'city.Shandong',
        41: 'city.Henan',
        42: 'city.Hubei',
        43: 'city.Hunan',
        44: 'city.Guangdong',
        45: 'city.Guangxi',
        46: 'city.Hainan',
        50: 'city.Chongqing',
        51: 'city.Sichuan',
        52: 'city.Guizhou',
        53: 'city.Yunnan',
        54: 'city.Xizang',
        // 陕西
        61: 'city.Shaanxi',
        62: 'city.Ganshu',
        63: 'city.Qinghai',
        64: 'city.Ningxia',
        65: 'city.Xinjiang',
        71: 'city.Taiwan',
        // 香港
        81: 'city.HongKong',
        // 澳门
        82: 'city.Macao',
        // 国外
        91: 'city.Abroad',
    };
    code = String(code);
    const len = code.length;
    if (len !== 15 && len !== 18) {
        return false;
    }
    const cityIndex: string = code.substring(0, 2) || '';
    if (!city[cityIndex]) {
        // 地址编码错误
        return false;
    }
    if (!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/.test(code)) {
        // 身份证号格式错误
        return false;
    }
    if (len === 18) {
        // 18位身份证需要验证最后一位校验位
        const codeNum = code.split('');
        // ∑(ai×Wi)(mod 11)
        // 加权因子
        const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        // 校验位
        const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        let sum = 0;
        let ai = 0;
        let wi = 0;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < 17; i++) {
            ai = Number(codeNum[i]);
            wi = factor[i];
            sum += ai * wi;
        }
        const last = parity[sum % 11];
        if (String(last) !== codeNum[17]) {
            // 校验位错误
            return false;
        }
    }
    return true;
}
const idNumber: FuncKeywordDefinition = {
    keyword: 'idNumber',
    validate: (schema: any, data: any) => {
        if (schema === true) {
            return identityCodeValid(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(idNumber);

// 匹配域名
const DOMAIN = /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$)/;
ajv.addFormat('domain', DOMAIN);

// 不允许输入英文符号（&apos;、"、<、>）!
export const stringRuleLimit: FuncKeywordDefinition = {
    keyword: 'stringRuleLimit',
    validate: (schema: any, data: any) => {
        if (schema === true) {
            return !/('|"|<|>)+/i.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(stringRuleLimit);

// 只允许输入中文（中文符号除外）、字母、数字、空格、英文符号（_、.）和中英文括号（()、（））！
export const validChar: FuncKeywordDefinition = {
    keyword: 'validChar',
    validate: (schema: any, data: any) => {
        if (schema === true) {
            return /^[\w\u4E00-\u9FA5 .()（）]+$/gi.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(validChar);

// 只允许输入中文（中文符号除外）、字母、数字、英文符号（ _、.、!、@、#、$、%、^、&、*、(、)） 仅适用于 共同体
export const validChar3: FuncKeywordDefinition = {
    keyword: 'validChar3',
    validate: (schema: any, data: any) => {
        if (schema === true) {
            return /^[\w\u4E00-\u9FA5.!@#$%^&*()]+$/gi.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(validChar3);
// 只允许输入中文（中文符号除外）、字母或数字
export const validChar4: FuncKeywordDefinition = {
    keyword: 'validChar4',
    validate: (schema: any, data: any) => {
        if (schema === true) {
            return /^[a-zA-Z0-9\u4e00-\u9fa5]+$/gi.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(validChar4);
// 只允许输入字母、数字或英文符号（_）
export const validChar5: FuncKeywordDefinition = {
    keyword: 'validChar5',
    validate: (schema: any, data: any) => {
        if (schema === true) {
            return /^[a-zA-Z0-9_]+$/gi.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(validChar5);
// 只允许输入字母、数字或英文符号（-）
export const validChar6: FuncKeywordDefinition = {
    keyword: 'validChar6',
    validate: (schema: any, data: any) => {
        if (schema === true) {
            return /^[a-zA-Z0-9-]+$/gi.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(validChar6);
// 只允许输入字母、数字或英文符号（-._）
export const validChar7: FuncKeywordDefinition = {
    keyword: 'validChar7',
    validate: (schema: any, data: any) => {
        if (schema === true) {
            return /^[a-zA-Z0-9\-._]*$/gi.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(validChar7);

// 只允许字母、数字、英文符号（_、/）
export const validChar8: FuncKeywordDefinition = {
    keyword: 'validChar8',
    validate: (schema: any, data: any) => {
        if (schema === true) {
            return /^[a-zA-Z0-9_/]+$/gi.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(validChar8);

// 只允许输入字母、数字、英文符号（-、.、@、_）
export const validChar9: FuncKeywordDefinition = {
    keyword: 'validChar9',
    validate: (schema: any, data: any) => {
        if (schema === true) {
            // IPv4地址的正则表达式
            const regex = /^[a-zA-Z0-9\-\\.@_]+$/;
            if (regex.test(data)) {
                return true;
            }
            return false;
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(validChar9);

// 只允许输入中文（中文符号除外）、字母、数字、空格、英文符号（_）
export const sphinxspecialChart: FuncKeywordDefinition = {
    keyword: 'sphinxspecialChart',
    validate: (schema: any, data: any) => {
        if (schema === true) {
            return /^[\w\u4E00-\u9FA5 _]+$/gi.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(sphinxspecialChart);
// 只允许输入中文（中文符号除外）、字母、数字、空格、英文符号（_.）
export const sphinxspecialChartTwo: FuncKeywordDefinition = {
    keyword: 'sphinxspecialChartTwo',
    validate: (schema: any, data: any) => {
        if (schema === true) {
            return /^[\w\u4E00-\u9FA5 _.]+$/gi.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(sphinxspecialChartTwo);

// sm3值，长度为64
export const charSM3: FuncKeywordDefinition = {
    keyword: 'charSM3',
    validate: (schema: any, data: any) => {
        if (schema === true) {
            return data.length === 64 && LETTER_NUMBER.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(charSM3);

// objectId 验证
export const mongodbObjectId: FuncKeywordDefinition = {
    keyword: 'mongodbObjectId',
    validate: (schema: any, data: any) => {
        if (schema === true && data) {
            return isObjectIdOrHexString(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(mongodbObjectId);

// 只允许输入 {length} 个字符
export const strLength: FuncKeywordDefinition = {
    keyword: 'strLength',
    validate: (schema: any, data: any) => {
        if (typeof schema === 'number') {
            const num = parseInt(String(schema));
            const len = String(data).length;
            return len === num;
        }
        return false;
    },
    errors: false,
};
ajv.addKeyword(strLength);

export default null;
