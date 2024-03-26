import { AdapterRequest } from '@/common/adapters';
import { RequestUserDto } from '@/common/dto';
import { genAuthTokenKey, genCacheKey } from '@/common/helps';
import { ObjectIdType } from '@/common/interfaces';
import { isEmpty } from '@/common/utils';
import { UserService } from '@/modules/admin/user/user.service';
import type { WrapperType } from '@/types';
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
        @Inject(forwardRef(() => UserService)) private readonly userService: WrapperType<UserService>,
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
        const token = await this.setTokenByLoginUser(loginUser, ip);
        // 设置用户权限缓存
        await this.setPermissionsByLoginUser(loginUser);
        return token;
    }

    /**
     * 设置用户 token 缓存
     * @param uid
     * @returns
     */
    async setTokenByLoginUser(loginUser: RequestUserDto, ip: string) {
        // 生成 token 包含 access_token 和 refresh_token
        const token = await this.tokenService.generateAccessToken(loginUser, ip);
        // 缓存 token
        await this.cacheManager.set(genAuthTokenKey(loginUser._id), token.accessToken.value, 0);
        return token.accessToken.value;
    }

    /**
     * 获取缓存中的用户 token
     * @param uid
     * @returns
     */
    async getTokenByLoginUser(loginUser: RequestUserDto, ip: string): Promise<string> {
        let token = (await this.cacheManager.get<string>(genAuthTokenKey(loginUser._id))) || '';
        if (isEmpty(token)) {
            // 生成 token 包含 access_token 和 refresh_token
            token = await this.setTokenByLoginUser(loginUser, ip);
        }
        return token;
    }

    /**
     * 设置用户权限缓存
     * @param uid
     * @returns
     */
    async setPermissionsByLoginUser(loginUser: RequestUserDto) {
        // 获取并设置用户角色权限缓存权限
        const permissions = await this.userService.getPermissions(loginUser.roleId);
        await this.cacheManager.set(genCacheKey(loginUser._id, 'permission'), permissions, 0);
        return permissions;
    }

    /**
     * 获取缓存中的用户权限
     * @param uid
     * @returns
     */
    async getPermissionsByLoginUser(loginUser: RequestUserDto): Promise<ObjectIdType[]> {
        let permissions = await this.cacheManager.get<ObjectIdType[]>(
            genCacheKey(loginUser._id, 'permission'),
        );
        if (isEmpty(permissions)) {
            permissions = await this.setPermissionsByLoginUser(loginUser);
        }
        return permissions;
    }
}
