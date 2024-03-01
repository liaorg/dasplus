import { IPv6 } from 'ipaddr.js';
/**
 * 地址处理
 * https://github.com/evertcode/netmask/blob/master/netmask.js
 * https://github.com/whitequark/ipaddr.js
 */

/**
 * 是否 ipv6
 * @param ip
 */
export const isIpv6 = (ip: string) => {
    return IPv6.isIPv6(ip);
};

/**
 * 用正则判断是否有ipv6
 * @param ip
 */
export const hasIpv6 = (ip: string) => {
    const ipv6Regex =
        /\b((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\b/i;
    return ipv6Regex.exec(ip);
};

/**
IPv6.prototype.SpecialRanges = {
    // RFC4291, here and after
    'unspecified': [new IPv6([0, 0, 0, 0, 0, 0, 0, 0]), 128],
    'linkLocal': [new IPv6([0xfe80, 0, 0, 0, 0, 0, 0, 0]), 10],
    // 多播
    'multicast': [new IPv6([0xff00, 0, 0, 0, 0, 0, 0, 0]), 8],
    // 回环
    'loopback': [new IPv6([0, 0, 0, 0, 0, 0, 0, 1]), 128],
    // 本地唯一
    'uniqueLocal': [new IPv6([0xfc00, 0, 0, 0, 0, 0, 0, 0]), 7],
    'ipv4Mapped': [new IPv6([0, 0, 0, 0, 0, 0xffff, 0, 0]), 96],
    // RFC6145
    'rfc6145': [new IPv6([0, 0, 0, 0, 0xffff, 0, 0, 0]), 96],
    // RFC6052
    'rfc6052': [new IPv6([0x64, 0xff9b, 0, 0, 0, 0, 0, 0]), 96],
    // RFC3056
    '6to4': [new IPv6([0x2002, 0, 0, 0, 0, 0, 0, 0]), 16],
    // RFC6052, RFC6146
    'teredo': [new IPv6([0x2001, 0, 0, 0, 0, 0, 0, 0]), 32],
    // RFC4291
    // 保留地址
    'reserved': [[new IPv6([0x2001, 0xdb8, 0, 0, 0, 0, 0, 0]), 32]],
    'benchmarking': [new IPv6([0x2001, 0x2, 0, 0, 0, 0, 0, 0]), 48],
    'amt': [new IPv6([0x2001, 0x3, 0, 0, 0, 0, 0, 0]), 32],
    'as112v6': [new IPv6([0x2001, 0x4, 0x112, 0, 0, 0, 0, 0]), 48],
    'deprecated': [new IPv6([0x2001, 0x10, 0, 0, 0, 0, 0, 0]), 28],
    'orchid2': [new IPv6([0x2001, 0x20, 0, 0, 0, 0, 0, 0]), 28],
};
 */
/**
 * ivp6 地址范围
 * unspecified linkLocal multicast loopback uniqueLocal ipv4Mapped rfc6145
 * rfc6052 6to4 teredo reserved benchmarking amt as112v6 deprecated orchid2
 * unicast 单播
 */
export const ipv6Range = (ip: string) => {
    try {
        return IPv6.parse(ip).range();
    } catch (error) {
        return '';
    }
};

/**
 * ipv6 网络地址
 * 2006::1/64 => 2006::
 * @param ipPrefixlen 2006::1/64
 */
export const ipv6Network = (ipPrefixlen: string) => {
    try {
        return IPv6.networkAddressFromCIDR(ipPrefixlen).toString();
    } catch (error) {
        return '';
    }
};

/**
 * ipv6 网络地址
 * 2006::1/64 => 2006::ffff:ffff:ffff:ffff
 * @param ipPrefixlen 2006::1/64
 */
export const ipv6Broadcast = (ipPrefixlen: string) => {
    try {
        return IPv6.broadcastAddressFromCIDR(ipPrefixlen).toString();
    } catch (error) {
        return '';
    }
};

/**
 * IPv6地址(::、::1、ff00::/8网段范围地址除外)
 * @param data
 */
export const ipv6Exclude = (data: string) => {
    try {
        if (!IPv6.isValid(data)) {
            return false;
        }
        const addr = IPv6.parse(data);
        const ip = addr.toString();
        if (ip === '::' || ip === '::1') {
            return false;
        }
        const range = addr.range();
        if (range === 'multicast') {
            // 多播 ff00::/8
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * 转换成正确的网络地址
 * 如：2006::1/64 => 192.168.0.0/16
 * @param ipPrefix 2006::1/64
 */
export function toIpv6NetworkAddressFromCIDR(ipPrefix: string) {
    let cidr;
    let i;
    let ipInterfaceOctets;
    let octets;
    let subnetMaskOctets;

    try {
        cidr = IPv6.parseCIDR(ipPrefix);
        ipInterfaceOctets = cidr[0].toByteArray();
        subnetMaskOctets = IPv6.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
        octets = [];
        i = 0;
        while (i < 16) {
            // Network address is bitwise AND between ip interface and mask
            octets.push(
                // eslint-disable-next-line no-bitwise
                parseInt(ipInterfaceOctets[i] as unknown as string, 10) &
                    parseInt(subnetMaskOctets[i] as unknown as string, 10),
            );
            i++;
        }
        const ip = new IPv6(octets);
        return `${ip.toString()}/${cidr[1]}`;
    } catch (e) {
        throw new Error(`ipaddr: the address does not have IPV6 CIDR format (${e})`);
    }
}
