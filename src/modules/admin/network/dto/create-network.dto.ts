import { RequestValidationSchema } from '@/common/decorators';
import { createNetworkSchema } from '../schemas';

import { IpAddressDto, Ipv6AddressDto } from './network.dto';

// 注入验证 schema 对象
@RequestValidationSchema(createNetworkSchema)
export class CreateNetworkDto {
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
