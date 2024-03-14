import { AdapterRequest, adapterName } from '@/common/adapters';
import { ClientRequest, ServerResponse } from 'node:http';
import { OpenApiResponseDto } from './dto';

/**
 * node http 原始发送服务
 * @param req
 * @param res
 * @param sendData
 */
export function nodeHttpSend(
    req: ClientRequest,
    res: ServerResponse,
    sendData: { statusCode: number; errorCode: number; message: string },
) {
    const { statusCode, errorCode, message } = sendData;
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    const date = new Date().toLocaleString();
    const data: OpenApiResponseDto = {
        statusCode,
        errorCode,
        method: req.method,
        path: (req as any).originalUrl,
        date: date,
        message,
    };
    res.write(JSON.stringify(data));
    res.end();
}

/**
 * 生成 auth token key
 */
export function genAuthTokenKey(val: string | number) {
    return `auth:token:${String(val)}` as const;
}

/**
 * 生成 Cache key
 */
export function genCacheKey(val: string | number) {
    return Symbol(`Cache:${val}`) as unknown as string;
}

/**
 * 根据不同的适配器(express/fastify)，返回请求路由
 * 默认为 express
 * @param request
 * @returns
 */
export function getRoutePath(request: AdapterRequest) {
    const path =
        adapterName === 'FastifyApplication' ? request?.routeOptions?.url : request?.route?.path;
    return path || '';
}
