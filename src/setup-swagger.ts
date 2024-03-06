/**
 * openi api swagger 中间件
 * pnpm add @nestjs/swagger swagger-ui-express
 * 在控制器中加入 @ApiBearerAuth()
 */
import { Logger } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { API_SECURITY_AUTH } from './common/decorators';

// 函数式中间件
// 没有成员，没有额外的方法，没有依赖关系
export function setupSwagger(app: NestFastifyApplication): NestFastifyApplication {
    // 配置 Swagge
    try {
        const documentBuilder = new DocumentBuilder()
            .setTitle('管理后台')
            // .setDescription('管理后台接口')
            .setVersion('v1.0');

        // auth security
        documentBuilder.addSecurity(API_SECURITY_AUTH, {
            description: '输入令牌（Enter the token）',
            type: 'http',
            in: 'header',
            name: 'Authorization',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        });

        const options: SwaggerDocumentOptions = {
            operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
            ignoreGlobalPrefix: false,
            extraModels: [],
        };
        const document = SwaggerModule.createDocument(app, documentBuilder.build(), options);
        const prefix = 'api-docs';
        SwaggerModule.setup(prefix, app, document, {
            swaggerOptions: {
                // 保持登录
                persistAuthorization: true,
            },
        });
    } catch (error) {
        Logger.error('swagge', error);
    }
    return app;
}
