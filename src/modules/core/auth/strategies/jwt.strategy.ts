// 用户认证 JWT 策略
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { AuthStrategy } from '../constants';
import { TokenPayloadDto } from '../dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthStrategy.JWT) {
    constructor(
        private readonly configService: ConfigService,
        private authService: AuthService,
    ) {
        const { secret } = configService.get('appConfig.jwt');
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    /**
     * 通过荷载解析出用户 ID
     * 通过用户 ID 查询出用户是否存在
     * 这边的返回将写入 AdapterRequest 对象中
     * 其它服务可由 @RequestUserDecorator() loginUser: RequestUserDto 调取
     */
    async validate(payload: TokenPayloadDto) {
        const user = await this.authService.validateJwtUser(payload);
        return user;
        // const loginUser = await this.userService.findUserInfo(payload.sub);
        // // 这边的返回将写入 @RequestUserDecorator() loginUser: RequestUserDto
        // const user = user2requestUser(loginUser);
    }
}
