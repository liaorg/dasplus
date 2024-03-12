/**
 * 网卡信息
 * /etc/sysconfig/network-scripts/ifcfg- 文件信息
 */
export class IfcfgDto {
    /**
     * 网卡接口名
     * @example ens37
     */
    DEVICE: string;
    /**
     * 网卡名
     * @example alias-ens37
     */
    NAME?: string;
    /**
     * 模式：以太网
     * @example Ethernet
     */
    TYPE: string;
    /**
     * 启用地址协议
     * @example static
     */
    BOOTPROTO: string;
    /**
     * 系统启动时是否自动加载
     * @example yes/no
     */
    ONBOOT: string;
    /**
     * 用户权限控制
     * @example yes/no
     */
    USERCTL?: string;
    /**
     * 是否指定DNS
     * @example yes/no
     */
    PEERDNS?: string;
    /**
     * MAC地址
     * @example
     */
    HWADDR?: string;
    /**
     * IP地址
     * @example
     */
    IPADDR: string;
    /**
     * 子网掩码
     * @example
     */
    NETMASK: string;
    /**
     * 子网掩码
     * @example
     */
    PREFIX: string;
    /**
     * 网关地址
     * @example
     */
    GATEWAY: string;
    /**
     * 是否执行IPv6
     * @example yes/no
     */
    IPV6INIT?: string;
    /**
     * ipv6自动连接
     * @example yes/no
     */
    IPV6_AUTOCONF?: string;
    /**
     * 如果ipv6配置失败禁用设备
     * @example yes/no
     */
    IPV6_FAILURE_FATAL?: string;
    /**
     * ipv6地址
     * @example
     */
    IPV6ADDR?: string;
    /**
     * ipv6前缀长度
     * @example
     */
    PREFIXLEN?: string;
    /**
     * ipv6网关地址
     * @example
     */
    IPV6_DEFAULTGW?: string;
}
