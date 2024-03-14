// 只有管理员才有的权限
export const ONLY_SYSTEM_ADMIN_MENU = ['/system/user', '/system/role'];

// 租户不能有的权限
export const TENANT_NOT_MENU = [
    // 运行状态
    '/monitor/running-state',
    // 系统服务
    '/system/service',
    // 系统维护
    '/system/maintain',
    // 网卡配置
    '/system-conf/network',
    // 静态路由
    '/system-conf/static-route',
    // 时间配置
    '/system-conf/time-configure',
];
export const TENANT_NOT_ADMIN_ROUTE = [
    // 端口安全
    '/security-configure/server-port',
    // 远程调试
    '/security-configure/remote-debug',
];
