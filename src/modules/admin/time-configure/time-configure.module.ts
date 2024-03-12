import { SystemConfigureModule } from '@/modules/core/system-configure/system-configure.module';
import { Module } from '@nestjs/common';
import { TimeConfigureController } from './time-configure.controller';
import { TimeConfigureService } from './time-configure.service';

@Module({
    imports: [SystemConfigureModule],
    controllers: [TimeConfigureController],
    providers: [TimeConfigureService],
    exports: [TimeConfigureService],
})
export class TimeConfigureModule {}
