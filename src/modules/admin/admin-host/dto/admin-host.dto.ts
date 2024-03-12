import { PaginationListDto } from '@/common/dto';
import { ObjectIdType } from '@/common/services';

/**
 * 管理主机
 */
export class AdminHostDto {
    _id: ObjectIdType;
    /**
     * 类型 4 ipv4 6 ipv6
     * @example 4
     */
    type: number;
    /**
     * 目标网络IP地址
     * @example
     */
    address: string;
    /**
     * 子网掩码
     * @example
     */
    netmask?: string;
    /**
     * 前缀长度
     * @example 64
     */
    prefixlen?: number;
    /**
     * MAC地址
     * @example
     */
    mac?: string;
    /**
     * 状态：0-停用|1-启用
     * @example 0
     */
    status?: number;
    /**
     * 描述
     * @example test
     */
    description?: string;
}

export class AdminHostListDto extends PaginationListDto {
    /**
     * 管理主机列表
     */
    declare list: AdminHostDto[];
}

// ip 地址信息
export class AdminHostIpAddressDto {
    /**
     * ipv4地址
     * @example 10.4.71.10
     */
    address: string;
    /**
     * 子网掩码
     * @example 255.0.0.0
     */
    netmask: string;
    /**
     * MAC地址
     * @example 00:0c:29:b2:a8:6b
     */
    mac?: string;
}
// ipv6 地址信息
export class AdminHostIpv6AddressDto {
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
     * MAC地址
     * @example 00:0c:29:b2:a8:6b
     */
    mac?: string;
}
