/*
https://docs.nestjs.com/guards#guards
*/
import { isEmpty } from '@/common/utils';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { AuthException } from '../auth.exception';
import { AuthError, IS_PUBLIC_KEY } from '../constants';
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
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private reflector: Reflector,
        private readonly tokenService: TokenService,
        // private readonly systemConfigureService: SystemConfigureService,
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
        if (isPublic) return true;
        // 从请求头中获取token
        // 如果请求头不含有authorization字段则认证失败
        const request = context.switchToHttp().getRequest();
        const requestToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        if (!requestToken) {
            const error = {
                statusCode: 401,
                ...AuthError.errorJwtToken,
            };
            throw new AuthException(error);
        }
        // 判断token是否存在,如果不存在则认证失败
        const accessToken = await this.tokenService.checkAccessToken(requestToken);
        if (isEmpty(accessToken)) {
            const error = {
                statusCode: 401,
                ...AuthError.unauthorized,
            };
            throw new AuthException(error);
        }
        // 获取登录安全配置
        // const loginSafety = await this.systemConfigureService.getLoginSafety();
        const loginSafety = {
            timeOfLogout: 30,
        };
        // 无操作自动注销时间/分钟 => 转换成毫秒
        const logoutTime = loginSafety.timeOfLogout * 60 * 1000;
        // 创建时间 + 超时时间 < 当前时间为过期
        if (accessToken.create_date + logoutTime < Date.now()) {
            const error = {
                statusCode: 401,
                ...AuthError.tokenExpired,
            };
            throw new AuthException(error, { loginSafety, accessToken, date: Date.now() });
        }
        try {
            // 检测token是否为损坏或过期的无效状态,如果无效则尝试刷新token
            return (await super.canActivate(context)) as boolean;
        } catch (e) {
            // 尝试通过refreshToken刷新token
            // 刷新成功则给请求头更换新的token
            // 并给响应头添加新的token和refreshtoken
            const response = context.switchToHttp().getResponse();
            const refreshToken = await this.tokenService.refreshToken(accessToken, response);
            if (!refreshToken) return false;
            if (refreshToken.accessToken) {
                request.headers.authorization = `Bearer ${refreshToken.accessToken.value}`;
            }
            // 刷新失败则再次抛出认证失败的异常
            return super.canActivate(context) as boolean;
        }
    }
}
