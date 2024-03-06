import { RequestValidationSchema } from '@/common/decorators';
import { loginValidationSchema } from '../schemas/login-validation.schema';

// 注入验证 schema 对象
@RequestValidationSchema(loginValidationSchema)
export class LoginDto {
    /**
     * 用户名
     * @example xciovpmn
     */
    username?: string;
    /**
     * 密码
     * @example
     */
    password?: string;
    /**
     * 时间戳
     * @example
     */
    nonce?: number;
    /**
     * 加密数据
     * @example
     */
    encryptData?: string;
}
