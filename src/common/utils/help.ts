import { encode, fromBase64 } from 'js-base64';
import { upperFirst } from './string';

/**
 * 类型和类型判断
 */
export const type = (o: any): string => {
    if (o === null || o === undefined) {
        return o;
    }
    // 如是基础类型直接返回
    const t = typeof o;
    if (t !== 'object' && t !== 'function') {
        // 如果是 number，要过滤出 NaN 类型
        if (t === 'number' && isNaN(o)) {
            return 'NaN';
        }
        return upperFirst(t);
    }
    // 获取对象类型在原型上的字符串形式
    const tv = Object.prototype.toString.call(o);
    // 得到对象类型
    const tm = tv.match(/\[object (.*?)\]/)[1];
    // 如果是函数，要考虑自定义构造函数和 class 及其实例
    if (tm === 'Function') {
        // 是否 class
        try {
            if (new o().constructor?.toString().slice(0, 5) === 'class') {
                return 'Class';
            }
        } catch (e) {
            //
        }
    }
    if (tm === 'Object') {
        // 是否 class 的实例，如果是返回 class 名
        try {
            if (o.constructor?.toString().slice(0, 5) === 'class') {
                return o.constructor.name;
            }
        } catch (e) {
            //
        }
    }
    return tm;
};
interface isInterface {
    isNumber?(o: any): boolean;
    isString?(o: any): boolean;
    isBoolean?(o: any): boolean;
    isNull?(o: any): boolean;
    isUndefined?(o: any): boolean;
    isBigInt?(o: any): boolean;
    isSymbol?(o: any): boolean;
    isObject?(o: any): boolean;
    isFunction?(o: any): boolean;
    isArray?(o: any): boolean;
    isDate?(o: any): boolean;
    isRegExp?(o: any): boolean;
    isMap?(o: any): boolean;
    isSet?(o: any): boolean;
    isClass?(o: any): boolean;
    isClassInstance?(o: any): boolean;
}
const is: isInterface = {};
[
    /**
     * 7 种基本类型
     */
    'Number',
    'String',
    'Boolean',
    'Null',
    'Undefined',
    'BigInt',
    /**
     * 任意精度的整数
     */
    'Symbol',
    /**
     * 一种实例是唯一且不可改变的数据类型
     */
    /**
     * Object
     */
    'Object',
    'Function',
    'Array',
    'Date',
    'RegExp',
    'Map',
    'Set',
    /**
     * class
     */
    'Class',
].forEach((t) => {
    if (t === 'Null' || t === 'Undefined') {
        is['is' + t] = (o: any): boolean => type(o) === t.toLowerCase();
    } else {
        is['is' + t] = (o: any): boolean => type(o) === t;
    }
});
/**
 * 是否为 class 的实例
 */
is['isClassInstance'] = (o: any) => o && o.constructor?.toString().slice(0, 5) === 'class';

export const isNull = is.isNull;
export const isUndefined = is.isUndefined;
export const isBoolean = is.isBoolean;
export const isNumber = is.isNumber;
export const isBigInt = is.isBigInt;
export const isString = is.isString;
export const isArray = is.isArray;
export const isObject = is.isObject;
export const isFunction = is.isFunction;
export const isClass = is.isClass;
export const isClassInstance = is.isClassInstance;
export const isDate = is.isDate;
export const isRegExp = is.isRegExp;
export const isMap = is.isMap;
export const isSet = is.isSet;
export const isSymbol = is.isSymbol;

/**
 * 针对原始值 object Map Set 判断是否为空
 */
export const isEmpty = (o: any) => {
    if (o !== null || o !== undefined) {
        if (is.isArray(o)) {
            return !o.length;
        }
        if (is.isObject(o)) {
            return !Object.keys(o).length;
        }
        if (is.isSet(o) && is.isMap(o)) {
            return !o.size;
        }
        if (is.isString(o)) {
            return o === '';
        }
    }
    return !o;
};
/**
 * 是否空对象
 */
export const isAllUndefinedObject = (o: object) => {
    const str = JSON.stringify(o);
    return str === '{}' || str === '[]' || str === '[{}]';
};

/**
 * 广义对象 object array map set Date Regex
 */
export function isGeneralizedObject(obj: any) {
    return typeof obj === 'object' && obj != null;
}

/**
 * 简单深拷贝
 * @param options hash 设置一个哈希表存储已拷贝过的对象
 * @param options isTrim 是否去除字符串前后空格
 */
export const simpleCloneDeep = (source: any, options?: any) => {
    const { isTrim = false } = options;
    if (!isGeneralizedObject(source)) {
        // 不是广义对象
        if (isTrim && isString(source)) {
            return source.trim();
        }
        return source;
    }
    // hash 用于解决对象循环引用的问题
    const { hash = new WeakMap() } = options;
    // 检测到当前对象已存在于哈希表中时，取出该值并返回
    if (hash.has(source)) return hash.get(source);

    const target = Array.isArray(source) ? [...source] : { ...source };
    // 存储对象
    hash.set(source, target);

    // Reflect.ownKeys 返回目标对象自身的属性键
    Reflect.ownKeys(target).forEach((key) => {
        if (isGeneralizedObject(source[key])) {
            target[key] = simpleCloneDeep(source[key], options);
        } else if (isTrim && isString(source[key])) {
            target[key] = source[key];
        } else {
            target[key] = source[key];
        }
    });
    return target;
};

/**
 * 生成安全的URL参数
 * base64-url-safe: replace('=','')replace('+','-')replace('/','_')
 * base64-url-safe(JSON.stringify({"current":1,"pageSize":10}))
 * @param obj
 * @returns
 */
export const encodeUrlSafeParam = (obj: object): string => {
    if (isObject(obj) && !isEmpty(obj)) {
        const str = JSON.stringify(obj);
        return encode(str, true);
    }
    return '';
};
/**
 * 解析URL参数
 * @param str
 */
export const decodeUrlParam = (str: string) => {
    if (isString(str)) {
        try {
            const param = str?.trim();
            const utf8String = fromBase64(param);
            return utf8String ? JSON.parse(utf8String) : '';
        } catch (error) {
            throw error;
        }
    }
    return '';
};

/**
 * async/await 异常处理
 * 高级的处理,接收一个promise和错误对象
 * 返回一个resolve状态的promise
 */
export async function catchAwait<T = any>(promise?: Promise<T>, customerErr?: any) {
    try {
        const data = await promise;
        return [undefined, data] as [undefined, T];
    } catch (err) {
        if (customerErr) {
            const parsedError: any = { ...(err as Error), ...customerErr };
            return [parsedError, undefined] as [any, undefined];
        }
        return [err as Error, undefined] as [Error, undefined];
    }
}

/**
 * 转换成数字
 * @param value
 * @param defaultValue
 * @returns
 */
export const toNumber = (value: any, defaultValue = 0) => {
    const v = Number(value);
    return Number.isNaN(v) ? defaultValue : v;
};

/**
 * 格式化字节单位
 * 1024
 * @param bytes
 * @returns
 */
export const formatBytes = (bytes: number, showIUnit = false): string => {
    bytes = toNumber(bytes);
    let units: string[];
    if (showIUnit) {
        units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB', 'RiB', 'QiB'];
    } else {
        units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'RB', 'QB'];
    }
    let i = 0;
    if (bytes) {
        // Math.log() 函数是以 e 为底的对数运算
        // 1024 = 2^10 => 10 = Math.log(1024) / Math.log(2)
        // 求 bytes 以 2 为底的指数
        let exp = Math.floor(Math.log(bytes) / Math.log(2));
        if (exp < 1) {
            exp = 0;
        }
        i = Math.floor(exp / 10);
        // bytes = bytes / Math.pow(2, 10 * i);
        bytes /= 2 ** (10 * i);
        if (bytes.toString().length > bytes.toFixed(2).toString().length) {
            return `${bytes.toFixed(2)} ${units[i]}`;
        }
    }
    return `${bytes} ${units[i]}`;
};

/**
 * 格式化存储单位
 * 1000
 * 1000^3=10^9 G / 1000^3=10^12 T/ 10^15 P/ E/Z/Y/R/Q
 * @param bytes
 * @returns
 */
export const formatStorage = (bytes: number): string => {
    bytes = toNumber(bytes);
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'RB', 'QB'];
    let pointer = 0;
    if (bytes) {
        while (bytes > 1000 && pointer < units.length) {
            bytes /= 1000;
            // eslint-disable-next-line no-plusplus
            pointer++;
        }
        // 小数点后两位
        bytes = Math.round(bytes * 100) / 100;
    }
    return `${bytes} ${units[pointer]}`;
};

/**
 * 网卡流量单位转换
 * 1KByte/s=8Kbps(一般简写为1KByte/s=8Kbps)
 * 1B（字节）= 8bits（比特）
 * bps 称为比特率 比特每秒 表示网络的传输速度
 * Bps 每秒传输字节 字节每秒
 * @param bytes
 * @param type
 */
export function formatFlow(bytes: number) {
    bytes = toNumber(bytes);
    const symbols = [
        'bps',
        'Kbps',
        'Mbps',
        'Gbps',
        'Tbps',
        'Pbps',
        'Ebps',
        'Zbps',
        'Ybps',
        'Rbps',
        'Qbps',
    ];
    let i = 0;
    if (bytes) {
        bytes *= 8;
        // Math.log() 函数是以 e 为底的对数运算
        // 1024 = 2^10 => 10 = Math.log(1024) / Math.log(2)
        // 求 bytes 以 2 为底的指数
        let exp = Math.floor(Math.log(bytes) / Math.log(2));
        if (exp < 1) {
            exp = 0;
        }
        i = Math.floor(exp / 10);
        // bytes = bytes / Math.pow(2, 10 * i);
        bytes /= 2 ** (10 * i);
        if (bytes.toString().length > bytes.toFixed(2).toString().length) {
            return `${bytes.toFixed(2)} ${symbols[i]}`;
        }
    }
    return `${bytes} ${symbols[i]}`;
}

// 空方法
export const emptyCallback = () => null;

/**
 * 暂停 n 秒
 * @param ms 毫秒
 * @returns
 */
export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(() => resolve(Date.now()), ms));
}
