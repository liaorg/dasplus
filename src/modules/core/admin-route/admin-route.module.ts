import { MongooseRepositoryModule } from '@/common/repository';
import { Module } from '@nestjs/common';
import { AdminRouteService } from './admin-route.service';
import { AdminRoute, AdminRouteSchema } from './schemas';

const providers = [AdminRouteService];

@Module({
    imports: [
        MongooseRepositoryModule.forFeature([{ name: AdminRoute.name, schema: AdminRouteSchema }]),
    ],
    providers: [...providers],
    exports: [MongooseRepositoryModule, ...providers],
})
export class AdminRouteModule {}
