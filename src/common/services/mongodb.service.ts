import { Injectable, Logger } from '@nestjs/common';
import { DeleteResult } from 'mongodb';
import {
    AnyObject,
    CastError,
    ClientSession,
    ClientSessionOptions,
    FilterQuery,
    HydratedDocument,
    InsertManyOptions,
    Model,
    MongooseQueryOptions,
    PopulateOptions,
    ProjectionType,
    QueryOptions,
    Types,
    UpdateQuery,
} from 'mongoose';
import { ApiError } from '../constants/api-error-code.constant';
import { MongodbException } from '../exceptions/mongodb.exception';
import { ApiErrorInterface } from '../interfaces';
import { filterTransform, toObjectId } from '../utils';

// https://mongoosejs.com/docs/index.html
// https://docs.nestjs.com/techniques/mongodb

export type ObjectIdType = Types.ObjectId | string | number;

/**
 * 公共服务 数据库操作服务
 */
@Injectable()
export class MongoDbService<TM = any, TD = HydratedDocument<TM>> {
    protected logger = new Logger(MongoDbService.name);
    protected model: Model<TM>;
    constructor(model: Model<TM>) {
        try {
            this.model = model;
            this.model.events.on('error', (err) => this.logger.error(err));
        } catch (error: any) {
            this.handleRep(error, model);
        }
    }

    // 获取模型
    getModel() {
        return this.model;
    }

    /**
     * 插入文档
     * @param param
     * @returns
     */
    async insert(param: { doc: TM; options?: InsertManyOptions }, objectError?: ApiErrorInterface) {
        try {
            const { doc, options } = param;
            const data = await this.model.insertMany(doc, options);
            if (objectError && !data) {
                throw objectError;
            }
            return data[0] as TD;
        } catch (error: any) {
            this.handleRep(error, param);
        }
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
        try {
            const { doc, options } = param;
            const data = await this.model.insertMany(doc, options);
            if (objectError && !data) {
                throw objectError;
            }
            return data;
        } catch (error: any) {
            this.handleRep(error, param);
        }
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
        try {
            const { projection, options } = param;
            const filter = filterTransform(param?.filter);
            const data = await this.model.find(filter, projection, options).lean();
            if (objectError && !data?.length) {
                throw objectError;
            }
            return data;
        } catch (error: any) {
            this.handleRep(error, param);
        }
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
        try {
            const { projection, options } = param;
            const filter = filterTransform(param?.filter);
            const data = await this.model.findOne(filter, projection, options).lean();
            if (objectError && data === null) {
                throw objectError;
            }
            return data;
        } catch (error: any) {
            this.handleRep(error, param);
        }
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
        try {
            const { projection, options } = param;
            const data = await this.model.findById(toObjectId(id), projection, options).lean();
            if (objectError && data === null) {
                throw objectError;
            }
            return data;
        } catch (error: any) {
            this.handleRep(error, { id, ...param });
        }
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
        try {
            const { doc, options } = param;
            const data = await this.model.findByIdAndUpdate(toObjectId(id), doc, options).lean();
            if (objectError && data === null) {
                throw objectError;
            }
            return data;
        } catch (error: any) {
            this.handleRep(error, { id, ...param });
        }
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
        try {
            const { doc, options } = param;
            const filter = filterTransform(param?.filter);
            const data = await this.model.findOneAndUpdate(filter, doc, options).lean();
            if (objectError && data === null) {
                throw objectError;
            }
            return data;
        } catch (error: any) {
            this.handleRep(error, param);
        }
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
        try {
            const { options } = param;
            const filter = filterTransform(param?.filter);
            const data = await this.model.findOneAndDelete(filter, options).lean();
            if (objectError && data === null) {
                throw objectError;
            }
            return data;
        } catch (error: any) {
            this.handleRep(error, param);
        }
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
        try {
            const { doc, options } = param;
            const filter = filterTransform(param?.filter);
            const data = await this.model.updateOne(filter, doc, options);
            if (objectError && !data?.acknowledged) {
                throw objectError;
            }
            return data;
        } catch (error: any) {
            this.handleRep(error, param);
        }
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
        try {
            const { doc, options } = param;
            const filter = filterTransform(param?.filter);
            const data = await this.model.updateMany(filter, doc, options);
            if (objectError && !data?.acknowledged) {
                throw objectError;
            }
            return data;
        } catch (error: any) {
            this.handleRep(error, param);
        }
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
        try {
            const { options } = param;
            const filter = filterTransform(param?.filter);
            const data = await this.model.deleteOne(filter, options);
            if (objectError && !data?.acknowledged) {
                throw objectError;
            }
            return data;
        } catch (error: any) {
            this.handleRep(error, param);
        }
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
        try {
            const { options } = param;
            const filter = filterTransform(param?.filter);
            const data = await this.model.deleteMany(filter, options);
            if (objectError && !data?.acknowledged) {
                throw objectError;
            }
            return data;
        } catch (error: any) {
            this.handleRep(error, param);
        }
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
        try {
            const data = await this.model.findByIdAndDelete(toObjectId(id), options).lean();
            if (objectError && data === null) {
                throw objectError;
            }
            return data;
        } catch (error: any) {
            this.handleRep(error, { id, options });
        }
    }

    /**
     * 查询分页数据
     * @param param
     * @returns
     */
    async findPagination(
        param: {
            filter?: FilterQuery<TM>;
            projection?: ProjectionType<TM>;
            current?: number;
            pageSize?: number;
            sort?: any;
            populate?: string | string[] | PopulateOptions | PopulateOptions[];
        } = {},
    ) {
        try {
            const { current, pageSize, sort = { _id: -1 }, projection } = param;
            const filter = filterTransform(param?.filter);
            // 获取分页参数
            const { limit, skip } = this.createLimitAndSkip(current, pageSize);
            // 返回字段 projection
            // 分页参数
            const options = { limit, skip, sort, populate: param.populate };
            return await Promise.all([
                // 查询列表
                this.model.find(filter, projection, options).lean(),
                // 查询总数
                // this.model.estimatedDocumentCount(filter),
                this.model.countDocuments(filter),
            ]);
        } catch (error: any) {
            this.handleRep(error, param);
        }
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
        try {
            const { options } = param;
            const filter = filterTransform(param?.filter);
            const data = await this.model.countDocuments(filter, options);
            if (objectError && data === null) {
                throw objectError;
            }
            return data;
        } catch (error: any) {
            this.handleRep(error, param);
        }
    }

    /**
     * 统计数量
     * @param filter
     * @param doc
     * @param options
     * @returns TD | null
     */
    async exists(param: { filter: FilterQuery<TM> }, objectError?: ApiErrorInterface) {
        try {
            const filter = filterTransform(param?.filter);
            const data = await this.model.exists(filter);
            if (objectError && data === null) {
                throw objectError;
            }
            return data;
        } catch (error: any) {
            this.handleRep(error, param);
        }
    }

    /**
     * 事务会话
     * @param options
     * @returns
     */
    async startSession(options?: ClientSessionOptions): Promise<ClientSession> {
        try {
            return await this.model.startSession(options);
        } catch (error: any) {
            this.handleRep(error, { options });
        }
    }

    /**
     * 事务操作
     * @param trans
     * @returns
     */
    async transaction(
        trans: (session: ClientSession) => Promise<any>,
        param?: { options?: ClientSessionOptions; session?: ClientSession },
    ): Promise<any> {
        // 创建事务
        const options = param?.options;
        const session = param?.session || (await this.startSession(options));
        try {
            // 开始事务
            session.startTransaction();
            const result = await trans(session);
            if (result !== false) {
                // 没有错误时提交事务
                await session.commitTransaction();
            } else {
                // 如果遇到错误，回滚事务
                await session.abortTransaction();
            }
            return result;
        } catch (error) {
            // 如果遇到错误，回滚事务
            await session.abortTransaction();
            throw error;
        } finally {
            // 释放创建的事务
            await session.endSession();
        }
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
        try {
            const { projection, options, populateOptions } = param;
            const filter = filterTransform(param?.filter);
            return await this.model
                .findOne(filter, projection, options)
                .populate(populateOptions)
                .lean();
        } catch (error: any) {
            this.handleRep(error, { param });
        }
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
        try {
            const { projection, options, populateOptions } = param;
            const filter = filterTransform(param?.filter);
            return await this.model.find(filter, projection, options).populate(populateOptions).lean();
        } catch (error: any) {
            this.handleRep(error, { param });
        }
    }

    /**
     * 获取分页参数
     * @param current 最小 1
     * @param pageSize 最多500 最小1
     * @returns
     */
    createLimitAndSkip(current: number, pageSize: number) {
        let limit = +pageSize || 20;
        limit = limit < 1 ? 20 : limit > 500 ? 500 : limit;
        let skip = +current - 1 || 0;
        skip = skip < 0 ? 0 : skip * limit;
        const page = +current < 0 ? 1 : current;
        return { limit, skip, page };
    }

    /**
     * 统一处理返回结果
     * @param err
     * @param param
     */
    handleRep(err: ApiErrorInterface | Error | CastError, param?: AnyObject) {
        let params: any;
        try {
            params = param ? JSON.stringify(param) : '';
        } catch (error) {
            params = param;
        }
        let error: any;
        if ((err as ApiErrorInterface)?.errorCode) {
            error = {
                ...err,
            };
            throw new MongodbException(error, { params });
        } else {
            if ((err as CastError)?.kind === 'ObjectId') {
                error = {
                    ...ApiError.objectIdError,
                };
                throw new MongodbException(error, { params });
            } else {
                error = {
                    ...ApiError.serverError,
                    statusCode: 500,
                };
                const errorMsg = err ? err?.toString() : '';
                throw new MongodbException(error, { params, errorMsg, err });
            }
        }
    }
}
