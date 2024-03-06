import { FastifyReply, FastifyRequest } from 'fastify';
import { OpenApiResponseDto } from './dto';

/**
 * node http 原始发送服务
 * @param req
 * @param res
 * @param sendData
 */
export function nodeHttpSend(
    req: FastifyRequest['raw'],
    res: FastifyReply['raw'],
    sendData: { statusCode: number; errorCode: number; message: string },
) {
    const { statusCode, errorCode, message } = sendData;
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    const date = new Date().toLocaleString();
    const data: OpenApiResponseDto = {
        statusCode,
        errorCode,
        method: req.method,
        path: req.url,
        date: date,
        message,
    };
    res.write(JSON.stringify(data));
    res.end();
}
