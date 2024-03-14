import { RequestValidationSchema } from '@/common/decorators';
import { updateProfileSchema } from '../schemas';
import { UserBusinessInterface } from '@/common/interfaces/user-business.interface';

@RequestValidationSchema(updateProfileSchema)
export class UpdateProfileDto {
    /**
     * 用户名
     * @example xciovpmn
     */
    name?: string;

    /**
     * 旧密码
     * @example ''
     */
    oldPassword?: string;

    /**
     * 新密码
     * @example ''
     */
    password?: string;

    /**
     * 确认密码
     * @example ''
     */
    repassword?: string;

    /**
     * 描述
     * @example test
     */
    description?: string;

    /**
     * 电子邮件
     * @example test@test.com
     */
    email?: string;
    /**
     * 真实姓名
     * @example 侯桂英
     */
    fullName?: string;
    /**
     * 性别
     * 性别：0-未知|1-男|2-女
     * @example 男
     */
    gender?: number;
    /**
     * 地址
     * @example 地址
     */
    address?: string;
    /**
     * 部门
     * @example 研发
     */
    department?: string;
    /**
     * 职务
     * @example 项目经理
     */
    duty?: string;
    /**
     * 身份证号
     * @example 350100271890123
     */
    idNumber?: string;
    /**
     * 手机号
     * @example 18627467753
     */
    phoneNumber?: string;
    /**
     * QQ
     * @example 1234567
     */
    qq?: number;
    /**
     * 业务系统信息，{id:[],name:[]}，id:[-1] 时为全部
     */
    business?: UserBusinessInterface;
}
