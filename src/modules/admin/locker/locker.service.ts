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
        super(repository);
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
        return await this.insert({ doc: data });
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
            return true;
        }
        // 失败返回 false
        return false;
    }
}
