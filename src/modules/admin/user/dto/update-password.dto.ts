// 请求输入输出规范

import { RequestValidationSchema } from '@/common/decorators';
import { updatePasswordSchema } from '../schemas';

// 注入验证 schema 对象
@RequestValidationSchema(updatePasswordSchema)
export class UpdatePasswordDto {
    /**
     * 密码
     * @example 9f21f49efa575ccaa0d4f41ea23d88f99f21f49efa575ccaa0d4f41ea23d88f9
     */
    oldPassword: string;
    /**
     * 密码
     * @example 55213c3557e6038ef1d9b243250fecd99f21f49efa575ccaa0d4f41ea23d88f9
     */
    password: string;

    /**
     * 确认密码
     * @example 55213c3557e6038ef1d9b243250fecd99f21f49efa575ccaa0d4f41ea23d88f9
     */
    repassword: string;
}
