import { ObjectIdType } from '@/common/services';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MenuDocument = HydratedDocument<Menu>;

// collection 设置表名
// versionKey 不生成 __v 字段
@Schema({ collection: 'menus', versionKey: false })
export class Menu {
    @Prop({ type: Types.ObjectId })
    _id?: ObjectIdType;
    // 菜单路由路径
    @Prop({ type: String, required: true, unique: true, index: true })
    menuUrl: string;
    // 菜单名称，可以做为前端组件名要大写开头
    @Prop({ type: String, default: '' })
    menuName: string;
    // 路由组件名称
    @Prop({ type: String, default: '' })
    routeName?: string;
    // 父菜单id
    @Prop({ type: Types.ObjectId, default: '' })
    parentId?: ObjectIdType;
    // 菜单父路径
    @Prop({ type: String, default: '' })
    parentPath?: string;
    // 本地化/国际化名称，对应 i18n 文件 menu.json 中的字段
    @Prop({ type: String, default: '' })
    locale: string;
    // 是否需要登录鉴权requiresAuth 0-否|1-是
    @Prop({ type: Boolean, default: true })
    requiresAuth?: boolean;
    // 是否在菜单中隐藏该项hideInMenu 0-否|1-是
    @Prop({ type: Boolean, default: false })
    hideInMenu?: boolean;
    // 是否在菜单中隐藏三级children 0-否|1-是
    @Prop({ type: Boolean, default: true })
    hideChildrenInMenu?: boolean;
    // 是否不显示在tab-bar标签中 0-否|1-是
    @Prop({ type: Boolean, default: false })
    noAffix?: boolean;
    // 图标
    @Prop({ type: String, default: '' })
    icon?: string;
    // 排序值
    @Prop({ type: Number, default: 1 })
    order?: number;
    // 状态：0-失效|1-有效|2-不可编辑
    @Prop({ type: Number, default: 1 })
    status?: number;

    // 权限 一对一关系
    @Prop({ type: Types.ObjectId, ref: 'Permission' })
    permission?: ObjectIdType;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
