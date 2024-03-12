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
        super(repository);
    }
}
