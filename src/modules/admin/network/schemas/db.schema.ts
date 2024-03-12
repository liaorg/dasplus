import { CommonDate } from '@/common/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';
import { DeviceDto, NetworkInfoDto } from '../dto';

export type NetworkDocument = HydratedDocument<Network>;

// collection 设置表名
// versionKey 不生成 __v 字段
@Schema({ collection: 'network_cfg', versionKey: false })
export class Network extends CommonDate {
    // 监听口数组
    @Prop({ required: true, type: MongoSchema.Types.Mixed })
    listening: DeviceDto[];

    // 网卡列表数组
    @Prop({ required: true, type: MongoSchema.Types.Mixed })
    info: NetworkInfoDto[];
}

export const NetworkSchema = SchemaFactory.createForClass(Network);
