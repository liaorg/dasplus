import { isDev } from '@/config';
import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { I18nContext, I18nValidationError, I18nValidationException } from 'nestjs-i18n';
import { AdapterRequest, AdapterResponse } from '../adapters';
import { ApiError } from '../constants';
import { OpenApiResponseDto } from '../dto';
import { ApiException } from '../exceptions';

interface myError {
    readonly status: number;
    readonly statusCode?: number;

    readonly message?: string;
}

/**
 * 捕获所有异常
 */
@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AnyExceptionFilter.name);

    constructor() {
        this.registerCatchAnyExceptionHook();
    }

    // 每个异常过滤器必须实现一个 catch 函数
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<AdapterResponse>();
        const request = ctx.getRequest<AdapterRequest>();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : (exception as myError)?.status ||
                  (exception as myError)?.statusCode ||
                  HttpStatus.INTERNAL_SERVER_ERROR;

        // 组装日志信息
        const url = request.originalUrl ?? request.url;
        let requestContent = `Request: ${request.ip} >>> ${request.method} ${url}`;
        requestContent += Object.keys(request.params ?? {}).length
            ? `\t Parmas: ${JSON.stringify(request.params)}`
            : '';
        requestContent += Object.keys(request.body ?? {}).length
            ? `\t Body: ${JSON.stringify(request.body)}`
            : '';
        requestContent += request['user'] ? `\t LoginUser: ${JSON.stringify(request['user'])}` : '';

        let errorCode = ApiError.unknowError.errorCode;
        let message = ApiError.unknowError.langKeyword;

        let logFormat = `${requestContent} \t Response: ${status}`;
        const stackInfo = typeof exception.stack === 'function' ? exception.stack() : exception.stack;
        logFormat += isDev ? ` ${stackInfo}` : '';

        let uploadMessage = '';
        // 自定义返回信息
        let detailMessage: any = exception?.message;
        if (exception instanceof I18nValidationException) {
            // i18n 参数校验异常
            const errors = exception.errors ?? [];
            if (errors.length > 0) {
                // 获取到第一个没有通过验证的错误对象
                const error = errors.shift();
                const i18n = I18nContext.current(host);
                // 翻译参数校验提示信息
                this.translateErrors([error], i18n);
                message = `${error.property}|${Object.values(error.constraints)}`;
                errorCode = ApiError.badParams.errorCode;
            }
            logFormat = `${requestContent} \t Response: ${status}`;
        } else if (exception instanceof ApiException) {
            // 如果是业务异常
            const i18n = I18nContext.current(host);
            const errors = exception.getErrors();
            errorCode = errors?.errorCode ?? ApiError.unknowError.errorCode;
            // 翻译提示信息
            const langKeyword = errors?.langKeyword ?? ApiError.unknowError.langKeyword;
            const args = errors?.args ?? {};
            message = i18n.t(langKeyword, { args });
            logFormat += ` ${errorCode}`;
            uploadMessage = errors?.uploadMessage;
            detailMessage = errors?.detailMessage;
        } else if (exception instanceof BadRequestException) {
            const i18n = I18nContext.current(host);
            const rep: any = exception.getResponse();
            errorCode = rep?.errorCode || ApiError.badParams.errorCode;
            message = rep?.langKeyword || message;
            if (i18n?.service) {
                // 翻译提示信息
                const langKeyword = ApiError.badParams.langKeyword;
                message = i18n.t(langKeyword);
            }
        }

        // 根据状态码，进行日志类型区分
        if (status >= 500 && !(exception instanceof ApiException)) {
            Logger.error(exception, isDev ? stackInfo : undefined, `${AnyExceptionFilter.name} Catch`);
        } else if (status === 404) {
            message = '';
            this.logger.warn(
                `Request: ${request.ip} >>> ${request.method} ${url} \t Response: ${status} ${exception?.message}`,
            );
        } else if (status >= 400) {
            this.logger.warn(logFormat);
        } else {
            this.logger.warn(logFormat);
        }

        const date = new Date().toLocaleString();
        const data: OpenApiResponseDto = {
            statusCode: status,
            errorCode: errorCode,
            method: request.method,
            path: url,
            date: date,
            message: message,
        };
        if (uploadMessage) {
            data.uploadMessage = uploadMessage;
        }
        if (isDev) {
            data.detailMessage = detailMessage;
        } else {
            // 只显示响应配置的具体错误信息
            data.detailMessage = detailMessage?.rep?.err_msg;
        }
        response.status(status).send(data);
    }

    // 翻译参数校验提示信息
    private translateErrors(errors: I18nValidationError[], i18n: I18nContext): I18nValidationError[] {
        return errors.map((error) => {
            error.children = this.translateErrors(error.children ?? [], i18n);
            error.constraints = Object.keys(error.constraints).reduce((result, key) => {
                const [translationKey, argsString] = error.constraints[key].split('|');
                const args = !!argsString ? JSON.parse(argsString) : {};
                result[key] = i18n.t(translationKey, {
                    args: { property: error.property, ...args },
                });
                return result;
            }, {});
            return error;
        });
    }

    private registerCatchAnyExceptionHook() {
        process.on('unhandledRejection', (reason) => {
            console.error('unhandledRejection: ', reason);
        });

        process.on('uncaughtException', (err) => {
            console.error('uncaughtException: ', err);
        });
    }
}
