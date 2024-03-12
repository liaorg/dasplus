import { OpenApiHeaderConfigure } from '@/common/constants';
import { ApiResult } from '@/common/decorators';
import { RequestUserDto } from '@/common/dto';
import { Controller, Headers, Ip, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PublicDecorator, RequestUserDecorator } from './decorators';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards';

@ApiTags('Auth')
@ApiHeader(OpenApiHeaderConfigure)
@UseGuards(LocalAuthGuard)
@PublicDecorator()
// @Controller('admin/user')
@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) {}

    /**
     * 登录
     * @param user
     * @returns string
     */
    @ApiOperation({ summary: '登录' })
    @ApiBody({ type: LoginDto })
    @ApiResult({ type: Object })
    @Post('login')
    async login(
        @RequestUserDecorator() loginUser: RequestUserDto,
        @Headers() headers: any,
        @Ip() ip: string,
    ) {
        // 登录
        const ua = headers['user-agent'];
        const token = await this.service.login(loginUser, ip, ua);
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
