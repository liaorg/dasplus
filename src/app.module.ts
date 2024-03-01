import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { AcceptLanguageResolver, HeaderResolver, QueryResolver, I18nModule } from 'nestjs-i18n';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database';
import { appConfig, mongodbConfig } from './config';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [
        // 导入配置文件
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            // 指定多个 env 文件时，第一个优先级最高 ['.env.1', '.env']
            envFilePath: `.env.${process.env.NODE_ENV}`,
            load: [appConfig, mongodbConfig],
        }),
        // 数据库连接
        DatabaseModule,
        // 国际化 i18n
        // pnpm add nestjs-i18n
        // https://github.com/toonvanstrijp/nestjs-i18n
        I18nModule.forRoot({
            fallbackLanguage: 'zh-CN',
            loaderOptions: {
                path: join(__dirname, '/i18n/'),
                watch: true,
            },
            // 可由前端传 header["x-das-lang"] 来设置语言
            // 支持 zh-CN en
            resolvers: [new HeaderResolver(['x-das-lang']), AcceptLanguageResolver],
        }),
        SharedModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
