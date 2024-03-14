import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { SnowFlakeModule } from './snow-flake/snow-flake.module';

/**
 * 公共的非业务模块
 */

@Global()
@Module({
    imports: [
        // logger
        LoggerModule.forRoot(),
        // http
        HttpModule,
        // 雪花 ID
        SnowFlakeModule,
    ],
    exports: [HttpModule],
})
export class SharedModule {}
