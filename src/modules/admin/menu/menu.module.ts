import { MongooseRepositoryModule } from '@/common/repository';
import { AuthModule } from '@/modules/core/auth/auth.module';
import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Menu, MenuSchema } from './schemas';

const providers = [MenuService];

@Module({
    imports: [
        MongooseRepositoryModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
        AuthModule,
    ],
    controllers: [MenuController],
    providers: [...providers],
    exports: [MongooseRepositoryModule, ...providers],
})
export class MenuModule {}
