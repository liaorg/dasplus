import { RequestValidationSchema } from '@/common/decorators';
import { createAdminHostSchema } from '../schemas';

import { AdminHostIpAddressDto, AdminHostIpv6AddressDto } from './admin-host.dto';

// 注入验证 schema 对象
@RequestValidationSchema(createAdminHostSchema)
export class CreateAdminHostDto {
    /**
     * 状态：0-停用|1-启用
     * @example 0
     */
    status: number;
    /**
     * ipv4地址
     * @example
     */
    ipv4?: AdminHostIpAddressDto;
    /**
     * ipv6地址
     * @example
     */
    ipv6?: AdminHostIpv6AddressDto;
    /**
     * 描述
     * @example test
     */
    description?: string;
}
