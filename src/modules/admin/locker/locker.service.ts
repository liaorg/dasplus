import { genCacheKey } from '@/common/helps';
import { AnyObject } from '@/common/interfaces';
import { InjectMongooseRepository, MongooseRepository } from '@/common/repository';
import { BaseService } from '@/common/services';
import { Injectable } from '@nestjs/common';
import { CreateLockerDto, UpdateLockerDto } from './dto';
import { Locker, LockerDocument } from './schemas';

@Injectable()
export class LockerService extends BaseService<Locker> {
    constructor(
        @InjectMongooseRepository(Locker.name) protected readonly repository: MongooseRepository<Locker>,
    ) {
        const cacheKey: string = genCacheKey('LockerService');
        super(repository, cacheKey);
        // 缓存数据
        this.initCache();
    }

    // 获取缓存
    async getCacheDataByFilter(filter?: AnyObject) {
        const data = await this.getCache();
        if (filter) {
            return data.filter((item) => {
                let has = false;
                if (filter?.address) {
                    has = has && item.address === filter.address;
                }
                if (filter?.status) {
                    has = has && item.status === filter.status;
                }
                if (filter?.times) {
                    has = has && item.times >= filter.times;
                }
                return has;
            });
        }
        return data;
    }

    /**
     * 创建数据
     * @param create
     * @returns Promise<any>
     */
    async create(create: CreateLockerDto): Promise<LockerDocument> {
        const now = Date.now();
        // 添加
        const data = {
            ...create,
            status: 1,
            times: 1,
            create_date: now,
            update_date: now,
        };
        const added = await this.insert({ doc: data });
        // 缓存配置
        await this.initCache();
        return added;
    }

    /**
     * 更新数据
     * @param oldData
     * @returns
     */
    async update(address: string, oldData: UpdateLockerDto) {
        // 更新
        const filter = { address };
        const now = Date.now();
        const update = {
            ...oldData,
            update_date: now,
        };
        const updated = await this.updateOne({ filter, doc: update });
        if (updated.acknowledged) {
            // 缓存配置
            await this.initCache();
            return true;
        }
        // 失败返回 false
        return false;
    }

    // 批量更新数据
    async modifyByAddress(address: string[]): Promise<any> {
        const now = Date.now();
        const filter = {
            address: { $in: address },
            status: 1,
        };
        const update = { status: 0, times: 0, update_date: now };
        const updated = await this.updateMany({ filter, doc: update });
        if (updated.acknowledged) {
            // 缓存配置
            await this.initCache();
            return true;
        }
        // 失败返回 false
        return false;
    }
}
