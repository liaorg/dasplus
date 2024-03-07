import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { AdapterRequest, AdapterResponse } from '../adapters';

// 响应映射，规范响应输出

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    // private readonly logger = new Logger(TransformInterceptor.name);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // 获取请求体
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<AdapterResponse>();
        const request = ctx.getRequest<AdapterRequest>();
        return next.handle().pipe(
            map((data) => {
                const url = request.originalUrl ?? request.url;
                const date = new Date().toLocaleString();
                const responseData = {
                    statusCode: data?.statusCode ?? response.statusCode,
                    errorCode: 0,
                    method: request.method,
                    path: url,
                    date,
                    message: 'success',
                    data: undefined,
                };
                if (data?.errorCode) {
                    // 失败
                    responseData.errorCode = data.errorCode;
                    responseData.message = data.errorMessage;
                } else if (data && typeof data !== 'boolean') {
                    // 成功
                    responseData.data = data;
                } else if (data && typeof data === 'boolean') {
                    responseData.data = undefined;
                }
                if ([201, 202, 203].includes(responseData.statusCode)) {
                    responseData.statusCode = 200;
                }
                response.status(responseData.statusCode);
                return responseData;
            }),
        );
    }
}
