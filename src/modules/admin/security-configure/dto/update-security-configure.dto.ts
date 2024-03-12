import { RequestValidationSchema } from '@/common/decorators';
import {
    updateLoginSafetySchema,
    updatePasswordSafetySchema,
    updateRemoteDebugSchema,
    updateServerPortSchema,
} from '../schemas';
import { LoginSafetyDto, PasswordSafetyDto } from './security-configure.dto';

export class UpdatePortStatusDto {
    /**
     * 端口号
     * @example 22
     */
    value: number;
    /**
     * 启停状态 true/false
     * @example true
     */
    status: boolean;
    allowChange?: boolean;
}

// 端口安全配置 参数验证
@RequestValidationSchema(updateServerPortSchema)
export class UpdateServerPortDto {
    /**
     * 服务名
     * @example SSH
     */
    name: string;
    /**
     * 端口号
     */
    port: UpdatePortStatusDto[];
}

// 登录安全配置 参数验证
@RequestValidationSchema(updateLoginSafetySchema)
export class UpdateLoginSafetyDto extends LoginSafetyDto {}

// 密码安全配置 参数验证
@RequestValidationSchema(updatePasswordSafetySchema)
export class UpdatePasswordSafetyDto extends PasswordSafetyDto {}

// 远程调试 参数验证
@RequestValidationSchema(updateRemoteDebugSchema)
export class UpdateRemoteDebugDto {
    /**
     * 是否允许远程调试
     */
    status: boolean;
}
