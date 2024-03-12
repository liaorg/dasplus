import { RequestValidationSchema } from '@/common/decorators';
import { createDesensitizationSchema } from '../schemas';

// 注入验证 schema 对象
@RequestValidationSchema(createDesensitizationSchema)
export class CreateDesensitizationDto {
    /**
     * 名称
     */
    name: string;
    /**
     * 匹配规则
     */
    regex: string;
    /**
     * 启用/停用
     */
    enable?: boolean;
    /**
     * 公开的前缀
     */
    mask_public_left?: number;
    /**
     * 公开的后缀
     */
    mask_public_right?: number;
    /**
     * 填充字符
     */
    maskchr?: string;
    /**
     * 示例
     */
    sample: string;
    /**
     * 描述
     */
    description?: string;
}
