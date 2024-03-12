/*
https://docs.nestjs.com/guards#guards
*/

import { AdapterRequest } from '@/common/adapters';
import { AuthError } from '@/common/constants';
import { RequestUserDto } from '@/common/dto';
import { UserService } from '@/modules/admin/user/user.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthException } from '../auth.exception';
import { ALLOW_GUEST, IS_CHECK_MENU, IS_PUBLIC_KEY } from '../constants';

/**
 * RBAC 角色菜单权限守卫
 * 验证请求参数
 * @export
 * @class RoleGuard
 */
@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {}
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;
        // 是否要验证获取菜单的权限 /admin/menu
        const isCheckMenu = this.reflector.getAllAndOverride<boolean>(IS_CHECK_MENU, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isCheckMenu === false) return true;
        // 以下主要用于开发阶段，上线后注释
        const isDev = process.env.NODE_ENV === 'development';
        if (isDev) {
            const allowGuest = this.reflector.getAllAndOverride<boolean>(ALLOW_GUEST, [
                context.getHandler(),
                context.getClass(),
            ]);
            if (allowGuest) return true;
        }
        // 检查请求中是否有登录字段
        return await this.validateRole(request);
    }

    // 验证用户角色权限
    async validateRole(request: AdapterRequest): Promise<boolean> {
        // 验证请求用户的角色
        const user = request.user as RequestUserDto;
        if (!user || !user._id) {
            const error = {
                statusCode: 403,
                ...AuthError.forbiddenLogin,
            };
            throw new AuthException(error);
        }
        // 通过 user role 查找菜单权限，对比 request.route.path 路由
        // 要去掉路由前缀
        const appConfig = this.configService.get('appConfig');
        const searchRegExp = new RegExp(
            `${appConfig.adminPrefix}|${appConfig.dataPrefix}|${appConfig.enginePrefix}`,
        );
        const path = (request.route.path as string).replace(searchRegExp, '');
        const method = request.method.toUpperCase();
        const userRoute = await this.userService.matchRoutePermission(user.roleId, path, method);
        if (!userRoute) {
            const error = {
                statusCode: 403,
                ...AuthError.forbiddenRoute,
            };
            throw new AuthException(error);
        }
        return true;
    }
}
