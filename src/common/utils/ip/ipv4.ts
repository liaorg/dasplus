/* eslint-disable no-bitwise */
import { IPv4 } from 'ipaddr.js';
/**
 * 地址处理
 * https://github.com/evertcode/netmask/blob/master/netmask.js
 * https://github.com/whitequark/ipaddr.js
 */

/**
 * 是否ipv4
 * @param ip
 */
export const isIpv4 = (ip: string) => {
    return IPv4.isIPv4(ip) && IPv4.isValidFourPartDecimal(ip);
};

/**
 * 用正则判断是有ipv4
 * @param ip
 */
export const hasIpv4 = (ip: string) => {
    const ipv4Regex =
        /\b(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\b/i;
    return ipv4Regex.exec(ip);
};

/**
 * IPv4.prototype.SpecialRanges = {
    unspecified: [[new IPv4([0, 0, 0, 0]), 8]],
    // 广播
    broadcast: [[new IPv4([255, 255, 255, 255]), 32]],
    // RFC3171 多播
    multicast: [[new IPv4([224, 0, 0, 0]), 4]],
    // RFC3927 本地
    linkLocal: [[new IPv4([169, 254, 0, 0]), 16]],
    // RFC5735 本地回环
    loopback: [[new IPv4([127, 0, 0, 0]), 8]],
    // RFC6598
    carrierGradeNat: [[new IPv4([100, 64, 0, 0]), 10]],
    // RFC1918 私有地址
    private: [
        [new IPv4([10, 0, 0, 0]), 8],
        [new IPv4([172, 16, 0, 0]), 12],
        [new IPv4([192, 168, 0, 0]), 16],
    ],
    // Reserved and testing-only ranges; RFCs 5735, 5737, 2544, 1700
    // 保留地址
    reserved: [
        [new IPv4([192, 0, 0, 0]), 24],
        [new IPv4([192, 0, 2, 0]), 24],
        [new IPv4([192, 88, 99, 0]), 24],
        [new IPv4([198, 18, 0, 0]), 15],
        [new IPv4([198, 51, 100, 0]), 24],
        [new IPv4([203, 0, 113, 0]), 24],
        [new IPv4([240, 0, 0, 0]), 4],
    ],
}; 
 */
/**
 * ivp4 地址范围
 * unspecified broadcast multicast linkLocal loopback carrierGradeNat private reserved
 */
export const ipv4Range = (ip: string) => {
    try {
        return IPv4.parse(ip).range();
    } catch (error) {
        return '';
    }
};

/**
 * ipv4 地址类型
 */
export const ipv4Long2class = (long: number) => {
    const a = (long & (0xff << 24)) >>> 24;

    if (a >= 1 && a <= 126) {
        return 'Class A';
    }

    if (a === 127) {
        return 'Class A (loopback)';
    }

    if (a >= 128 && a <= 191) {
        return 'Class B';
    }

    if (a >= 192 && a <= 223) {
        return 'Class C';
    }

    if (a >= 224 && a <= 239) {
        return 'Class D';
    }

    if (a >= 240 && a <= 254) {
        return 'Class E';
    }
    return 'unspecified or broadcast';
};

/**
 * 整形转 ipv4
 * @param long
 */
export const ipv4Long2ip = (long: number) => {
    const a = (long & (0xff << 24)) >>> 24;
    const b = (long & (0xff << 16)) >>> 16;
    const c = (long & (0xff << 8)) >>> 8;
    const d = long & 0xff;
    return [a, b, c, d].join('.');
};

/**
 * ipv4 转整形
 * @param ip
 */
export const ipv42long = (ip: string) => {
    let byte;
    let i = 0;
    let j = 0;
    const b = `${ip}`.split('.');
    let { length } = b;
    if (length !== 4) {
        throw new Error('Invalid IP');
    }
    // eslint-disable-next-line no-plusplus, no-multi-assign
    for (i = j = 0, length = b.length; j < length; i = ++j) {
        byte = parseInt(b[i], 10);
        // eslint-disable-next-line no-restricted-globals
        if (isNaN(byte)) {
            throw new Error(`Invalid byte: ${byte}`);
        }
        if (byte < 0 || byte > 255) {
            throw new Error(`Invalid byte: ${byte}`);
        }
    }
    return (
        (((parseInt(b[0], 10) || 0) << 24) |
            ((parseInt(b[1], 10) || 0) << 16) |
            ((parseInt(b[2], 10) || 0) << 8) |
            (parseInt(b[3], 10) || 0)) >>>
        0
    );
};

/**
 * ipv4 网络地址
 * 注意单个数字也会解析成 ipv4 的地址
 * 如：192.168.0.1/16 => 192.168.0.0
 * 这个函数要结合 ip 地址判断一起使用
 * @param ipPrefix 192.168.0.1/16
 */
export const ipv4Network = (ipPrefix: string) => {
    try {
        return IPv4.networkAddressFromCIDR(ipPrefix).toString();
    } catch (error) {
        return '';
    }
};

/**
 * 转换成正确的广播地址
 * 如：192.168.0.1/16 => 192.168.255.255
 * @param ipPrefix 192.168.0.1/16
 */
export const ipv4Broadcast = (ipPrefix: string) => {
    try {
        return IPv4.broadcastAddressFromCIDR(ipPrefix).toString();
    } catch (error) {
        return '';
    }
};

/**
 * A类、B类、C类地址（0.0.0.0~0.255.255.255、127.0.0.0~127.255.255.255除外）
 * @param data
 */
export const ipv4Exclude = (data: string) => {
    try {
        if (!isIpv4(data)) {
            return false;
        }
        const ipv4Class = ipv4Long2class(ipv42long(data));
        const inClass = ['Class A', 'Class B', 'Class C'];
        if (!inClass.includes(ipv4Class)) {
            return false;
        }
        const addr = IPv4.parse(data);
        const range = addr.range();
        if (range === 'unspecified' || range === 'loopback') {
            // 0.0.0.0~0.255.255.255
            // 127.0.0.0~127.255.255.255
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * A类、B类、C类地址（0.0.0.0~0.255.255.255、127.0.0.0~127.255.255.255、广播地址除外)
 * @param data
 */
export const ipv4ExcludeBroadcast = (data: string) => {
    try {
        if (!isIpv4(data)) {
            return false;
        }
        const ipv4Class = ipv4Long2class(ipv42long(data));
        const inClass = ['Class A', 'Class B', 'Class C'];
        if (!inClass.includes(ipv4Class)) {
            return false;
        }
        const addr = IPv4.parse(data);
        const range = addr.range();
        if (range === 'unspecified' || range === 'loopback' || range === 'broadcast') {
            // 0.0.0.0~0.255.255.255
            // 127.0.0.0~127.255.255.255
            // 广播地址 broadcast
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * 转换成正确的网络地址
 * 如：192.168.0.1/16 => 192.168.0.0/16
 * @param ipPrefix 192.168.0.1/16
 */
export function toIpv4NetworkAddressFromCIDR(ipPrefix: string) {
    let cidr;
    let i;
    let ipInterfaceOctets;
    let octets;
    let subnetMaskOctets;

    try {
        cidr = IPv4.parseCIDR(ipPrefix);
        ipInterfaceOctets = cidr[0].toByteArray();
        subnetMaskOctets = IPv4.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
        octets = [];
        i = 0;
        while (i < 4) {
            // Network address is bitwise AND between ip interface and mask
            octets.push(
                // eslint-disable-next-line no-bitwise
                parseInt(ipInterfaceOctets[i] as unknown as string, 10) &
                    parseInt(subnetMaskOctets[i] as unknown as string, 10),
            );
            i++;
        }
        const ip = new IPv4(octets);
        return `${ip.toString()}/${cidr[1]}`;
    } catch (e) {
        throw new Error(`ipaddr: the address does not have IPV4 CIDR format (${e})`);
    }
}
