import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ObjectIdType } from '../interfaces';

/**
 * 数据表
 */
// type: MongoSchema.Types.Mixed
// collection 设置表名
// versionKey 不生成 __v 字段
// @Schema({ versionKey: false })
export abstract class CommonDate {
    @Prop({ type: Types.ObjectId })
    _id?: ObjectIdType;
    // 创建时间UTC毫秒
    @Prop({ type: Number, default: () => Date.now() })
    create_date?: number;
    // 修改时间UTC毫秒
    @Prop({ type: Number, default: () => Date.now() })
    update_date?: number;
}
