import { SystemConfigureModule } from '@/modules/core/system-configure/system-configure.module';
import { Module } from '@nestjs/common';
import { AdminHostModule } from '../admin-host/admin-host.module';
import { SecurityConfigureController } from './security-configure.controller';
import { SecurityConfigureService } from './security-configure.service';

@Module({
    imports: [SystemConfigureModule, AdminHostModule],
    controllers: [SecurityConfigureController],
    providers: [SecurityConfigureService],
    exports: [SecurityConfigureService],
})
export class SecurityConfigureModule {}
