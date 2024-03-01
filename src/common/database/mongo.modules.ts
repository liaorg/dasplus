import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

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
        connectionName: 'dbfw',
        useFactory: async (configService: ConfigService) => {
            const options = configService.get('mongodbConfig.dbfw');
            return { ...options };
        },
        inject: [ConfigService],
    }),
    // // 12301
    // MongooseModule.forRootAsync({
    //     connectionName: 'engineDbfw',
    //     useFactory: async (configService: ConfigService) => {
    //         const options = configService.get('mongodbConfig.engineDbfwConfig');
    //         return { ...options };
    //     },
    //     inject: [ConfigService],
    // }),
    // // 12302
    // MongooseModule.forRootAsync({
    //     connectionName: 'engineDbfwLog',
    //     useFactory: async (configService: ConfigService) => {
    //         const options = configService.get('mongodbConfig.engineDbfwLogConfig');
    //         return { ...options };
    //     },
    //     inject: [ConfigService],
    // }),
];
