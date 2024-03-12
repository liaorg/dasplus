import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';
import { ConfigTypeEnum } from '../enum';

export type SystemConfigureDocument = HydratedDocument<SystemConfigure>;

// 连接表名 系统配置
// 时间配置，
// 系统安全配置-登录安全配置、密码安全配置、端口安全配置

// collection 设置表名
// versionKey 不生成 __v 字段
@Schema({ collection: 'system_configures', versionKey: false })
export class SystemConfigure {
    // 配置类型
    @Prop({ required: true, index: true, unique: true })
    type: ConfigTypeEnum;

    // 配置信息，json 字符串
    @Prop({ type: MongoSchema.Types.Mixed, default: '' })
    content: any;

    // 修改时间UTC毫秒
    @Prop({ default: () => Date.now() })
    update_date?: number;
}

export const SystemConfigureSchema = SchemaFactory.createForClass(SystemConfigure);
