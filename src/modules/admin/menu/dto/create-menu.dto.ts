export class CreateMenuDto {
    /**
     * 父菜单id
     * @example 1
     */
    parentId?: number;
    /**
     * 菜单路由路径
     */
    menuUrl: string;
    /**
     * 菜单名称，可以做为前端组件名要大写开头
     */
    menuName?: string;
    /**
     * 菜单父路径
     */
    parentPath?: string;
    /**
     * 路由组件名称
     */
    routeName?: string;
    /**
     * 本地化/国际化名称，对应 i18n 文件 menu.json 中的字段
     */
    locale?: string;
    /**
     * 是否需要登录鉴权requiresAuth 0-否|1-是
     */
    requiresAuth?: boolean;
    /**
     * 是否在菜单中隐藏该项hideInMenu 0-否|1-是
     */
    hideInMenu?: boolean;
    /**
     * 是否在菜单中隐藏三级children 0-否|1-是
     */
    hideChildrenInMenu?: boolean;
    /**
     * 是否不显示在tab-bar标签中 0-否|1-是
     */
    noAffix?: boolean;
    /**
     * 图标
     */
    icon?: string;
    /**
     * 排序值
     */
    order?: number;
    /**
     * 状态：0-失效|1-有效|2-不可编辑
     */
    status?: number;
}
