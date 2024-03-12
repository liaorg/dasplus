import { RequestValidationSchema } from '@/common/decorators';
import { PaginationDto } from '@/common/dto';
import { queryAdminHostSchema } from '../schemas';

/**
 * 注入验证 schema 对象
 */
@RequestValidationSchema(queryAdminHostSchema)
export class QueryAdminHostDto extends PaginationDto {
    /**
     * IP地址
     * @example 10.
     */
    address?: string;
    /**
     * 状态：0-停用|1-启用
     * @example 0
     */
    status?: number;
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
}
