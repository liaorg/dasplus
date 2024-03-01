import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { appMiddleware } from './app.middleware';
import { AppModule } from './app.module';
import { fastifyApp } from './common/adapters';
import { LoggingInterceptor } from './common/interceptors';
import { isDev, isMainProcess } from './config';
import { setupSwagger } from './setup-swagger';
import { LoggerService } from './shared/logger/logger.service';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyApp, {
        bufferLogs: true,
        snapshot: true,
    });

    // 引入全局中间件
    await appMiddleware(app);

    if (isDev) app.useGlobalInterceptors(new LoggingInterceptor());

    // 接口文档
    if (isDev) {
        // development
        setupSwagger(app);
    }

    // 监听服务
    const { HOST, PORT } = process.env;
    await app.listen(parseInt(PORT) || 6100, HOST || '127.0.0.1', async () => {
        app.useLogger(app.get(LoggerService));
        const url = await app.getUrl();

        if (!isMainProcess) return;

        const logger = new Logger('NestApplication');
        logger.log(`Server running on ${url}`);

        if (isDev) logger.log(`Document WEB: ${url}/api-docs`);
    });
}
bootstrap();
