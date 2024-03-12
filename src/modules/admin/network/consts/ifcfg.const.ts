import { IfcfgDto } from '../dto';

/**
 * 网卡信息默认值
 * /etc/sysconfig/network-scripts/ 文件信息
 */
export const IFCFG: IfcfgDto = {
    /**
     * 网卡接口名
     * @example GE0-0
     */
    DEVICE: '',
    /**
     * 网卡名
     * @example GE0/0
     */
    NAME: '',
    /**
     * 模式：以太网
     * @example Ethernet
     */
    TYPE: 'Ethernet',
    /**
     * 启用地址协议
     * @example static
     */
    BOOTPROTO: 'static',
    /**
     * 系统启动时是否自动加载
     * @example yes/no
     */
    ONBOOT: 'yes',
    /**
     * 用户权限控制
     * @example yes/no
     */
    USERCTL: 'yes',
    /**
     * 是否指定DNS
     * @example yes/no
     */
    PEERDNS: 'no',
    /**
     * MAC地址
     * @example
     */
    HWADDR: '',
    /**
     * IP地址
     * @example
     */
    IPADDR: '',
    /**
     * 子网掩码
     * @example
     */
    NETMASK: '255.255.0.0',
    /**
     * 子网掩码
     * @example
     */
    PREFIX: '16',
    /**
     * 网关地址
     * @example
     */
    GATEWAY: '',
    /**
     * 是否执行IPv6
     * @example yes/no
     */
    IPV6INIT: 'no',
    /**
     * ipv6自动连接
     * @example yes/no
     */
    IPV6_AUTOCONF: 'no',
    /**
     * 如果ipv6配置失败禁用设备
     * @example yes/no
     */
    IPV6_FAILURE_FATAL: 'no',
    /**
     * ipv6地址
     * @example
     */
    IPV6ADDR: '',
    /**
     * ipv6前缀长度
     * @example
     */
    PREFIXLEN: '64',
    /**
     * ipv6网关地址
     * @example
     */
    IPV6_DEFAULTGW: '',
};
