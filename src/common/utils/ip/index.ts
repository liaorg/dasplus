import { parse as parseIp, parseCIDR, IPv4, IPv6 } from 'ipaddr.js';
import { ipv4Long2class, ipv42long, hasIpv4 } from './ipv4';
import { hasIpv6 } from './ipv6';

/**
 * 地址处理
 * https://github.com/evertcode/netmask/blob/master/netmask.js
 * https://github.com/whitequark/ipaddr.js
 */

/**
 * IPv4、IPv6地址，如：192.168.0.1或0:0:0:0:0:0:c0a8:0001
 * @param data
 */
export const isIp = (data: string) => {
    try {
        const ip = parseIp(data);
        if (ip.kind() === 'ipv4') {
            // 是否 以 . 号分割的 ip
            return IPv4.isValidFourPartDecimal(data);
        }
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * 用正则判断是否有 ip 地址
 * @param ip
 */
export const hasIp = (ip: string) => {
    const isIpv4 = hasIpv4(ip);
    if (isIpv4 !== null) {
        return isIpv4;
    }
    return hasIpv6(ip);
};

/**
 * A 类、B 类、C 类 IPv4 地址或 IPv6 地址
 * (0.0.0.0~0.255.255.255、127.0.0.0~127.255.255.255、::、::1、ff00::/8网段范围地址除外)
 * @param data
 */
export const ipExclude = (data: string) => {
    try {
        const addr = parseIp(data);
        const kind = addr.kind();
        if (kind === 'ipv4') {
            // 是否 以 . 号分割的 ip
            if (!IPv4.isValidFourPartDecimal(data)) {
                return false;
            }
            const ipv4Class = ipv4Long2class(ipv42long(data));
            const inClass = ['Class A', 'Class B', 'Class C'];
            if (!inClass.includes(ipv4Class)) {
                return false;
            }
            const range = addr.range();
            if (range === 'unspecified' || range === 'loopback') {
                // 0.0.0.0~0.255.255.255
                // 127.0.0.0~127.255.255.255
                return false;
            }
            return true;
        }
        if (kind === 'ipv6') {
            const ip = addr.toString();
            if (ip === '::' || ip === '::1') {
                return false;
            }
            const range = addr.range();
            if (range === 'multicast') {
                // 多播
                return false;
            }
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

/**
 * IPv4、IPv6地址，如：192.168.0.1或0:0:0:0:0:0:c0a8:0001
 * (0.0.0.0,::除外)
 */
export const ipExcludeFirst = (data: string) => {
    try {
        if (data === '::' || data === '0.0.0.0') {
            return false;
        }
        const addr = parseIp(data);
        const kind = addr.kind();
        if (kind === 'ipv4') {
            // 是否 以 . 号分割的 ip
            return IPv4.isValidFourPartDecimal(data);
        }
        if (kind === 'ipv6' && addr.toString() === '::') {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * 请输入正确IPv4或IPv6网段（0.0.0.0/X、::/X除外）
 */
export const ipNetworkExclude = (data: string) => {
    try {
        const addr = parseCIDR(data);
        const kind = addr[0].kind();
        const prefix = addr[1];
        if (kind === 'ipv4') {
            // 是否 以 . 号分割的 ip
            const ip = addr[0].toString();
            if (!IPv4.isValidFourPartDecimal(ip)) {
                return false;
            }
            // 获取网络地址
            const network = IPv4.networkAddressFromCIDR(data).toString();
            if (network === '0.0.0.0') {
                return false;
            }
            return `${network}/${prefix}`;
        }
        if (kind === 'ipv6') {
            // 获取网络地址
            const network = IPv6.networkAddressFromCIDR(data).toString();
            if (network === '::') {
                return false;
            }
            return `${network}/${prefix}`;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export * from './ipv4';
export * from './ipv6';
