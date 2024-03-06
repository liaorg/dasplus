import { ObjectIdType } from '@/common/interfaces';
import { CommonDate } from '@/common/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PermissionDocument } from '../../permission/schemas';
import { RoleGroupTypeEnum } from '../enums';

export type RoleGroupDocument = HydratedDocument<RoleGroup>;

// collection 设置表名
// versionKey 不生成 __v 字段
// 角色组表
@Schema({ collection: 'role_groups', versionKey: false })
export class RoleGroup extends CommonDate {
    // 角色类
    @Prop({ type: Number, required: true, unique: true })
    type: RoleGroupTypeEnum;
    // 角色组名
    @Prop({ type: String, unique: true, required: true, index: true })
    name: string;
    // 本地化/国际化名称，对应 i18n 文件 role.json 中的字段
    @Prop({ type: String, default: '' })
    locale: string;

    // 角色
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }] })
    roles: ObjectIdType[];

    // 默认管理角色
    @Prop({ type: Types.ObjectId, ref: 'Role' })
    defaultRole: ObjectIdType;

    // 权限
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Permission' }] })
    permissions: PermissionDocument[] | ObjectIdType[];

    // 排序
    @Prop({ type: Number, default: 999 })
    order?: number;
}

export const RoleGroupSchema = SchemaFactory.createForClass(RoleGroup);
