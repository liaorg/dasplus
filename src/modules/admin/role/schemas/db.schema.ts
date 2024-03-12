import { CommonDescription } from '@/common/schemas';
import { Permission } from '@/modules/core/permission/schemas';
import { RoleGroup } from '@/modules/core/role-group/schemas';
import { IRelation } from '@/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../user/schemas';

export type RoleDocument = HydratedDocument<Role>;

// collection 设置表名
// versionKey 不生成 __v 字段
@Schema({ collection: 'roles', versionKey: false })
export class Role extends CommonDescription {
    // 角色名
    @Prop({ type: String, unique: true, required: true, index: true })
    name: string;

    // 是否默认角色员：0-否|1-是，默认角色的权限(菜单和业务)不能修改
    @Prop({ type: Boolean, default: false })
    isDefault: boolean;

    // 状态：0-失效|1-有效|2-不可编辑
    @Prop({ type: Number, default: 0 })
    status: number;

    // 本地化/国际化名称，对应 i18n 文件 role.json 中的字段
    @Prop({ type: String, default: '' })
    locale?: string;

    // 角色所属角色组
    @Prop({ type: Types.ObjectId, ref: 'RoleGroup' })
    roleGroup: IRelation<RoleGroup>;

    // 用户
    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    users?: IRelation<User>[];

    // 默认管理用户
    @Prop({ type: Types.ObjectId, ref: 'User' })
    defaultUser?: IRelation<User>;

    // 权限
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Permission' }] })
    permissions: IRelation<Permission>[];

    // 排序
    @Prop({ type: Number, default: 999 })
    order?: number;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
