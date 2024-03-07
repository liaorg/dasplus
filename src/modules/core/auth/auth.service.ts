import { AdapterRequest } from '@/common/adapters';
import { genAuthTokenKey } from '@/common/helps';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RequestUserDto } from './dto';
import { TokenService } from './services';

@Injectable()
export class AuthService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private tokenService: TokenService,
    ) {}

    /**
     * 验证登录用户
     * @param request
     * @param username
     * @param password
     * @returns
     */
    async validateLoginUser(request: AdapterRequest, username: string, password: string) {
        console.log('22::: ', 22, username, password);
        // 登录安全验证：验证码 双因子等
        // 锁定客户端
        // 查找用户，角色
        return { _id: '111', roleId: '2222', name: 'test' };
        // const user = await this.userService.findUserByUserName(credential);

        // if (isEmpty(user)) throw new BusinessException(ErrorEnum.USER_NOT_FOUND);

        // const comparePassword = md5(`${password}${user.psalt}`);
        // if (user.password !== comparePassword)
        //     throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD);

        // if (user) {
        //     const { password, ...result } = user;
        //     return result;
        // }

        // return null;
    }

    /**
     * 验证 JWT 用户
     * @param request
     * @param username
     * @param password
     * @returns
     */
    async validateJwtUser(payload: any) {
        // 查找用户，角色
        // 获取登录安全配置
        // const loginSafety = await this.systemConfigureService.getLoginSafety();
        // const loginSafety = {
        //     timeOfLogout: 30,
        // };
        // // 无操作自动注销时间/分钟 => 转换成毫秒
        // const logoutTime = loginSafety.timeOfLogout * 60 * 1000;
        // // 创建时间 + 超时时间 < 当前时间为过期
        // if (accessToken.create_date + logoutTime < Date.now()) {
        //     const error = {
        //         statusCode: 401,
        //         ...AuthError.tokenExpired,
        //     };
        //     throw new AuthException(error, { loginSafety, accessToken, date: Date.now() });
        // }
        return { _id: '111', roleId: '2222', name: 'test' };
        // const user = await this.userService.findUserByUserName(credential);

        // if (isEmpty(user)) throw new BusinessException(ErrorEnum.USER_NOT_FOUND);

        // const comparePassword = md5(`${password}${user.psalt}`);
        // if (user.password !== comparePassword)
        //     throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD);

        // if (user) {
        //     const { password, ...result } = user;
        //     return result;
        // }

        // return null;
    }

    /**
     * 获取登录 JWT
     * 返回 null 则账号密码有误，不存在该用户
     */
    async login(loginUser: RequestUserDto, ip: string, ua?: string) {
        // 设置菜单权限 缓存 菜单权限
        // 写日志

        // 生成 token 包含 access_token 和 refresh_token
        const token = await this.tokenService.generateAccessToken(loginUser, ip);
        // 缓存 token
        await this.cacheManager.set(genAuthTokenKey(loginUser._id), token.accessToken.value);
        console.log('77777::: ', await this.getTokenByUid(loginUser._id));

        // await this.redis.set(genAuthTokenKey(user.id), token.accessToken);

        // // 设置密码版本号 当密码修改时，版本号+1
        // await this.redis.set(genAuthPVKey(user.id), 1);

        // // 设置菜单权限
        // const permissions = await this.menuService.getPermissions(user.id);
        // await this.setPermissionsCache(user.id, permissions);

        // await this.loginLogService.create(user.id, ip, ua);

        return token.accessToken.value;
    }

    /**
     * 获取缓存中的用户 token
     * @param uid
     * @returns
     */
    async getTokenByUid(uid: string): Promise<string> {
        return this.cacheManager.get(genAuthTokenKey(uid));
    }
}
