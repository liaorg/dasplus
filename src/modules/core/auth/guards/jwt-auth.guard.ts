/*
https://docs.nestjs.com/guards#guards
*/
import { AdapterRequest } from '@/common/adapters';
import { AuthError } from '@/common/constants';
import { isEmpty } from '@/common/utils';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { AuthException } from '../auth.exception';
import { AuthStrategy, IS_PUBLIC_KEY } from '../constants';
import { TokenService } from '../services';

/**
 * 用户JWT认证守卫
 * 检测用户是否已登录
 *
 * @export
 * @class JwtAuthGuard
 * @extends {AuthGuard('jwt')}
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthStrategy.JWT) {
    constructor(
        private reflector: Reflector,
        private readonly tokenService: TokenService,
    ) {
        super();
    }

    /**
     * 守卫方法
     *
     * @param {ExecutionContext} context
     * @returns
     * @memberof JwtAuthGuard
     */
    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        // 需要后置判断 这样携带了 token 的用户就能够解析到 request.user
        if (isPublic) return true;

        // 从请求头中获取token
        // 如果请求头不含有authorization字段则认证失败
        const request = context.switchToHttp().getRequest<AdapterRequest>();

        // sse 服务判断
        const isSse = request?.headers?.accept === 'text/event-stream';
        if (isSse && !request?.headers?.authorization?.startsWith('Bearer')) {
            const { token } = request?.query as Record<string, string>;
            if (token) request.headers.authorization = `Bearer ${token}`;
        }

        const requestToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        if (!requestToken) {
            const error = {
                statusCode: 401,
                ...AuthError.errorJwtToken,
            };
            throw new AuthException(error);
        }
        const accessToken = await this.tokenService.checkAccessToken(requestToken);
        // 判断 token 是否存在, 如果不存在则认证失败
        if (isEmpty(accessToken)) {
            const error = {
                statusCode: 401,
                ...AuthError.unauthorized,
            };
            throw new AuthException(error);
        }

        let result: any = false;
        try {
            result = await super.canActivate(context);
        } catch (e) {
            // 需要后置判断 ?? 这样携带了 token 的用户就能够解析到 request.user ??
        }
        const userId = request?.user?._id;
        // SSE 请求
        if (isSse) {
            const { uid } = request?.params as Record<string, any>;
            if (uid !== userId) {
                const error = {
                    statusCode: 401,
                    ...AuthError.unauthorized,
                };
                throw new AuthException(error);
            }
        }
        // 不允许多端登录
        // const cacheToken = await this.authService.getTokenByUid(userId);
        // if (requestToken !== cacheToken) {
        //   // 与缓存保存不一致 即二次登录
        // const error = {
        //     statusCode: 401,
        //     ...AuthError.unauthorized,
        // };
        // throw new AuthException(error);
        // }
        return result;
    }
}
