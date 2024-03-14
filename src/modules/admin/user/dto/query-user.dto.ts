/**
 * 请求输入输出规范
 */

import { RequestValidationSchema } from '@/common/decorators';
import { PaginationDto } from '@/common/dto';
import { queryUserSchema } from '../schemas';
import { ObjectIdType } from '@/common/services';

/**
 * 注入验证 schema 对象
 */
@RequestValidationSchema(queryUserSchema)
export class QueryUserDto extends PaginationDto {
    /**
     * 用户名
     * @example
     */
    name?: string;
    /**
     * 角色id
     * @example 1
     */
    roleId?: ObjectIdType;
    /**
     * 状态：0-停用|1-启用
     * @example 1
     */
    status?: number;
}
