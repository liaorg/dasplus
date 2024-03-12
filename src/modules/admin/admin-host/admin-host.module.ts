import { MongooseRepositoryModule } from '@/common/repository';
import { SystemConfigureModule } from '@/modules/core/system-configure/system-configure.module';
import { Module } from '@nestjs/common';
import { AdminHostController } from './admin-host.controller';
import { AdminHostService } from './admin-host.service';
import { AdminHost, AdminHostSchema } from './schemas';

@Module({
    imports: [
        MongooseRepositoryModule.forFeature([{ name: AdminHost.name, schema: AdminHostSchema }]),
        SystemConfigureModule,
    ],
    controllers: [AdminHostController],
    providers: [AdminHostService],
    exports: [MongooseRepositoryModule, AdminHostService],
})
export class AdminHostModule {}
