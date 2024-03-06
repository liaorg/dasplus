/*
https://docs.nestjs.com/guards#guards
*/

import { REQUEST_SCHEMA_VALIDATION } from '@/common/constants';
import { ajvValidate } from '@/common/utils';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SchemaObject } from 'ajv';
import { FastifyRequest } from 'fastify';
import { I18nValidationException } from 'nestjs-i18n';
import { AuthStrategy } from '../constants';
import { LoginDto } from '../dto/login.dto';

/**
 * 用户登录守卫
 * 验证请求参数
 * @export
 * @class LocalAuthGuard
 * @extends {AuthGuard('local')}
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard(AuthStrategy.LOCAL) {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        // 检查请求中是否有登录字段
        return this.validateRequest(request, context);
    }

    // 验证请求
    async validateRequest(request: FastifyRequest, context: ExecutionContext): Promise<boolean> {
        const schema: SchemaObject = Reflect.getMetadata(REQUEST_SCHEMA_VALIDATION, LoginDto) || {};
        // 验证请求参数
        const errors = ajvValidate(schema, request.body);
        if (errors.length) {
            // 抛出错误
            throw new I18nValidationException(errors);
        }
        const has = await super.canActivate(context);
        return has as boolean;
    }
}
