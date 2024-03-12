import { PaginationListDto } from '@/common/dto';
import { ObjectIdType } from '@/common/services';

export class DesensitizationDto {
    /**
     * id
     */
    _id: ObjectIdType;
    /**
     * 类型，factory:默认  user:自定义
     */
    author: string;
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
    enable: boolean;
    /**
     * 公开的前缀
     */
    mask_public_left: number;
    /**
     * 公开的后缀
     */
    mask_public_right: number;
    /**
     * 填充字符
     */
    maskchr: string;
    /**
     * 示例
     */
    sample: string;
    /**
     * 是否特殊算法
     */
    algorithm: boolean | string;
    /**
     * 描述
     */
    description: string;
    /**
     * 创建时间
     */
    create_dt: number;
    /**
     * 更新时间
     */
    update_dt: number;
}

/**
 * 列表
 */
export class DesensitizationListDto extends PaginationListDto {
    declare list: DesensitizationDto[];
}
