/**
 * 引擎业务操作
 */

import { Types } from 'mongoose';
import { AnyObject } from '.';

export type ObjectIdType = Types.ObjectId | string | number;

/**
 * 分页传参数
 */
export interface EnginePageInterface {
    limit: number;
    skip: number;
}

/**
 * 返回数据
 */
export interface EngineRepInterface<TData = any> {
    /**
     * 是否查询成功
     */
    ok: boolean;
    /**
     * 信息
     */
    doc?: AnyObject;
    /**
     * 查询列表的总数
     */
    count?: number;
    /**
     * 列表的内容
     */
    doclist?: TData[];
    /**
     * 错误消息
     */
    errmsg?: string;
    /**
     * insert成功会返回文档oid
     */
    docid?: string;
}
