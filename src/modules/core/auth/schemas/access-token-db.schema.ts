import { ObjectIdType } from '@/common/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseToken } from './base-token-db.schema';

export type AccessTokenDocument = HydratedDocument<AccessToken>;

// collection 设置表名
// versionKey 不生成 __v 字段
@Schema({ collection: 'access_tokens', versionKey: false })
export class AccessToken extends BaseToken {
    // 登录ip
    @Prop({ type: String, default: '' })
    login_ip?: string;
    // 登录用户id
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: ObjectIdType;
    // 登录用户角色id
    @Prop({ type: Types.ObjectId, ref: 'Role' })
    role: ObjectIdType;

    // 修改时间, expires过期时间，以秒为单位 30分钟 = 60 * 10 = 600
    @Prop({ type: Date, default: Date.now, expires: 600 })
    update_date?: Date;
}

export const AccessTokenSchema = SchemaFactory.createForClass(AccessToken);
