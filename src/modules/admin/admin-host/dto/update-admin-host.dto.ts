import { RequestValidationSchema } from '@/common/decorators';
import { deleteAdminHostSchema, updateAdminHostSchema, upOrDownAdminHostSchema } from '../schemas';
// import { AdminHostIpAddressDto, AdminHostIpv6AddressDto } from './admin-host.dto';

// 注入验证 schema 对象
@RequestValidationSchema(updateAdminHostSchema)
export class UpdateAdminHostDto {
    /**
     * 状态：0-停用|1-启用
     * @example 1
     */
    status: number;
    /**
     * 类型 4代表ipv4 / 6代表ipv6
     * @example 4
     */
    type: number;
    /**
     * 目标网络
     * @example 10.4.71.10
     */
    address: string;

    /**
     * 子网掩码
     * @example 255.255.255.0
     */
    netmask?: string;

    /**
     * 前缀长度
     * @example 64
     */
    prefixlen?: number;

    /**
     * MAC地址
     * @example 00:0c:29:b2:a8:6b
     */
    mac?: string;

    /**
     * 描述
     * @example test
     */
    description?: string;
    update_date?: number;
}

// 删除管理主机
@RequestValidationSchema(deleteAdminHostSchema)
export class DeleteAdminHostDto {
    /**
     * 地址数组
     * @example [...]
     */
    address: string[];
}

// 启用/停用
@RequestValidationSchema(upOrDownAdminHostSchema)
export class UpOrDownAdminHostDto {
    /**
     * 地址数组
     * @example [...]
     */
    address: string[];
    /**
     * 状态：down-停用|up-启用
     * @example down
     */
    status: string;
}
