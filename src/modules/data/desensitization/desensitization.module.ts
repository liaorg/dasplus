import { connectionName } from '@/common/database';
import { MongooseRepositoryModule } from '@/common/repository';
import { Module } from '@nestjs/common';
import { DesensitizationController } from './desensitization.controller';
import { DesensitizationService } from './desensitization.service';
import { DesensitizationCfg, DesensitizationCfgSchema } from './schemas';

const providers = [DesensitizationService];

@Module({
    imports: [
        MongooseRepositoryModule.forFeature(
            [{ name: DesensitizationCfg.name, schema: DesensitizationCfgSchema }],
            connectionName.DBFW,
        ),
    ],
    controllers: [DesensitizationController],
    providers: [...providers],
    exports: [MongooseRepositoryModule, ...providers],
})
export class DesensitizationModule {}
