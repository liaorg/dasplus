import { CommonDescription } from '@/common/schemas';
import type { IRelation } from '@/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '../../role/schemas';

export type TenantDocument = HydratedDocument<Tenant>;

// collection 设置表名
// versionKey 不生成 __v 字段
// 租户表
@Schema({ collection: 'tenants', versionKey: false })
export class Tenant extends CommonDescription {
    /**
     * 租户id
     */
    @Prop({ type: Number, required: true, unique: true })
    tenant_id: number;
    /**
     * 名称
     */
    @Prop({ type: String, required: true })
    name: string;
    /**
     * 状态：0-停用|1-启用
     */
    @Prop({ type: Number, default: 1 })
    status?: number;
    /**
     * email
     */
    @Prop({ type: String, default: null })
    email?: string;
    /**
     * 角色
     */
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }] })
    roles?: IRelation<Role>[];
    /**
     * 排序
     */
    @Prop({ type: Number, default: 999 })
    order?: number;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
