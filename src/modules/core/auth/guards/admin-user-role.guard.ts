/*
https://docs.nestjs.com/guards#guards
*/
import { AuthError } from '@/common/constants';
import { RequestUserDto } from '@/common/dto';
import { getRoutePath } from '@/common/helps';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthException } from '../auth.exception';
import { AdminUserRoleRouteConst, ExcludeAdminUserRoute } from '../constants';

/**
 * 系统管理员组角色下的用户
 * 只有默认管理员才有用户管理和角色管理的权限
 * @export
 * @class AdminUserGuard
 */
@Injectable()
export class AdminUserRoleGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) {}
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        // 检查
        return await this.validateRole(request);
    }

    // 验证用户权限
    async validateRole(request: any): Promise<boolean> {
        // 验证用户是否为默认管理员
        const adminPrefix = this.configService.get('appConfig.adminPrefix');
        const path = getRoutePath(request).replace(adminPrefix, '');
        const method = request.method.toUpperCase();
        // 要排除的路由
        const excludeRoute = ExcludeAdminUserRoute.filter(
            (item) => item.method === method && path === item.path,
        );
        if (excludeRoute.length) {
            return true;
        }
        const user = request.user as RequestUserDto;
        // 是默认管理员
        if (user?.isDefault) {
            return true;
        }
        // 不是默认管理员时
        // 通过 user role 查找菜单权限，对比路由
        // 要去掉路由前缀
        const route = AdminUserRoleRouteConst.filter(
            (item) => item.method === method && path === item.path,
        );
        if (route.length) {
            const error = {
                statusCode: 403,
                ...AuthError.forbiddenUserRoleRoute,
            };
            throw new AuthException(error);
        }
        return true;
    }
}
