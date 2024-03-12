import { RequestValidationSchema } from '@/common/decorators';
import { DeleteIpTypeEnum, ListenTypeEnum, StatusTypeEnum } from '../enums';
import { deleteIpSchema, listenNetworkSchema, upOrDownNetworkSchema } from '../schemas';

// 网卡启停
@RequestValidationSchema(upOrDownNetworkSchema)
export class UpOrDownNetworkDto {
    /**
     * 网卡接口名
     * @example ens37
     */
    device: string;
    /**
     * 启用状态 up/down
     * @example down
     */
    status: StatusTypeEnum;
}

// 网卡监听
@RequestValidationSchema(listenNetworkSchema)
export class ListenNetworkDto {
    /**
     * 网卡接口名
     * @example ens37
     */
    device: string;
    /**
     * 监听状态 yes/no
     * @example yes
     */
    status: ListenTypeEnum;
}

// 网卡删除IP
@RequestValidationSchema(deleteIpSchema)
export class DeleteIpDto {
    /**
     * 网卡接口名
     * @example ens37
     */
    device: string;
    /**
     * IP类型 all/ipv4/ipv6
     * @example all
     */
    type: DeleteIpTypeEnum;
}

/**
 * 修改网卡信息
 */
export class UpdateNetworkDto {
    /**
     * 网卡接口名，与 /sys/class/net/ 下对应
     */
    device: string;
    /**
     * 网卡名
     */
    name?: string;
    /**
     * 监听状态：0-未监听|1-监听
     */
    listening: number;
    /**
     * 是否管理口：0-否|1-是
     */
    isAdminPort?: number;
    /**
     * 是否检修口：0-否|1-是
     */
    isMaintainPort?: number;
}
