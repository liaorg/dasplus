import '@/common/adapters';
import { RequestUserDto } from '@/common/dto';
import { ObjectIdType } from '@/common/interfaces';
import { FlattenMaps, Types } from 'mongoose';

/**
 * 扩展 Request 中 user 字段: 登录用户
 */
declare module '@/common/adapters' {
    interface AdapterRequest {
        user?: RequestUserDto;
        route?: any;
        body?: any;
        routeOptions?: any;
    }
}

/**
 * mongoose 文档结构
 */
declare type IDocument<T = any> = FlattenMaps<T> & { _id: Types.ObjectId };

/**
 * mongoose 表之间的联系
 */
declare type IRelation<T = any> = ObjectIdType | (T & { _id: Types.ObjectId });

/**
 * 防止SWC下循环依赖报错
 */
declare type WrapperType<T> = T; // WrapperType === Relation
