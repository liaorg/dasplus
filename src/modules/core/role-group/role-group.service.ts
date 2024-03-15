import { genCacheKey } from '@/common/helps';
import { InjectMongooseRepository, MongooseRepository } from '@/common/repository';
import { BaseService } from '@/common/services';
import { Injectable } from '@nestjs/common';
import { RoleGroup } from './schemas';

// 获取角色类型
@Injectable()
export class RoleGroupService extends BaseService<RoleGroup> {
    constructor(
        @InjectMongooseRepository(RoleGroup.name)
        protected readonly repository: MongooseRepository<RoleGroup>,
    ) {
        const cacheKey: string = genCacheKey('RoleGroupService');
        super(repository, cacheKey);
        // 缓存数据
        this.initCache();
    }
}
