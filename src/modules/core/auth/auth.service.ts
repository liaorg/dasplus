import { Injectable } from '@nestjs/common';
import { TokenService } from './services';

@Injectable()
export class AuthService {
    constructor(private tokenService: TokenService) {}
    /**
     * 获取登录 JWT
     * 返回 null 则账号密码有误，不存在该用户
     */
    async login(username: string, password: string, ip: string, ua: string) {
        // 查找用户
        // 比较密码
        // 获取角色信息
        // 生成 token 缓存 token
        // 设置菜单权限 缓存 菜单权限
        // 写日志

        // 包含access_token和refresh_token
        const token = await this.tokenService.generateAccessToken(1, 1, ip);

        // await this.redis.set(genAuthTokenKey(user.id), token.accessToken);

        // // 设置密码版本号 当密码修改时，版本号+1
        // await this.redis.set(genAuthPVKey(user.id), 1);

        // // 设置菜单权限
        // const permissions = await this.menuService.getPermissions(user.id);
        // await this.setPermissionsCache(user.id, permissions);

        // await this.loginLogService.create(user.id, ip, ua);

        return token.accessToken;
    }
}
