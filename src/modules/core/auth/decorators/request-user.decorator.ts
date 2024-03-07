import { AdapterRequest } from '@/common/adapters';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthException } from '../auth.exception';
import { AuthError } from '../constants';

/**
 * 当前用户装饰器
 * 通过request查询通过jwt解析出来的当前登录的用户模型实例
 * 并用于控制器直接注入
 */
export const RequestUserDecorator = createParamDecorator(async (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AdapterRequest>();
    const { user } = request;
    if (!user) {
        const error = {
            statusCode: 403,
            ...AuthError.forbidden,
        };
        throw new AuthException(error);
    }
    return key ? user && user[key] : user;
});
