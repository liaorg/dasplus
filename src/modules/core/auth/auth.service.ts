import { AdapterRequest } from '@/common/adapters';
import { RequestUserDto } from '@/common/dto';
import { genAuthTokenKey } from '@/common/helps';
import { UserService } from '@/modules/admin/user/user.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { TokenPayloadDto } from './dto';
import { TokenService } from './services';

@Injectable()
export class AuthService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private tokenService: TokenService,
        // 有循环依赖时
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    ) {}

    /**
     * 验证登录用户
     * @param request
     * @param username
     * @param password
     * @returns
     */
    async validateLoginUser(request: AdapterRequest, username: string, password: string) {
        // 查找用户，角色
        return await this.userService.validateUser(username, password);
    }

    /**
     * 验证 JWT 用户
     * @param payload
     * @returns
     */
    async validateJwtUser(payload: TokenPayloadDto) {
        // 查找用户，角色
        return await this.userService.findUserInfo(payload.sub);
    }

    /**
     * 获取登录 JWT
     * 返回 null 则账号密码有误，不存在该用户
     */
    async login(loginUser: RequestUserDto, ip: string) {
        // 生成 token 包含 access_token 和 refresh_token
        const token = await this.tokenService.generateAccessToken(loginUser, ip);
        // 缓存 token
        await this.cacheManager.set(genAuthTokenKey(loginUser._id), token.accessToken.value);

        // 设置权限缓存菜单权限
        // const permissions = await this.menuService.getPermissions(user.id);
        // await this.setPermissionsCache(user.id, permissions);

        // 获取用户信息
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
