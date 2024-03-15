import { genCacheKey } from '@/common/helps';
import { InjectMongooseRepository, MongooseRepository } from '@/common/repository';
import { BaseService } from '@/common/services';
import { Injectable } from '@nestjs/common';
import { AdminRoute } from './schemas';

@Injectable()
export class AdminRouteService extends BaseService<AdminRoute> {
    constructor(
        @InjectMongooseRepository(AdminRoute.name)
        protected readonly repository: MongooseRepository<AdminRoute>,
    ) {
        const cacheKey: string = genCacheKey('AdminRouteService');
        super(repository, cacheKey);
        // 缓存数据
        this.initCache();
    }
}
