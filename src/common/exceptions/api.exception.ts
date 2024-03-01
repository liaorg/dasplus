import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiErrorInterface } from '../interfaces';

// 业务接口异常应该继承该类，并在 api-error-code.const.ts 中定义自己的 error
export class ApiException extends HttpException {
    private readonly errors: ApiErrorInterface | null;
    constructor(objectOrError?: ApiErrorInterface | null, detailMessage?: any) {
        const statusCode = objectOrError?.statusCode ?? HttpStatus.BAD_REQUEST;
        if (detailMessage) {
            objectOrError['detailMessage'] = detailMessage;
        }
        super(objectOrError, statusCode);
        this.errors = objectOrError;
    }

    public getErrors(): ApiErrorInterface | null {
        return this.errors;
    }
}
