import { ApiResult } from '@/common/decorators';
import { Body, Controller, Headers, Ip, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PublicDecorator } from './decorators';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards';

@PublicDecorator()
@UseGuards(LocalAuthGuard)
@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) {}

    /**
     * 登录
     * @param user
     * @returns string
     */
    @ApiOperation({ summary: '登录' })
    @ApiResult({ status: 200, type: Object })
    @PublicDecorator()
    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Body() loginUser: LoginDto, @Ip() ip: string, @Headers('user-agent') ua: string) {
        // 登录安全验证：验证码 双因子等
        // 登录
        const token = await this.service.login(loginUser.username, loginUser.password, ip, ua);
        return { token };
        // 生成 token
        // const token = await this.service.createToken(user, ip);
        // // 获取用户信息
        // const userInfo = await this.service.findByUserId(user._id);
        // const data = { token, ...userInfo.toObject() };
        // // 日志
        // const log = {
        //     module: this.logMoudle,
        //     type: OperateLogEnum.login,
        //     content: 'user.login',
        //     lanArgs: { name: user.name },
        // };
        // // 创建带操作日志信息的返回数据
        // return success(data, log);
    }
}
