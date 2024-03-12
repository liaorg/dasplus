// 请求输入输出规范

import { RequestValidationSchema } from '@/common/decorators';
import { UserBusinessInterface } from '@/common/interfaces/user-business.interface';
import { ObjectIdType } from '@/common/services';
import { createUserSchema } from '../schemas';

// 注入验证 schema 对象
@RequestValidationSchema(createUserSchema)
export class CreateUserDto {
    /**
     * 用户名
     * @example xciovpmn
     */
    name: string;

    /**
     * 密码
     * @example 9f21f49efa575ccaa0d4f41ea23d88f99f21f49efa575ccaa0d4f41ea23d88f9
     */
    password: string;

    /**
     * 确认密码
     * @example 9f21f49efa575ccaa0d4f41ea23d88f99f21f49efa575ccaa0d4f41ea23d88f9
     */
    repassword: string;

    /**
     * 用户角色
     * @example 1
     */
    roleId: ObjectIdType;

    /**
     * 用户状态：0-停用|1-启用
     * @example 1
     */
    status: number;

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
     * @example
     */
    idNumber?: string;
    /**
     * 手机号
     * @example
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
