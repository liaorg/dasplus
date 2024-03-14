import { MongooseRepositoryModule } from '@/common/repository';
import { AdminRouteModule } from '@/modules/core/admin-route/admin-route.module';
import { RoleGroupModule } from '@/modules/core/role-group/role-group.module';
import { Module } from '@nestjs/common';
import { MenuModule } from '../menu/menu.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { Tenant, TenantSchema } from './schemas';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

const providers = [TenantService];
@Module({
    imports: [
        MongooseRepositoryModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
        MenuModule,
        AdminRouteModule,
        UserModule,
        RoleModule,
        RoleGroupModule,
    ],
    controllers: [TenantController],
    providers: [...providers],
    exports: [MongooseRepositoryModule, ...providers],
})
export class TenantModule {}
