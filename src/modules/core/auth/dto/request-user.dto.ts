import { RoleGroupTypeEnum } from '../../role-group/enums';

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
    _id: string;
    /**
     * 登录名
     */
    name?: string;
    /**
     * 角色id
     */
    roleId?: string;
    /**
     * 角色组id
     */
    roleGroupId?: string;
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
    permissionIds?: string[];
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
