// ip 地址信息
export class IpAddressDto {
    /**
     * ipv4地址
     * @example 10.4.71.10
     */
    address: string;
    /**
     * 子网掩码
     * @example 255.255.255.0
     */
    netmask: string;
    /**
     * 子网掩码
     * @example 16
     */
    netmaskInt?: number;
    /**
     * 默认网关
     * @example 10.4.0.1
     */
    gateway?: string;
}
// ipv6 地址信息
export class Ipv6AddressDto {
    /**
     * ipv6地址
     * @example 2004::24
     */
    address: string;
    /**
     * 前缀长度
     * @example 64
     */
    prefixlen: number;
    /**
     * 默认网关
     * @example 2004::1
     */
    gateway?: string;
}

export class BytesDto {
    /**
     * 原始值
     * @example
     */
    bytes: number;
    /**
     * 格式化后的值
     * @example
     */
    format: string;
}

/**
 * 网卡信息
 */
export class NetworkDto {
    /**
     * 网卡接口名
     * @example ens37
     */
    device: string;
    /**
     * 启用状态
     * @example
     */
    up: boolean;
    /**
     * 连接状态
     * @example
     */
    running: string;
    /**
     * 监听状态：0-未监听|1-监听
     * @example 0
     */
    listening?: number | boolean;
    /**
     * 网卡名
     * @example alias-ens37
     */
    name?: string;
    /**
     * mac地址
     * @example 00:15:5d:34:04:41
     */
    mac: string;

    /**
     * 接口类型: 电口/光口
     * @example
     */
    portType: string;
    /**
     * 速率类型 百兆/千兆/万兆
     * @example
     */
    speedType: string;
    /**
     * ipv4地址
     * @example
     */
    ipv4: IpAddressDto;
    /**
     * ipv6地址
     * @example
     */
    ipv6: Ipv6AddressDto;
    /**
     * 网卡负载
     * @example
     */
    cardLoad: number;
    /**
     * 接收总量
     * @example
     */
    receviceBytes: BytesDto;
    /**
     * 接收正确数据包
     * @example
     */
    recevicePackets?: BytesDto;
    /**
     * 接收错误数据包
     * @example
     */
    receviceErrs?: BytesDto;
    /**
     * 接收丢弃数据包
     * @example
     */
    receviceDrop?: BytesDto;
    /**
     * 发送总量
     * @example
     */
    transmitBytes: BytesDto;
    /**
     * 发送正确数据包
     * @example
     */
    transmitPackets?: BytesDto;
    /**
     * 发送错误数据包
     * @example
     */
    transmitErrs?: BytesDto;
    /**
     * 发送丢弃数据包
     * @example
     */
    transmitDrop?: BytesDto;
    /**
     * 是否管理口：0-否|1-是
     * @example 0
     */
    isAdminPort?: boolean;
    /**
     * 是否检修口：0-否|1-是
     * @example 0
     */
    isMaintainPort?: boolean;
}

/**
 * 网卡信息
 */
export class DeviceDto {
    /**
     * 网卡接口名，与 /sys/class/net/ 下对应
     */
    device: string;
}

/**
 * 网卡信息
 */
export class NetworkInfoDto {
    /**
     * 网卡
     * @example
     */
    device: string;
    /**
     * 网卡名
     * @example
     */
    name: string;
    /**
     * 是否管理口：0-否|1-是
     * @example 0
     */
    isAdminPort?: boolean;
    /**
     * 是否检修口：0-否|1-是
     * @example 0
     */
    isMaintainPort?: boolean;
    /**
     * ipv4地址
     * @example object {"address": "10.4.71.10","netmask": "255.255.255.0", "gateway": "10.4.0.1"}
     */
    ipv4?: IpAddressDto;
    /**
     * ipv6地址
     * @example {"address": "2004::24","prefixlen": 64, "gateway": "2004::01"}
     */
    ipv6?: Ipv6AddressDto;
}
