import { Logger, NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AdapterApplication, adapter, adapterMiddleware, adapterName } from './common/adapters';
import { LoggingInterceptor } from './common/interceptors';
import { isDev, isMainProcess } from './config';
import { setupSwagger } from './setup-swagger';
import { LoggerService } from './shared/logger/logger.service';

declare const module: any;

async function bootstrap() {
    const adapterOptions: NestApplicationOptions = {
        // 是否打印日志
        logger: isDev ? ['log'] : false,
        bufferLogs: true,
        snapshot: true,
    };
    const app = await NestFactory.create<AdapterApplication>(AppModule, adapter, adapterOptions);

    // 引入全局中间件
    await adapterMiddleware(app);

    if (isDev) {
        // 开发模式时记录日志
        app.useGlobalInterceptors(new LoggingInterceptor());
    }

    // 接口文档
    if (isDev) {
        // development
        await setupSwagger(app);
    }

    // 监听服务
    const { HOST, PORT } = process.env;
    await app.listen(parseInt(PORT) || 6100, HOST || '127.0.0.1', async () => {
        app.useLogger(app.get(LoggerService));
        const url = await app.getUrl();

        if (!isMainProcess) return;

        const logger = new Logger(adapterName);
        logger.log(`Server running on: ${url}`);
        logger.log(`OpenAPI running on: ${url}/api-docs`);
    });

    // 热更新
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
