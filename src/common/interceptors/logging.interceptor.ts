import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AdapterRequest, AdapterResponse } from '../adapters';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private logger = new Logger(LoggingInterceptor.name, { timestamp: false });

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const call$ = next.handle();
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<AdapterRequest>();
        const response = ctx.getResponse<AdapterResponse>();
        const isSse = request.headers.accept === 'text/event-stream';
        // 组装日志信息
        const url = request.originalUrl ?? request.url;
        let requestContent = `${request.ip} >>> ${request.method} ${url}`;
        requestContent += Object.keys(request.params ?? {}).length
            ? `\t Parmas: ${JSON.stringify(request.params)}`
            : '';
        requestContent += Object.keys(request.body ?? {}).length
            ? `\t Body: ${JSON.stringify(request.body)}`
            : '';
        requestContent += request['user'] ? `\t LoginUser: ${JSON.stringify(request['user'])}` : '';
        this.logger.debug(`+++ Request: ${requestContent}`);
        const now = Date.now();
        return call$.pipe(
            tap((data) => {
                if (isSse) return;

                const dataContent = JSON.stringify(data);
                const logFormat = `${response.statusCode} ${dataContent?.slice(0, 500)} ......`;
                this.logger.debug(`--- Response: ${logFormat} ${` +${Date.now() - now}ms`}`);
            }),
        );
    }
}
