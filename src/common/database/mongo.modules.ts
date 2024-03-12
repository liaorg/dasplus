import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { connectionName } from './database.constant';

export const mongoModules = [
    // 数据库配置 12310
    MongooseModule.forRootAsync({
        useFactory: async (configService: ConfigService) => {
            const options = configService.get('mongodbConfig.das');
            return { ...options };
        },
        inject: [ConfigService],
    }),
    // 数据库配置 12310
    MongooseModule.forRootAsync({
        connectionName: connectionName.DBFW,
        useFactory: async (configService: ConfigService) => {
            const options = configService.get('mongodbConfig.dbfw');
            return { ...options };
        },
        inject: [ConfigService],
    }),
    // // 12301
    // MongooseModule.forRootAsync({
    //     connectionName: connectionName.ENGINE_DBFW,
    //     useFactory: async (configService: ConfigService) => {
    //         const options = configService.get('mongodbConfig.engineDbfwConfig');
    //         return { ...options };
    //     },
    //     inject: [ConfigService],
    // }),
    // // 12302
    // MongooseModule.forRootAsync({
    //     connectionName: connectionName.ENGINE_DBFW_LOG,
    //     useFactory: async (configService: ConfigService) => {
    //         const options = configService.get('mongodbConfig.engineDbfwLogConfig');
    //         return { ...options };
    //     },
    //     inject: [ConfigService],
    // }),
];
