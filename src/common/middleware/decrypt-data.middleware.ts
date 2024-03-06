/**
 * https://docs.nestjs.com/middleware
 * 数据解密中间件 局部
 * 在 app.module.ts 中使用
 * configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(encryptDataMiddleware)
      .forRoutes(UserController);
  }
 */

import { appConfig } from '@/config';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiError } from '../constants';
import { nodeHttpSend } from '../helps';
import { sm2Decrypt } from '../utils';

// 函数式中间件
// 没有成员，没有额外的方法，没有依赖关系
export async function decryptDataMiddleware(
    req: FastifyRequest['raw'],
    res: FastifyReply['raw'],
    next: () => void,
) {
    // 解密参数
    try {
        const param = await sm2Decrypt(
            ((req as any)?.body as any).encryptData,
            appConfig().sm2.privateKey,
        );
        (req as any).body = JSON.parse(param);
        next();
    } catch (e) {
        const sendData = {
            statusCode: 400,
            errorCode: ApiError.encryptError.errorCode,
            message: ApiError.encryptError.langKeyword,
        };
        nodeHttpSend(req, res, sendData);
    }
}
