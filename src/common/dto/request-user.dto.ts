import { ObjectIdType } from '../interfaces';

/**
 * 角色组, 出厂固定为:
 * @value 1 systemAdmin 系统管理员
 * @value 2 securityAdmin 系统安全员
 * @value 3 auditAdmin 系统审计员
 */
enum RoleGroupTypeEnum {
    // 系统管理员
    systemAdmin = 1,
    // 系统安全员
    securityAdmin = 2,
    // 系统审计员
    auditAdmin = 3,
}

/**
 * 由JWT策略解析荷载后存入Rquest.user的对象
 *
 * @export
 * @class RequestUserDto
 */
export class RequestUserDto {
    /**
     * 登录用户id
     */
    _id: ObjectIdType;
    /**
     * 登录名
     */
    name: string;
    /**
     * 角色id
     */
    roleId?: ObjectIdType;
    /**
     * 角色组id
     */
    roleGroupId?: ObjectIdType;
    /**
     * 角色组类型
     */
    roleGroupType?: RoleGroupTypeEnum;
    /**
     * 是否默认角色用户
     */
    isDefault?: boolean;
    /**
     * 是否默认角色
     */
    isDefaultRole?: boolean;
    /**
     * 权限值
     */
    permissionIds?: ObjectIdType[];
    /**
     * 业务系统，json 字符串{id:[],name:[]}，id:[-1] 时为全部
     * 业务系统，json.id
     */
    business?: number[];
    /**
     * 业务系统，json 字符串{id:[],name:[]}，id:[-1] 时为全部
     * 业务系统，json.name
     */
    businessName?: string[];
}
