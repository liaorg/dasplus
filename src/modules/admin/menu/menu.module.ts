import { MongooseRepositoryModule } from '@/common/repository';
import { Module, forwardRef } from '@nestjs/common';
import { RoleModule } from '../role/role.module';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Menu, MenuSchema } from './schemas';

const providers = [MenuService];

@Module({
    imports: [
        MongooseRepositoryModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
        forwardRef(() => RoleModule),
    ],
    controllers: [MenuController],
    providers: [...providers],
    exports: [MongooseRepositoryModule, ...providers],
})
export class MenuModule {}
