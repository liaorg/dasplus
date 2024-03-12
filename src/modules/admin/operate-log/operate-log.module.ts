import { connectionName } from '@/common/database';
import { MongooseRepositoryModule } from '@/common/repository';
import { SystemConfigureModule } from '@/modules/core/system-configure/system-configure.module';
import { Module } from '@nestjs/common';
import { RoleModule } from '../role/role.module';
import { OperateLogController } from './operate-log.controller';
import { OperateLogService } from './operate-log.service';
import { OperateLog, OperateLogSchema } from './schemas';

const providers = [OperateLogService];

@Module({
    imports: [
        MongooseRepositoryModule.forFeature(
            [{ name: OperateLog.name, schema: OperateLogSchema }],
            connectionName.ENGINE_DBFW_LOG,
        ),
        SystemConfigureModule,
        RoleModule,
    ],
    controllers: [OperateLogController],
    providers: [...providers],
    exports: [MongooseRepositoryModule, ...providers],
})
export class OperateLogModule {}
