export class AdminRouteDto {
    id: number;
    /**
     * 接口URL路径
     */
    path: string;
    /**
     * 本地化/国际化名称，对应 i18n 文件 route.json 中的字段
     */
    locale: string;
    /**
     * 操作方法 GET,PUT,PATCH,POST
     */
    method: string;
    /**
     * 所属菜单路径
     */
    menuPath: string;
}
