import { MongooseRepositoryModule } from '@/common/repository';
import { AdminRouteModule } from '@/modules/core/admin-route/admin-route.module';
import { Module, forwardRef } from '@nestjs/common';
import { RoleModule } from '../role/role.module';
import { User, UserSchema } from './schemas';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const providers = [UserService];

@Module({
    imports: [
        MongooseRepositoryModule.forFeature([{ name: User.name, schema: UserSchema }]),
        forwardRef(() => RoleModule),
        AdminRouteModule,
    ],
    controllers: [UserController],
    providers: [...providers],
    exports: [MongooseRepositoryModule, ...providers],
})
export class UserModule {}
