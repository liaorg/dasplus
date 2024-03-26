import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { DATA_CACHE_MANAGER, dataCacheProviders } from './cache/data-cache.providers';
import { LoggerModule } from './logger/logger.module';
import { SnowFlakeModule } from './snow-flake/snow-flake.module';

/**
 * 公共的非业务模块
 */

const modules = [
    // logger
    LoggerModule.forRoot(),
    // http
    HttpModule,
    // 雪花 ID
    SnowFlakeModule.forRoot(),
];

@Global()
@Module({
    imports: [...modules],
    providers: [
        // 缓存
        ...dataCacheProviders,
    ],
    exports: [...modules, DATA_CACHE_MANAGER],
})
export class SharedModule {}
