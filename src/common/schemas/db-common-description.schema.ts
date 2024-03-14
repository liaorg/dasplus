import { Prop } from '@nestjs/mongoose';
import { CommonDate } from './db-common-date.schema';

/**
 * 数据表
 */
// collection 设置表名
// versionKey 不生成 __v 字段
export abstract class CommonDescription extends CommonDate {
    /**
     * 描述
     */
    @Prop({ type: String, maxLength: 200, default: '' })
    description?: string;
}
