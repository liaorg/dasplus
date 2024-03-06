/**
 * https://docs.nestjs.com/middleware
 * 数参数签名中间件 全局
 * 在 main.ts 中使用
 * app.use(paramSignMiddleware)
 */

import { appConfig, isDev } from '@/config';
import { Logger } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { md5 } from 'hash-wasm';
import { ApiError } from '../constants';
import { nodeHttpSend } from '../helps';

// 函数式中间件
// 没有成员，没有额外的方法，没有依赖关系
export async function paramSignMiddleware(
    req: FastifyRequest['raw'],
    res: FastifyReply['raw'],
    next: () => void,
) {
    // 解密参数
    try {
        // 参数签名格式：method|url|tonce|secret_key|MD5(body)
        // body为空要传{}
        // 毫秒级时间戳,一个tonce只可使用一次,且延迟超过300000毫秒视为无效, 暂时取消
        const { method, url } = req;
        const { tonce, sign } = req.headers;
        const bodyHash = await md5(JSON.stringify((req as any).body));
        const signStr = `${method.toLocaleLowerCase()}|${url}|${tonce}|${
            appConfig().apiSecretKey
        }|${bodyHash}`;
        const signHash = await md5(signStr);
        if (sign !== signHash) {
            const sendData = {
                statusCode: 400,
                errorCode: ApiError.signError.errorCode,
                message: ApiError.signError.langKeyword,
            };
            nodeHttpSend(req, res, sendData);
            return;
        }
        next();
    } catch (e) {
        if (isDev) {
            Logger.error('exception::: param-sign.middleware.ts', e);
        }
        const sendData = {
            statusCode: 500,
            errorCode: ApiError.signError.errorCode,
            message: ApiError.signError.langKeyword,
        };
        nodeHttpSend(req, res, sendData);
    }
}
