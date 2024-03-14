import { CommonDescription } from '@/common/schemas';
import { IRelation } from '@/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema, Types } from 'mongoose';
import { Role } from '../../role/schemas';
import { Tenant } from '../../tenant/schemas';

export type UserDocument = HydratedDocument<User>;

export interface BusinessInterface {
    // id为业务系统编号id
    // id:[-1] 时为全部
    id: number[];
    // 业务系统名称
    name: string[];
}

// collection 设置表名
// versionKey 不生成 __v 字段
@Schema({ collection: 'users', versionKey: false })
export class User extends CommonDescription {
    // 用户名称
    @Prop({ type: String, required: true, unique: true })
    name: string;

    // 密码
    @Prop({ type: String, required: true, select: false })
    password: string;

    // 密码修改时间UTC毫秒
    @Prop({ type: Number, default: 0 })
    password_update_date?: number;

    // 是否默认管理员：0-否|1-是
    @Prop({ type: Boolean, default: false })
    isDefault?: boolean;

    // 状态：0-停用|1-启用
    @Prop({ type: Number, default: 1 })
    status?: number;

    // email
    @Prop({ type: String, default: null })
    email?: string;

    // 真实姓名
    @Prop({ type: String, default: null })
    fullName?: string;

    // 性别：0-未知|1-男|2-女
    @Prop({ type: Number, default: 0 })
    gender?: number;

    // 地址
    @Prop({ type: String, default: null })
    address?: string;

    // 部门
    @Prop({ type: String, default: null })
    department?: string;

    // 职务
    @Prop({ type: String, default: null })
    duty?: string;

    // 身份证号
    @Prop({ type: String, default: null })
    idNumber?: string;

    // 手机号
    @Prop({ type: String, default: null })
    phoneNumber?: string;

    // QQ
    @Prop({ type: Number, default: 0 })
    qq?: number;

    // 业务系统，json {id:[],name:[]}，id:[-1] 时为全部
    // id为业务系统编号id
    @Prop({ type: MongoSchema.Types.Mixed })
    business?: BusinessInterface;

    // 用户角色id，一个用户只能对应一个角色
    @Prop({ type: Types.ObjectId, ref: 'Role' })
    role?: IRelation<Role>;

    // 排序
    @Prop({ type: Number, default: 999 })
    order?: number;

    // 角色所属租户
    @Prop({ type: Types.ObjectId, ref: 'Tenant' })
    tenant?: IRelation<Tenant>;
}

export const UserSchema = SchemaFactory.createForClass(User);
