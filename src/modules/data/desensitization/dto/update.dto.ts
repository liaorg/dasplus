import { RequestValidationSchema } from '@/common/decorators';
import { createDesensitizationSchema } from '../schemas';

// 注入验证 schema 对象
@RequestValidationSchema(createDesensitizationSchema)
export class UpdateDesensitizationDto {
    /**
     * 类型，factory:默认  user:自定义
     */
    author?: string;
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
    sample?: string;
    /**
     * 描述
     */
    description?: string;
}

/**
 * 删除信息
 */
export class DeleteDesensitizationDto {
    /**
     * 文档oid列表
     */
    oidlist?: string[];
    /**
     * 名称列表
     */
    nameList?: string[];
}
