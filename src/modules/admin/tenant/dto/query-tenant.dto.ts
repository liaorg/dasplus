import { PaginationDto } from '@/common/dto';

/**
 * 注入验证 schema 对象
 */
// @RequestValidationSchema(queryTenantSchema)
export class QueryTenantDto extends PaginationDto {
    /**
     * id
     * @example 10
     */
    tenant_id?: number;
    /**
     * 名称
     * @example 10.
     */
    name?: string;
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
