/*
https://docs.nestjs.com/guards#guards
*/

import { ApiError } from '@/common/constants';
import { WEAK_PASSRORD, WEAK_PASSRORD_SM3 } from '@/config';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthException } from '../auth.exception';

/**
 * 用户密码安全
 * 验证请求参数 是否弱密码
 * @export
 * @class WeakPasswordGuard
 */
@Injectable()
export class WeakPasswordGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        // 检查请求中是否有登录字段
        return this.validateRequest(request);
    }

    // 验证请求
    async validateRequest(request: Request): Promise<boolean> {
        // 用户密码操作
        const userPasswordPath = [
            // 重置密码
            '/user/passwords',
            // 修改密码
            '/user/password/:userId',
            // 修改登录用户信息-头部
            '/user/profile',
            // 添加
            '/user',
            // 修改用户
            '/user/:userId',
        ];
        const appConfig = this.configService.get('appConfig');
        // 要去掉路由前缀
        const searchRegExp = new RegExp(
            `${appConfig.adminPrefix}|${appConfig.dataPrefix}|${appConfig.enginePrefix}`,
        );
        const path = (request.route.path as string).replace(searchRegExp, '');
        const { password } = request?.body;
        let isWeakPassword = false;
        if (password) {
            if (userPasswordPath.includes(path)) {
                // 用户密码操作的密码要比较 sm3 摘要
                isWeakPassword = WEAK_PASSRORD_SM3.includes(password);
            } else {
                isWeakPassword = WEAK_PASSRORD.includes(password);
            }
        }
        if (isWeakPassword) {
            const error = {
                ...ApiError.weakPassword,
            };
            throw new AuthException(error);
        }
        return true;
    }
}
