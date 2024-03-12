import { PaginationDto } from '@/common/dto';
import { DesensitizationAuthorEnum } from '../enums';
import { RequestValidationSchema } from '@/common/decorators';
import { queryDesensitizationSchema } from '../schemas';

/**
 * 查询
 */
// 注入验证 schema 对象
@RequestValidationSchema(queryDesensitizationSchema)
export class QueryDesensitizationDto extends PaginationDto {
    /**
     * 类别，factory-默认 user-自定义
     */
    author?: DesensitizationAuthorEnum;
    /**
     * 名称
     */
    name?: string;
    /**
     * 状态
     */
    enable?: boolean;
}
