class MenuRouteMetaDto {
    /**
     * 本地化/国际化名称，对应 i18n 文件 menu.json 中的字段
     */
    locale?: string;
    /**
     * 名称
     */
    title?: string;
    /**
     * 是否需要登录鉴权requiresAuth 0-否|1-是
     */
    requiresAuth: boolean;
    /**
     * 图标
     */
    icon?: string;
    /**
     * 排序值
     */
    order: number;
    /**
     * 是否在菜单中隐藏该项hideInMenu 0-否|1-是
     */
    hideInMenu: boolean;
    /**
     * 是否在菜单中隐藏三级children 0-否|1-是
     */
    hideChildrenInMenu?: boolean;
    /**
     * 是否不显示在tab-bar标签中 0-否|1-是
     */
    noAffix?: boolean;
}

export class MenuRouteDto {
    /**
     * 菜单路由路径
     */
    path: string;
    /**
     * 菜单名称，可以做为前端组件名要大写开头
     */
    name?: string;
    /**
     * 菜单路由 Meta 元信息
     */
    meta: MenuRouteMetaDto;
    /**
     * 菜单路由路径-包含父路径
     */
    fullPath?: string;
}
