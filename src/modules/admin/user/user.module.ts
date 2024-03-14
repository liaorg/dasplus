import { MongooseRepositoryModule } from '@/common/repository';
import { AdminRouteModule } from '@/modules/core/admin-route/admin-route.module';
import { AuthModule } from '@/modules/core/auth/auth.module';
import { Module, forwardRef } from '@nestjs/common';
import { RoleModule } from '../role/role.module';
import { User, UserSchema } from './schemas';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const providers = [UserService];
@Module({
    // 注册存储库
    imports: [
        MongooseRepositoryModule.forFeature([{ name: User.name, schema: UserSchema }]),
        forwardRef(() => RoleModule),
        forwardRef(() => AuthModule),
        AdminRouteModule,
    ],
    controllers: [UserController],
    providers: [...providers],
    exports: [MongooseRepositoryModule, ...providers],
})
export class UserModule {}
