import { appConfig } from '@/config';
import {
    BadRequestException,
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiError } from '../constants';
import { sm2Decrypt } from '../utils';

/**
 * 自定义拦截器，解密密码字段 password
 * dto结构 由装饰器设置 @DecryptPasswordInterceptor()
 * 使用：
 * 在类或方法使用装饰器
 * @DecryptPasswordInterceptor()
 * @UseInterceptors(DecryptPasswordInterceptor)
 */

@Injectable()
export class DecryptPasswordInterceptor implements NestInterceptor {
    constructor(protected readonly reflector: Reflector) {}
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.getArgByIndex(0);
        // 解密参数
        const { password, oldpassword, repassword, orclePassword, content } = request?.body;
        if (this.has(password)) {
            request.body.password = await this.decrypt(password);
        }
        if (this.has(oldpassword)) {
            request.body.oldpassword = await this.decrypt(oldpassword);
        }
        if (this.has(repassword)) {
            request.body.repassword = await this.decrypt(repassword);
        }
        if (this.has(orclePassword)) {
            request.body.orclePassword = await this.decrypt(orclePassword);
        }
        if (this.has(content?.pass)) {
            request.body.content.pass = await this.decrypt(content.pass);
        }
        return next.handle().pipe(
            map((data) => {
                return data;
            }),
        );
    }

    // 判断是否有值
    private has(value: any) {
        return typeof value === 'string' && value;
    }

    // 解密
    private async decrypt(password: string) {
        try {
            const param = await sm2Decrypt(password, appConfig().sm2.privateKey);
            return JSON.parse(param);
        } catch (e) {
            const error = {
                ...ApiError.encryptError,
            };
            throw new BadRequestException(error, e);
        }
    }
}
