import { RequestValidationSchema } from '@/common/decorators';
import { updateUserSchema } from '../schemas';
import { UserBusinessInterface } from '@/common/interfaces/user-business.interface';
import { ObjectIdType } from '@/common/services';

@RequestValidationSchema(updateUserSchema)
export class UpdateUserDto {
    /**
     * 用户名
     * @example xciovpmn
     */
    name?: string;

    /**
     * 旧密码
     * @example 9f21f49efa575ccaa0d4f41ea23d88f99f21f49efa575ccaa0d4f41ea23d88f9
     */
    oldPassword?: string;

    /**
     * 新密码
     * @example 55213c3557e6038ef1d9b243250fecd99f21f49efa575ccaa0d4f41ea23d88f9
     */
    password?: string;

    /**
     * 新密码修改时间UTC毫秒
     * @example
     */
    password_update_date?: number;

    /**
     * 确认密码
     * @example 55213c3557e6038ef1d9b243250fecd99f21f49efa575ccaa0d4f41ea23d88f9
     */
    repassword?: string;

    /**
     * 用户角色
     * @example 1
     */
    roleId?: ObjectIdType;

    /**
     * 用户状态：0-停用|1-启用
     * @example 1
     */
    status?: number;

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
     * 性别：0-未知|1-男|2-女
     * @example 1
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
