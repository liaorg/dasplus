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

import { appConfig, isDev } from '@/config';
import { Logger } from '@nestjs/common';
import { ClientRequest, ServerResponse } from 'node:http';
import { AdapterRequest, AdapterResponse } from '../adapters';
import { ApiError } from '../constants';
import { nodeHttpSend } from '../helps';
import { sm2Decrypt } from '../utils';

// 函数式中间件
// 没有成员，没有额外的方法，没有依赖关系
export async function decryptDataMiddleware(
    req: AdapterRequest,
    res: AdapterResponse,
    next: () => void,
) {
    // 解密参数
    try {
        const param = await sm2Decrypt((req?.body as any)?.encryptData, appConfig().sm2.privateKey);
        req.body = JSON.parse(param);
        next();
    } catch (e: any) {
        const logger = new Logger('DecryptDataMiddleware');
        logger.error(e, isDev ? e?.stack : undefined);
        const sendData = {
            statusCode: 500,
            errorCode: ApiError.encryptError.errorCode,
            message: ApiError.encryptError.langKeyword,
        };
        nodeHttpSend(req as unknown as ClientRequest, res as unknown as ServerResponse, sendData);
    }
}
