/**
 * openi api swagger 中间件
 * pnpm add @nestjs/swagger
 * 在控制器中加入 @ApiBearerAuth()
 */
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { AdapterApplication } from './common/adapters';
import { API_SECURITY_AUTH } from './common/decorators';
import { OpenApiResponseDto } from './common/dto';

// 函数式中间件
// 没有成员，没有额外的方法，没有依赖关系
export async function setupSwagger(app: AdapterApplication): Promise<AdapterApplication> {
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
            extraModels: [OpenApiResponseDto],
            deepScanRoutes: true,
        };

        /**
         * 判断是否存在metadata模块,存在的话则加载
         */
        // let metadata: () => Promise<Record<string, any>>;
        // if (existsSync(join(__dirname, 'metadata.js'))) {
        //     metadata = require(join(__dirname, 'metadata.js')).default;
        // }
        // if (existsSync(join(__dirname, 'metadata.ts'))) {
        //     metadata = require(join(__dirname, 'metadata.ts')).default;
        // }
        // if (metadata) await SwaggerModule.loadPluginMetadata(metadata);

        const document = SwaggerModule.createDocument(app, documentBuilder.build(), options);
        const prefix = 'api-docs';
        SwaggerModule.setup(prefix, app, document, {
            swaggerOptions: {
                // 保持登录
                persistAuthorization: true,
            },
        });
        const { HOST, PORT } = process.env;
        Logger.log(
            `OpenAPI: http://${HOST || '127.0.0.1'}:${parseInt(PORT) || 6100}/api-docs`,
            'SwaggerModule',
        );
    } catch (error: any) {
        Logger.error(error, error?.stack, 'SwaggerModule');
    }
    return app;
}
