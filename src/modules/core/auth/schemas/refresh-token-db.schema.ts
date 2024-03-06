import { ObjectIdType } from '@/common/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AccessTokenDocument } from './access-token-db.schema';
import { BaseToken } from './base-token-db.schema';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

// collection 设置表名
// versionKey 不生成 __v 字段
@Schema({ collection: 'refresh_tokens', versionKey: false })
export class RefreshToken extends BaseToken {
    @Prop({ type: Types.ObjectId, ref: 'AccessToken' })
    accessToken: AccessTokenDocument | ObjectIdType;

    // 修改时间, expires过期时间，以秒为单位 30天 = 86400 * 30 = 2592000
    @Prop({ type: Date, default: Date.now, expires: 2592000 })
    update_date?: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
