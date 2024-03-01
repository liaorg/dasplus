import { Module } from '@nestjs/common';
import { mongoModules } from './mongo.modules';

/**
 * 数据库全局类服务, 比如整合 MongooseModule
 */
@Module({
    imports: [...mongoModules],
    exports: [...mongoModules],
})
export class DatabaseModule {}
