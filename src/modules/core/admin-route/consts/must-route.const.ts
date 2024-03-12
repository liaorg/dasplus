import { RoleGroupTypeEnum } from '../../role-group/enums';

/**
 * 所有角色都必须有的权限
 */
export const MustRouteConst = [
    {
        // 获取登录用户菜单
        path: '/menu',
        locale: 'route.menu',
        menuPath: '/',
        method: 'GET',
        roleGroup: '*',
    },
];

/**
 * 系统管理员角色都必须有的权限
 */
export const SystemAdminMustRouteConst = [
    {
        // 下载数据归档文件
        path: '/download/archive',
        locale: 'route.download',
        menuPath: '/',
        method: 'POST',
        roleGroup: [RoleGroupTypeEnum.systemAdmin],
    },
];
