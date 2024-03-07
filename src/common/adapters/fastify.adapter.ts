/**
 * 框架环境适配器 Fastify
 * @exports adapterName
 * @exports AdapterApplication
 * @exports AdapterRequest
 * @exports AdapterResponse
 * @exports adapter
 * @exports adapterOptions
 * @exports adapterMiddleware
 */

// import FastifyMultipart from '@fastify/multipart'
import { isDev } from '@/config';
import fastifyHelmet from '@fastify/helmet';
import rateLimit, { errorResponseBuilderContext } from '@fastify/rate-limit';
import { HttpException } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyReply, FastifyRequest } from 'fastify';
import { contentParser } from 'fastify-multer';

export const adapterName = 'FastifyApplication';
export {
    NestFastifyApplication as AdapterApplication,
    FastifyRequest as AdapterRequest,
    FastifyReply as AdapterResponse,
};

export const adapter: FastifyAdapter = new FastifyAdapter({
    trustProxy: true,
    logger: false,
    // forceCloseConnections: true,
});

// adapter.register(FastifyMultipart, {
//     limits: {
//         fields: 10, // Max number of non-file fields
//         fileSize: 1024 * 1024 * 6, // limit size 6M
//         files: 5, // Max number of file fields
//     },
// });

adapter.getInstance().addHook('onRequest', (request, reply, done) => {
    // set undefined origin
    const { origin } = request.headers;
    if (!origin) request.headers.origin = request.headers.host;
    const { url } = request;
    // skip favicon request
    if (url.match(/favicon.ico$/) || url.match(/manifest.json$/)) return reply.code(204).send();

    done();
});

// 函数式中间件
// 没有成员，没有额外的方法，没有依赖关系
export async function adapterMiddleware(app: NestFastifyApplication): Promise<NestFastifyApplication> {
    // Helmet 可以通过适当设置 HTTP 标头来帮助保护你的应用免受一些众所周知的 Web 漏洞的侵害
    await app.register(fastifyHelmet, {
        contentSecurityPolicy: false,
    });

    // 允许跨域的 HTTP 请求
    // 还要在请求时配置 axios => widthCredentials: true // 允许携带cookie
    app.enableCors({
        origin: '*',
        // 允许 Access-Control-Allow-Credentials 头
        credentials: true,
        // 允许方法
        // patch 部分更新 put 为完整更新
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });
    // Starts listening for shutdown hooks
    !isDev && app.enableShutdownHooks();

    // 限速 pnpm add @fastify/rate-limit
    // https://github.com/fastify/fastify-rate-limit
    // 另一个中间件为 https://github.com/nestjs/throttler#readme
    await app.register(rateLimit, {
        // 5 分钟
        timeWindow: 5 * 60 * 1000,
        // 限制 5 分钟内最多只能访问 300 次
        max: 300,
        nameSpace: 'das-ratelimit-',
        // 未达到限制次数时 headers 参数显示
        addHeadersOnExceeding: {
            'x-ratelimit-limit': false,
            'x-ratelimit-remaining': false,
            'x-ratelimit-reset': false,
        },
        // 达到限制次数时 headers 参数显示
        addHeaders: {
            'x-ratelimit-limit': false,
            'x-ratelimit-remaining': false,
            'x-ratelimit-reset': false,
            'retry-after': false,
        },
        // 响应处理
        errorResponseBuilder: (request, context: errorResponseBuilderContext) => {
            throw new HttpException(
                `Rate limit exceeded, retry in ${context.after}`,
                (context as any)?.statusCode || 429,
            );
        },
    });

    // 添加 fastify 上传文件的支持，FastifyAdapter 不支持 multipart/form-data
    app.register(contentParser);

    return app;
}
