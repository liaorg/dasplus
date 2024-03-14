import { PaginationListDto } from '@/common/dto';
import { Tenant } from '../schemas';

/**
 * 列表
 */
export class TenantListDto extends PaginationListDto {
    declare list: Tenant[];
}
