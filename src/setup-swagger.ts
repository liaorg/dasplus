/**
 * openi api swagger 中间件
 * pnpm add @nestjs/swagger swagger-ui-express
 * 在控制器中加入 @ApiBearerAuth()
 */
import { Logger } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

// 函数式中间件
// 没有成员，没有额外的方法，没有依赖关系
export function setupSwagger(app: NestFastifyApplication): NestFastifyApplication {
    // 配置 Swagge
    const swaggeConfig = new DocumentBuilder()
        // 开启 BearerAuth 授权认证
        .addBearerAuth()
        .setTitle('管理后台')
        // .setDescription('管理后台接口')
        .setVersion('v1.0')
        .build();
    const options: SwaggerDocumentOptions = {
        operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
    };
    const prefix = 'api-docs';
    try {
        const swaggeDocument = SwaggerModule.createDocument(app, swaggeConfig, options);
        SwaggerModule.setup(prefix, app, swaggeDocument);
    } catch (error) {
        Logger.error('swagge', error);
    }
    return app;
}
