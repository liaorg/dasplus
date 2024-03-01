import { FastifyReply, FastifyRequest } from 'fastify';
import { OpenApiResponseDto } from '../dto';

export function fastifySend(
    req: FastifyRequest['raw'],
    res: FastifyReply['raw'],
    sendData: { statusCode: number; errorCode: number; message: string },
) {
    const { statusCode, errorCode, message } = sendData;
    res.writeHead(400, { 'Content-Type': 'application/json' });
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
