/**
 * import { PaginationListDto } from "@/common/dto";
 */
import { PaginationListDto } from '@/common/dto';
import { ObjectIdType } from '@/common/services';
import { BusinessInterface } from '../schemas';
/**
 * 用户信息
 */
export class UserProfileDto {
    /**
     * 用户Id
     */
    _id: ObjectIdType;
    /**
     * 用户名称
     */
    name: string;
    /**
     * 角色Id
     */
    role?: ObjectIdType;
    /**
     * 角色组Id
     */
    roleGroup?: ObjectIdType;
    /**
     * 描述
     */
    description?: string;
    /**
     * email
     */
    email?: string;
    /**
     * 真实姓名
     */
    fullName?: string;
    /**
     * 性别：0-未知|1-男|2-女
     */
    gender?: number;
    /**
     * 地址
     * @example 地址
     */
    address?: string;
    /**
     * 部门
     */
    department?: string;
    /**
     * 职务
     */
    duty?: string;
    /**
     * 身份证号
     */
    idNumber?: string;
    /**
     * 手机号
     */
    phoneNumber?: string;
    /**
     * QQ
     */
    qq?: number;
    /**
     * 业务系统信息，{id:[],name:[]}，id:[-1] 时为全部
     * id为业务系统编号id
     */
    business?: BusinessInterface;
    /**
     * 是否默认管理员：0-否|1-是
     */
    isDefault?: boolean;
    /**
     * 用户状态，0-停用|1-启用|2-锁定
     */
    status?: number;
    /**
     * 是否锁定
     */
    disabled?: boolean;
}
//用户包含角色信息-用户管理
export class UserDto extends UserProfileDto {
    roleLocale?: string;
}
/**
 * 用户列表
 */
export class UserListDto extends PaginationListDto {
    declare list: UserDto[];
}
