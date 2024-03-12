import { OperateLogEnum } from '@/common/enum';
import { ObjectIdType } from '@/common/services';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema, Types } from 'mongoose';
export type OperateLogDocument = HydratedDocument<OperateLog>;

// collection 设置表名
// versionKey 不生成 __v 字段
// 操作日志表
@Schema({ collection: 'operate_log', versionKey: false })
export class OperateLog {
    /**
     * 日志类型
     * 99其它操作 1用户登录 2用户退出 3配置修改
     * 4系统管理 5业务操作 6导入 7导出
     */
    @Prop({ type: Number, required: true, index: true, default: 0 })
    type: OperateLogEnum;
    // 日志类型中文名
    @Prop({ type: String, default: '' })
    typeName?: string;
    // 操作业务模块，如用户管理
    @Prop({ type: String, default: '' })
    module?: string;
    // 操作时间
    @Prop({ type: Number, index: true, default: () => Math.ceil(Date.now() / 1000) })
    operateDate?: number;
    // 操作者
    @Prop({ type: String, index: true, default: '' })
    operator?: string;
    // 操作id如果有的话
    @Prop({ type: Types.ObjectId, default: '' })
    operatorId?: ObjectIdType;
    // 操作者ip
    @Prop({ type: String, default: '' })
    operatorIp?: string;
    // 日志内容
    @Prop({ type: String, default: '' })
    content: string;
    // 操作结果：0-失败|1-成功
    @Prop({ type: Number, default: 0 })
    status?: number;
    // 创建时间
    @Prop({ type: Number, default: () => Math.ceil(Date.now() / 1000) })
    createDate?: number;
    // 操作旧值 修改的时候有，以json格式记录
    @Prop({ type: MongoSchema.Types.Mixed })
    oldContent?: any;
    // 操作新值 新增和修改的时候有，以json格式记录
    @Prop({ type: MongoSchema.Types.Mixed })
    newContent?: any;
    /**
     * 注意这个的日志信息不能改变，如有改变要通知引擎，因为引擎那边有监控这个
     * 只针对操作日志响应配置操作，其它操作不要增加这个字段
     */
    @Prop({ type: Number })
    actionOperate?: number;
}

export const OperateLogSchema = SchemaFactory.createForClass(OperateLog);
