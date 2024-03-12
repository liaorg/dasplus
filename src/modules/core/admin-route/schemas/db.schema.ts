import { ObjectIdType } from '@/common/services';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AdminRouteDocument = HydratedDocument<AdminRoute>;

// collection 设置表名
// versionKey 不生成 __v 字段
@Schema({ collection: 'admin_routes', versionKey: false })
export class AdminRoute {
    // 接口URL路径
    @Prop({ type: String, required: true, index: true })
    path: string;
    // 本地化/国际化名称，对应 i18n 文件 route.json 中的字段
    @Prop({ type: String, default: '' })
    locale: string;
    // 操作方法 GET,PUT,PATCH,POST
    @Prop({ type: String, required: true, default: '' })
    method: string;
    // 所属菜单路径
    @Prop({ type: String, required: true, default: '' })
    menuPath: string;

    // 权限 一对一关系
    @Prop({ type: Types.ObjectId, ref: 'Permission' })
    permission?: ObjectIdType;
}

export const AdminRouteSchema = SchemaFactory.createForClass(AdminRoute);
