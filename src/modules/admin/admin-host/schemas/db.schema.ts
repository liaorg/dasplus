import { CommonDescription } from '@/common/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IpTypeEnum } from '../../network/enums';

export type AdminHostDocument = HydratedDocument<AdminHost>;

// collection 设置表名
// versionKey 不生成 __v 字段
@Schema({ collection: 'admin_hosts', versionKey: false })
export class AdminHost extends CommonDescription {
    // 类型 4 ipv4 6 ipv6
    @Prop({ type: Number, index: true, default: 4 })
    type: IpTypeEnum;

    // 目标网络IP地址
    @Prop({ type: String, required: true, index: true, unique: true })
    address: string;

    // 子网掩码
    @Prop({ type: String, default: '' })
    netmask: string;

    // 前缀长度
    @Prop({ type: Number, default: 0 })
    prefixlen: number;

    // MAC地址
    @Prop({ type: String, default: '' })
    mac: string;

    // 状态：0-停用|1-启用
    @Prop({ type: Number, default: 0 })
    status: number;
}

export const AdminHostSchema = SchemaFactory.createForClass(AdminHost);
