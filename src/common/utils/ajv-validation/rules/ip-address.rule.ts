import { FuncKeywordDefinition } from 'ajv';
import {
    ipExclude,
    ipExcludeFirst,
    ipv4Exclude,
    ipv4ExcludeBroadcast,
    ipv6Exclude,
} from '@/common/utils/ip';
import { ajv, doValidate } from '../validation';

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

// format: ipv4 或 format: ipv6

// 模糊 ipv4 或 ipv6
// 只允许输入字母、数字、.、:
const ipLike: FuncKeywordDefinition = {
    keyword: 'ipLike',
    validate: (schema: boolean, data: any) => {
        if (data !== '' && schema === true) {
            const IP_RE = /^[\d.:a-z]+$/i;
            return IP_RE.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(ipLike);

// 验证 MAC地址 :的形式
const mac: FuncKeywordDefinition = {
    keyword: 'mac',
    validate: (schema: boolean, data: any) => {
        if (data !== '' && schema === true) {
            // 验证是否 mac 地址
            const MAC_RE = /^(?:[a-z0-9]{2}:){5}[a-z0-9]{2}$/i;
            return MAC_RE.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(mac);

// 验证 MAC地址 : 的形式
// 只允许输入以 “:” 作为分隔符格式的 MAC 地址
const macColon: FuncKeywordDefinition = {
    keyword: 'macColon',
    validate: (schema: boolean, data: any) => {
        if (data !== '' && schema === true) {
            // 验证是否 mac 地址
            const MAC_RE = /^(?:[a-z0-9]{2}:){5}[a-z0-9]{2}$/i;
            return MAC_RE.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(macColon);

// 验证 MAC地址 -的形式
// 只允许输入 “-” 做为分隔符格式的 MAC 地址
const macSnak: FuncKeywordDefinition = {
    keyword: 'macSnak',
    validate: (schema: boolean, data: any) => {
        if (data !== '' && schema === true) {
            // 验证是否 mac 地址
            const MAC_RE = /^([a-z0-9]{2}[-])([a-z0-9]{2}[-]){4}[a-z0-9]{2}$/i;
            return MAC_RE.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(macSnak);

// 模糊 mac
// 只允许输入字母、数字、:
const macColonLike: FuncKeywordDefinition = {
    keyword: 'macColonLike',
    validate: (schema: boolean, data: any) => {
        if (data !== '' && schema === true) {
            const IP_RE = /^[\d:a-z]+$/i;
            return IP_RE.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(macColonLike);

// 模糊 mac
// 只允许输入字母、数字、-
const macSnakLike: FuncKeywordDefinition = {
    keyword: 'macSnakLike',
    validate: (schema: boolean, data: any) => {
        if (data !== '' && schema === true) {
            const IP_RE = /^[\d-a-z]+$/i;
            return IP_RE.test(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(macSnakLike);

// ipv4Host ipv4 主机对象 {address, netmask, mac}
const ipv4Host: FuncKeywordDefinition = {
    keyword: 'ipv4Host',
    validate: (schema: any, data: any) => {
        const errors = doValidate(schema, data);
        if (errors?.length) {
            return false;
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(ipv4Host);

// ipv6Host  ipv6 主机对象 {address, prefixlen, mac}
const ipv6Host: FuncKeywordDefinition = {
    keyword: 'ipv6Host',
    validate: (schema: any, data: any) => {
        const errors = doValidate(schema, data);
        if (errors?.length) {
            return false;
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(ipv6Host);

// 请输入正确的 A 类、B 类、C 类 IPv4 地址或 IPv6 地址
// 如：192.168.0.1、0: 0: 0: 0: 0: 0: c0a8:0001
// (0.0.0.0~0.255.255.255、127.0.0.0~127.255.255.255、::、:: 1、ff00:: /8 网段范围地址除外)
const ipExcludeRule: FuncKeywordDefinition = {
    keyword: 'ipExcludeRule',
    validate: (schema: boolean, data: any) => {
        if (schema === true && data !== '') {
            return ipExclude(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(ipExcludeRule);

// IPv4、IPv6地址，如：192.168.0.1或0:0:0:0:0:0:c0a8:0001
// (0.0.0.0,::除外)
const ipExcludeFirstRule: FuncKeywordDefinition = {
    keyword: 'ipExcludeFirstRule',
    validate: (schema: boolean, data: any) => {
        if (schema === true && data !== '') {
            return ipExcludeFirst(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(ipExcludeFirstRule);

// 请输入正确的A类、B类、C类地址（0.0.0.0~0.255.255.255、127.0.0.0~127.255.255.255除外）
const ipv4ExcludeRule: FuncKeywordDefinition = {
    keyword: 'ipv4ExcludeRule',
    validate: (schema: boolean, data: any) => {
        if (schema === true && data !== '') {
            return ipv4Exclude(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(ipv4ExcludeRule);

// A类、B类、C类地址（0.0.0.0~0.255.255.255、127.0.0.0~127.255.255.255、广播地址除外)
const ipv4ExcludeBroadcastRule: FuncKeywordDefinition = {
    keyword: 'ipv4ExcludeBroadcastRule',
    validate: (schema: boolean, data: any) => {
        if (schema === true && data !== '') {
            return ipv4ExcludeBroadcast(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(ipv4ExcludeBroadcastRule);

// 请输入正确的IPv6地址，如：0:0:0:0:0:0:c0a8:0001(::、::1、ff00::/8网段范围地址除外)
const ipv6ExcludeRule: FuncKeywordDefinition = {
    keyword: 'ipv6ExcludeRule',
    validate: (schema: boolean, data: any) => {
        if (schema === true && data !== '') {
            return ipv6Exclude(data);
        }
        return true;
    },
    errors: false,
};
ajv.addKeyword(ipv6ExcludeRule);

export default null;
