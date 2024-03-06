import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database';
import { AnyExceptionFilter } from './common/filters';
import { TimeoutInterceptor } from './common/interceptors';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { decryptDataMiddleware, paramSignMiddleware } from './common/middleware';
import { RequestValidationSchemaPipe } from './common/pipes';
import { appConfig, isDev, mongodbConfig } from './config';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/core/auth/auth.module';

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
        AuthModule,
    ],
    controllers: [AppController],
    providers: [
        // 全局响应映射，从上往下注册，从下往上执行
        AppService,
        // 过滤器
        // 全局异常处理，从下往上执行
        { provide: APP_FILTER, useClass: AnyExceptionFilter },

        // 拦截器
        // 超时
        { provide: APP_INTERCEPTOR, useFactory: () => new TimeoutInterceptor(15 * 1000) },
        // 数据转换
        { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },

        // 管道
        // 全局 request 参数验证
        {
            provide: APP_PIPE,
            useClass: RequestValidationSchemaPipe,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // 引入参数签名验证中间件 .forRoutes('*')
        !isDev && consumer.apply(paramSignMiddleware).forRoutes('*');
        // 引入数据解密中间件
        consumer.apply(decryptDataMiddleware).forRoutes('/admin/user/login');
    }
}
