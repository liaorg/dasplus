import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { appMiddleware } from './app.middleware';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({ /* logger: true, */ trustProxy: true }),
        {
            // 是否打印日志 false | 'log'、'fatal'、'error'、'warn'、'debug' 和 'verbose'
            logger: ['log', 'error', 'warn', 'debug'],
            bufferLogs: true,
        },
    );

    // 引入全局中间件
    await appMiddleware(app);

    const { PORT } = process.env;
    await app.listen(PORT, '0.0.0.0');
    const address = await app.getUrl();
    Logger.log(`bootstrap: ${address}`);
}
bootstrap();
