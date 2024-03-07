import { RequestValidationSchema } from '@/common/decorators';
import { loginValidationSchema } from '../schemas/login-validation.schema';

// 注入验证 schema 对象
@RequestValidationSchema(loginValidationSchema)
export class LoginDto {
    /**
     * 用户名
     * @example xciovpmn
     */
    username: string;
    /**
     * 密码
     * @example 55e12e91650d2fec56ec74e1d3e4ddbfce2ef3a65890c2a19ecf88a307e76a23
     */
    password: string;
    /**
     * 时间戳
     * @example 1709777381
     */
    nonce?: number;
    /**
     * 加密数据
     * @example
     */
    encryptData?: string;
}
