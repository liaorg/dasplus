import { DeleteResult } from 'mongodb';
import {
    ClientSession,
    ClientSessionOptions,
    FilterQuery,
    InsertManyOptions,
    MongooseQueryOptions,
    PopulateOptions,
    ProjectionType,
    QueryOptions,
    UpdateQuery,
} from 'mongoose';
import { ApiErrorInterface, ObjectIdType } from '../interfaces';
import { MongooseRepository } from '../repository';

export abstract class BaseService<TM> {
    constructor(protected repository: MongooseRepository<TM>) {}

    // 获取模型
    getModel() {
        return this.repository.getModel();
    }

    /**
     * 插入文档
     * @param param
     * @returns
     */
    async insert(param: { doc: TM; options?: InsertManyOptions }, objectError?: ApiErrorInterface) {
        return this.repository.insert(param, objectError);
    }
    /**
     * 插入多个文档
     * @param doc
     * @param options
     * @returns InsertManyResult {acknowledged: boolean, insertedCount: 增加的数量, insertedIds: 增加的id}
     */
    async insertMany(
        param: { doc: TM[]; options?: InsertManyOptions },
        objectError?: ApiErrorInterface,
    ) {
        return this.repository.insertMany(param, objectError);
    }

    /**
     * 查找
     * @param filter
     * @param projection
     * @param options
     * @returns []
     */
    async find(
        param: {
            filter?: FilterQuery<TM>;
            projection?: ProjectionType<TM>;
            options?: QueryOptions<TM>;
        } = {},
        objectError?: ApiErrorInterface,
    ) {
        return this.repository.find(param, objectError);
    }

    /**
     * 查找
     * @param filter
     * @param projection
     * @param options
     * @returns TD | null
     */
    async findOne(
        param: {
            filter?: FilterQuery<TM>;
            projection?: ProjectionType<TM>;
            options?: QueryOptions<TM>;
        } = {},
        objectError?: ApiErrorInterface,
    ) {
        return this.repository.findOne(param, objectError);
    }

    /**
     * 查找
     * @param id
     * @param projection
     * @param options
     * @returns TD | null
     */
    async findById(
        id: ObjectIdType,
        param: { projection?: ProjectionType<TM>; options?: QueryOptions<TM> } = {},
        objectError?: ApiErrorInterface,
    ) {
        return this.repository.findById(id, param, objectError);
    }

    /**
     * 更新
     * @param id
     * @param doc
     * @param options
     * @returns ModifyResult {value: boolean, lastErrorObject: 错误, ok: 0 | 1}
     */
    async findByIdAndUpdate(
        id: ObjectIdType,
        param: { doc?: UpdateQuery<TM>; options?: QueryOptions<TM> } = {},
        objectError?: ApiErrorInterface,
    ) {
        return this.repository.findByIdAndUpdate(id, param, objectError);
    }

    /**
     * 更新
     * @param filter
     * @param doc
     * @param options
     * @returns ModifyResult {value: boolean, lastErrorObject: 错误, ok: 0 | 1}
     */
    async findOneAndUpdate(
        param: {
            filter: FilterQuery<TM>;
            doc?: TM;
            options?: QueryOptions<TM>;
        },
        objectError?: ApiErrorInterface,
    ) {
        return this.repository.findOneAndUpdate(param, objectError);
    }

    /**
     * 删除
     * @param filter
     * @param doc
     * @param options
     * @returns
     */
    async findOneAndDelete(
        param: {
            filter: FilterQuery<TM>;
            options?: QueryOptions<TM>;
        },
        objectError?: ApiErrorInterface,
    ) {
        return this.repository.findOneAndDelete(param, objectError);
    }

    /**
     * 更新
     * @param filter
     * @param doc
     * @param options
     * @returns UpdateResult {acknowledged: boolean, matchedCount: 匹配数量, modifiedCount: 修改数量, upsertedCount: 增加的数量, upsertedId: 增加的id}
     */
    async updateOne(
        param: {
            filter: FilterQuery<TM>;
            doc?: UpdateQuery<TM>;
            options?: Omit<MongooseQueryOptions<TM>, 'lean'>;
        },
        objectError?: ApiErrorInterface,
    ) {
        return this.repository.updateOne(param, objectError);
    }

    /**
     * 更新
     * @param filter
     * @param doc
     * @param options
     * @returns UpdateResult {acknowledged: boolean, matchedCount: 匹配数量, modifiedCount: 修改数量, upsertedCount: 增加的数量, upsertedId: 增加的id}
     */
    async updateMany(
        param: {
            filter: FilterQuery<TM>;
            doc?: UpdateQuery<TM>;
            options?: Omit<MongooseQueryOptions<TM>, 'lean'>;
        },
        objectError?: ApiErrorInterface,
    ) {
        return this.repository.updateMany(param, objectError);
    }

    /**
     * 删除
     * @param param
     * @returns DeleteResult {acknowledged: boolean, deletedCount: 删除数量}
     */
    async deleteOne(
        param: {
            filter: FilterQuery<TM>;
            options?: Omit<MongooseQueryOptions<TM>, 'lean' | 'timestamps'>;
        },
        objectError?: ApiErrorInterface,
    ): Promise<DeleteResult> {
        return this.repository.deleteOne(param, objectError);
    }

    /**
     * 批量删除
     * @param param
     * @returns DeleteResult {acknowledged: boolean, deletedCount: 删除数量}
     */
    async deleteMany(
        param: {
            filter: FilterQuery<TM>;
            options?: Omit<MongooseQueryOptions<TM>, 'lean' | 'timestamps'>;
        },
        objectError?: ApiErrorInterface,
    ): Promise<DeleteResult> {
        return this.repository.deleteMany(param, objectError);
    }

    /**
     * 根据 id 删除
     * @param id
     * @param options
     * @returns
     */
    async findByIdAndDelete(
        id: ObjectIdType,
        options?: QueryOptions<TM> | null,
        objectError?: ApiErrorInterface,
    ) {
        return this.repository.findByIdAndDelete(id, options, objectError);
    }

    /**
     * 查询分页数据
     * @param param
     * @returns
     */
    findPagination(
        param: {
            filter?: FilterQuery<TM>;
            projection?: ProjectionType<TM>;
            current?: number;
            pageSize?: number;
            sort?: any;
            populate?: string | string[] | PopulateOptions | PopulateOptions[];
        } = {},
    ) {
        return this.repository.findPagination(param);
    }

    /**
     * 统计数量
     * @param filter
     * @param doc
     * @param options
     * @returns UpdateResult {acknowledged: boolean, matchedCount: 匹配数量, modifiedCount: 修改数量, upsertedCount: 增加的数量, upsertedId: 增加的id}
     */
    async countDocuments(
        param: {
            filter: FilterQuery<TM>;
            options?: Omit<MongooseQueryOptions<TM>, 'lean' | 'timestamps'>;
        },
        objectError?: ApiErrorInterface,
    ) {
        return this.repository.countDocuments(param, objectError);
    }

    /**
     * 统计数量
     * @param filter
     * @param doc
     * @param options
     * @returns TD | null
     */
    async exists(param: { filter: FilterQuery<TM> }, objectError?: ApiErrorInterface) {
        return this.repository.exists(param, objectError);
    }

    /**
     * 事务会话
     * @param options
     * @returns
     */
    async startSession(options?: ClientSessionOptions): Promise<ClientSession> {
        return this.repository.startSession(options);
    }

    /**
     * 事务操作
     * @param trans
     * @returns
     */
    transaction(
        trans: (session: ClientSession) => Promise<any>,
        param?: { options?: ClientSessionOptions; session?: ClientSession },
    ) {
        return this.repository.transaction(trans, param);
    }

    /**
     * 多表关联查询
     * @param doc
     * @param options
     * @returns
     */
    async findOnePopulate(
        param: {
            filter?: FilterQuery<TM>;
            projection?: ProjectionType<TM>;
            options?: QueryOptions<TM>;
            populateOptions?: PopulateOptions | (PopulateOptions | string)[];
        },
        // objectError?: ApiErrorInterface,
    ) {
        return this.repository.findOnePopulate(param);
    }

    /**
     * 多表关联查询
     * @param doc
     * @param options
     * @returns
     */
    async findPopulate(
        param: {
            filter?: FilterQuery<TM>;
            projection?: ProjectionType<TM>;
            options?: QueryOptions<TM>;
            populateOptions?: PopulateOptions | (PopulateOptions | string)[];
        },
        // objectError?: ApiErrorInterface,
    ) {
        return this.repository.findPopulate(param);
    }

    /**
     * 获取分页参数
     * @param current 最小 1
     * @param pageSize 最多500 最小1
     * @returns
     */
    createLimitAndSkip(current: number, pageSize: number) {
        return this.repository.createLimitAndSkip(current, pageSize);
    }
}
