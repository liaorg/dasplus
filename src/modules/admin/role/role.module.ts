import { MongooseRepositoryModule } from '@/common/repository';
import { AdminRouteModule } from '@/modules/core/admin-route/admin-route.module';
import { AuthModule } from '@/modules/core/auth/auth.module';
import { RoleGroupModule } from '@/modules/core/role-group/role-group.module';
import { Module, forwardRef } from '@nestjs/common';
import { MenuModule } from '../menu/menu.module';
import { UserModule } from '../user/user.module';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role, RoleSchema } from './schemas';

const providers = [RoleService];

@Module({
    imports: [
        MongooseRepositoryModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
        forwardRef(() => MenuModule),
        forwardRef(() => UserModule),
        AuthModule,
        RoleGroupModule,
        AdminRouteModule,
    ],
    controllers: [RoleController],
    providers: [...providers],
    exports: [MongooseRepositoryModule, ...providers],
})
export class RoleModule {}
