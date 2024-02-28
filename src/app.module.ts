import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './config';

@Module({
    imports: [
        // 导入配置文件
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV}`,
            load: [appConfig],
            cache: true,
            isGlobal: true,
        }),
        // 数据库配置 12310
        // CoreModule.forRootAsync({
        //     useFactory: () => dasConfig,
        // }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
