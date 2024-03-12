import { CommonDescription } from '@/common/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';
import { DesensitizationAuthorEnum } from '../enums';

export type DesensitizationCfgDocument = HydratedDocument<DesensitizationCfg>;

// collection 设置表名
// versionKey 不生成 __v 字段
@Schema({ collection: 'desensitization_cfg', versionKey: false })
export class DesensitizationCfg extends CommonDescription {
    // 类型，factory:默认  user:自定义
    @Prop({ type: String, default: DesensitizationAuthorEnum.user })
    author?: DesensitizationAuthorEnum;

    // 启用/停用
    @Prop({ type: Boolean, default: false })
    enable?: boolean;
    // 名称
    @Prop({ required: true, type: String, unique: true })
    name: string;
    // 匹配规则
    @Prop({ required: true, type: String })
    regex: string;
    // 公开的前缀
    @Prop({ type: Number, default: 1 })
    mask_public_left?: number;
    // 公开的后缀
    @Prop({ type: Number, default: 1 })
    mask_public_right?: number;
    // 填充字符
    @Prop({ type: String, default: '*' })
    maskchr?: string;
    // 示例
    @Prop({ type: String, default: '' })
    sample?: string;
    // 是否特殊算法
    @Prop({ type: MongoSchema.Types.Mixed, default: false })
    algorithm?: boolean | string;
}

export const DesensitizationCfgSchema = SchemaFactory.createForClass(DesensitizationCfg);
