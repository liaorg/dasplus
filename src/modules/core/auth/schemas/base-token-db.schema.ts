import { Prop, Schema } from '@nestjs/mongoose';

/**
 * 数据表
 */
// collection 设置表名
// versionKey 不生成 __v 字段
@Schema({ versionKey: false })
export abstract class BaseToken {
    // 令牌字符串
    @Prop({ type: String, required: true, index: true })
    value: string;
    // 令牌过期时间
    @Prop({ type: Number, required: true })
    expiredAt: number;

    // 创建时间
    @Prop({ type: Number, default: () => Date.now() })
    create_date?: number;
}
