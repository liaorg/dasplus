import { ObjectIdType } from '@/common/services';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ElementDocument = HydratedDocument<Element>;

// collection 设置表名
// versionKey 不生成 __v 字段
@Schema({ collection: 'elements', versionKey: false })
export class Element {
    // 操作类型 元素id名
    @Prop({ type: String, required: true, unique: true, index: true })
    node: string;

    // 权限 一对一关系
    @Prop({ type: Types.ObjectId, ref: 'Permission' })
    permission?: ObjectIdType;
}

export const ElementSchema = SchemaFactory.createForClass(Element);
