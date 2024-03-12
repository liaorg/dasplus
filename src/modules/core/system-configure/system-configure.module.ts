import { MongooseRepositoryModule } from '@/common/repository';
import { Module } from '@nestjs/common';
import { SystemConfigure, SystemConfigureSchema } from '../system-configure/schemas';
import { SystemConfigureService } from '../system-configure/system-configure.service';

const providers = [SystemConfigureService];

@Module({
    imports: [
        MongooseRepositoryModule.forFeature([
            { name: SystemConfigure.name, schema: SystemConfigureSchema },
        ]),
    ],
    providers: [...providers],
    exports: [MongooseRepositoryModule, ...providers],
})
export class SystemConfigureModule {}
