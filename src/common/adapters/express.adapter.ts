/**
 * 框架环境适配器 express
 * @exports AdapterApplication
 * @exports AdapterRequest
 * @exports AdapterResponse
 * @exports adapter
 * @exports adapterMiddleware
 */

// import { isDev } from '@/config';
// import { HttpException } from '@nestjs/common';
// import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
// import { Request, Response, json, urlencoded } from 'express';
// import rateLimit from 'express-rate-limit';
// import helmet from 'helmet';

// export {
//     NestExpressApplication as AdapterApplication,
//     Request as AdapterRequest,
//     Response as AdapterResponse,
// };

// export const adapter: ExpressAdapter = new ExpressAdapter();

// // see https://expressjs.com/en/guide/behind-proxies.html
// // 如果在服务器和以太网之间存在负载均衡或者反向代理，从而保证最终用户得到正确的IP地址
// // 要使用 NestExpressApplication 平台接口创建实例
// adapter.set('trust proxy', 1);

// Starts listening for shutdown hooks
// // !isDev && app.enableShutdownHooks();

// // 函数式中间件
// // 没有成员，没有额外的方法，没有依赖关系
// export function adapterMiddleware(app: NestExpressApplication): NestExpressApplication {
//     // Helmet 安全 HTTP 头设置
//     // npm i --save helmet
//     // https://github.com/helmetjs/helmet
//     // helmet.contentSecurityPolicy({
//     //     directives: {
//     //         defaultSrc: [`'self'`],
//     //         styleSrc: [`'self'`, `'unsafe-inline'`],
//     //         imgSrc: [`'self'`, "data:", "validator.swagger.io"],
//     //         scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
//     //     },
//     // });
//     app.use(
//         helmet({
//             contentSecurityPolicy: isDev ? false : undefined,
//             crossOriginEmbedderPolicy: isDev ? false : undefined,
//         }),
//     );

//     // 允许跨域的 HTTP 请求
//     // https://github.com/expressjs/cors#configuration-options
//     // 还要在请求时配置 axios => widthCredentials: true // 允许携带cookie
//     app.enableCors({
//         origin: '*',
//         // 允许 Access-Control-Allow-Credentials 头
//         credentials: true,
//         // 允许方法
//         // patch 部分更新 put 为完整更新
//         methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//         preflightContinue: false,
//         optionsSuccessStatus: 204,
//     });

//     // 限速 npm i --save express-rate-limit
//     // https://github.com/nfriedly/express-rate-limit
//     // 另一个中间件为 https://github.com/nestjs/throttler#readme
//     app.use(
//         rateLimit({
//             // 5 分钟
//             windowMs: 5 * 60 * 1000,
//             // 限制 5 分钟内最多只能访问 300 次
//             max: 300,
//             // Return rate limit info in the `RateLimit-*` headers
//             standardHeaders: false,
//             // Disable the `X-RateLimit-*` headers
//             legacyHeaders: isDev ? true : false,
//             // 响应处理
//             handler: (_request, _response, _next, options) => {
//                 throw new HttpException(options.message, options.statusCode);
//             },
//         }),
//     );

//     // 压缩
//     // npm i --save compression
//     // npm i --save-dev @types/compression
//     // https://github.com/expressjs/compression
//     // 当有反向代理时（nginx）不要使用它
//     // app.use(compression());

//     // For parsing application/json
//     app.use(json());
//     // For parsing application/x-www-form-urlencoded
//     app.use(urlencoded({ extended: true }));

//     return app;
// }
