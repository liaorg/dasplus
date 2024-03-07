/**
 * 角色组名下拉列表
 */
export class RoleGroupListDto {
    /**
     * 角色组id
     */
    _id: string;
    /**
     * 角色类
     */
    type: number;
    /**
     * 角色组名
     */
    name: string;
    /**
     * 本地化/国际化名称，对应 i18n 文件 roleGroup.json 中的字段
     */
    locale: string;
    /**
     * 创建时间UTC毫秒
     */
    create_date: number;
    /**
     * 修改时间UTC毫秒
     */
    update_date: number;
}
