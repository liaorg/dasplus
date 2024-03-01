import { AnyObject } from '../interfaces';

/**
 * 首字母大写
 */
export const upperFirst = function (str: string): string {
    if (str.length < 1) return str;
    return str[0].toUpperCase() + str.slice(1);
};

/**
 * 替换字符中间内容为 replace 符号
 * @param str
 * @param prefixLen
 * @param surfixLen
 * @param replace
 * @returns
 */
export function coverContent(str: string, prefixLen: number, surfixLen: number, replace: string) {
    const arr = str.split('');
    const hideLen = str.length - prefixLen - surfixLen;
    if (hideLen <= 0) {
        return str;
    } else {
        const arr1 = arr.slice(0, prefixLen);
        const arr2 = Array(hideLen).fill(replace);
        const arr3 = arr.slice(prefixLen + hideLen);
        return [...arr1, ...arr2, ...arr3].join('');
    }
}

/**
 * 替换字符串中间几个字符
 * @param str
 * @param start
 * @param replaceText
 * @returns
 */
export function replacePos(str: string, start: number, replaceText: string) {
    return str.substring(0, start) + replaceText + str.substring(start + replaceText.length);
}

/**
 * 判断是否有身份证号
 * 身份证号合法性验证
 * 支持15位和18位身份证号
 * 支持地址编码、出生日期、校验位验证
 * @param code
 * @returns
 */
export function hasIdentityCode(code: string) {
    const has = /\b\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?\b/.exec(code);
    if (has !== null && has?.index !== undefined) {
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
        code = String(has[0]);
        const len = code.length;
        if (len !== 15 && len !== 18) {
            return null;
        }
        const cityIndex: string = code.substring(0, 2) || '';
        if (!city[cityIndex]) {
            // 地址编码错误
            return null;
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
                return null;
            }
        }
    }
    return has;
}

/**
 * 银行卡最后一位的校验码算法
 * 是否符合 Luhn算法，亦称模 10 算法
 * 第一步：从右边第1个数字开始每隔一位乘以 2
 * 第二步：把在第一步中获得的乘积的各位数字相加，然后再与原号码中未乘 2 的各位数字相加
 * 第三步：对于第二步求和值中个位数求 10 的补数，如果个位数为 0 则该校验码为 0
 */

/**
 * 是否符合 Luhn算法
 * Luhn算法的核心思想是对输入的数字串进行奇偶校验位的计算
 * 从卡号最后一位数字开始，偶数位乘以2，如果乘以2的结果是两位数，就将个位数和十位数相加返回
 * 把所有数字相加,得到总和
 * 如果总和能被10整除，则该数字串通过校验
 * @param cc
 * @returns
 */
export function isLuhn(cc: string) {
    let sum = 0;
    let shouldDouble = false;

    // 从右向左遍历
    for (let i = cc.length - 1; i >= 0; i--) {
        let digit = parseInt(cc.charAt(i));
        if (shouldDouble) {
            // 对 2 倍数的两位数求和
            if ((digit *= 2) > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
}

/**
 * 是否银行卡号
 * @returns
 */
export function hasCreditCard(card: string) {
    const isCard = /\b(?:\d[ \t-]*?){13,19}\b/;
    const hasCard = isCard.exec(card);
    if (hasCard !== null && isLuhn(hasCard[0])) {
        return hasCard;
    }
    return null;
}
