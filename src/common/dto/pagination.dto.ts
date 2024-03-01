import { SortOrder } from 'mongoose';
import { RequestValidationSchema } from '../decorators';
import { AnyObject } from '../interfaces';
import { paginationSchema } from '../schemas';

export type SortType<T> = {
    [key in keyof T]: SortOrder;
};

// 分页查询参数验证
@RequestValidationSchema({
    type: 'object',
    properties: {
        // 分页
        ...paginationSchema,
    },
})
export class PaginationDto<T = AnyObject> {
    /**
     * 当前的页数
     * @example 1
     */
    current?: number;
    /**
     * 每页展示的数据条数
     * @example 10
     */
    pageSize?: number;
    /**
     * 排序字段 {id: -1}，-1 降序，1 升序
     * @example {id: -1}
     */
    sort?: SortType<T>;
}

/**
 * 返回分页数据
 */
export class PaginationListDto<TData = any> {
    /**
     * 列表数据
     */
    list?: TData[];
    /**
     * 当前的页数
     * @example 1
     */
    current?: number;
    /**
     * 每页展示的数据条数
     * @example 10
     */
    pageSize?: number;
    /**
     * 总条数
     * @example 5
     */
    total?: number;
}
