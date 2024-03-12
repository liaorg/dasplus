import { CommonDate } from '@/common/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LockerDocument = HydratedDocument<Locker>;

// collection 设置表名
// versionKey 不生成 __v 字段
@Schema({ collection: 'lockers', versionKey: false })
export class Locker extends CommonDate {
    // 用户名称
    @Prop({ type: String, required: true })
    username: string;
    // IP地址
    @Prop({ type: String, required: true, index: true, unique: true })
    address: string;
    // 状态：1-锁定|0-解锁
    @Prop({ type: Number, default: 1 })
    status?: number;
    // 锁定次数
    @Prop({ type: Number, default: 1 })
    times?: number;
    // 锁定秒数
    @Prop({ type: Number, default: 1800 })
    seconds?: number;
}

export const LockerSchema = SchemaFactory.createForClass(Locker);
