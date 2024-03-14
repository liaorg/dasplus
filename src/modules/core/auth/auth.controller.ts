import { OpenApiHeaderConfigure } from '@/common/constants';
import { ApiResult } from '@/common/decorators';
import { RequestUserDto } from '@/common/dto';
import { OperateLogEnum } from '@/common/enum';
import { success } from '@/common/utils';
import { Controller, Ip, Post, UseGuards } from '@nestjs/common';
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
    private logMoudle = 'user.module';
    private logType = OperateLogEnum.systemAdmin;
    constructor(private readonly service: AuthService) {}

    /**
     * 登录
     * @param user
     * @returns string
     */
    @ApiOperation({ summary: '登录' })
    @ApiBody({ type: LoginDto })
    @ApiResult({ type: RequestUserDto })
    @Post('login')
    async login(
        @RequestUserDecorator() loginUser: RequestUserDto,
        @Ip() ip: string,
        // @Headers() headers: any,
    ): Promise<any> {
        // const ua = headers['user-agent'];
        // 验证登录
        const token = await this.service.login(loginUser, ip);
        const data = { token, ...loginUser };
        // 日志
        const log = {
            module: this.logMoudle,
            type: OperateLogEnum.login,
            content: 'user.login',
            lanArgs: { name: data.name },
        };
        // 创建带操作日志信息的返回数据
        return success(data, log);
    }
}
