import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PermissionDocument = HydratedDocument<Permission>;

// collection 设置表名
// versionKey 不生成 __v 字段
// 权限映射表
@Schema({ collection: 'permissions', versionKey: false })
export class Permission {
    // 权限类型 menu admin_api element operate
    @Prop({ type: String, required: true, index: true })
    type: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
