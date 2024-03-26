import { RoleGroupTypeEnum } from '@/modules/core/role-group/enums';

// 页面Route接口
export interface AdminRouteInterface {
    // 路径 path 与 Controller 中的设置对应，每个方法一个路径
    path: string;
    // 本地化/国际化名称，对应 i18n 文件 route.json 中的字段
    locale: string;
    // 可以有哪些操作类型 取值范围 ["GET", "POST", "DELETE", "PATCH", "PUT", "HEAD"];
    method: string;
    // 所属菜单，与菜单路径menuUrl对应 src/init/auth/consts/default-menu.ts
    menuPath: string;
    // 拥有权限的角色组type集合，*表示所有角色都有的操作
    roleGroupType?: '*' | RoleGroupTypeEnum[];
}

// 系统管理 /system
const systemCenter: AdminRouteInterface[] = [
    // 角色管理
    {
        // 获取角色组名称下拉列表
        path: '/role/role-group-list',
        locale: 'route.role.roleGroupList',
        menuPath: '/system/role',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 根据角色组，获取用户名称下拉列表
        path: '/role/user-list/:roleGroupId',
        locale: 'route.role.userList',
        menuPath: '/system/role',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 根据角色组，获取菜单树
        path: '/role/menu-list/:roleGroupId',
        locale: 'route.role.menuList',
        menuPath: '/system/role',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 获取角色菜单权限
        path: '/role/menu-route/:roleId',
        locale: 'route.role.menuPermession',
        menuPath: '/system/role',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 设置默认管理员
        path: '/role/default-adminer',
        locale: 'route.role.setDefaultAdminer',
        menuPath: '/system/role',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 角色表格分页数据
        path: '/role/query',
        locale: 'route.page',
        menuPath: '/system/role',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 添加角色
        path: '/role',
        locale: 'route.add',
        menuPath: '/system/role',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 获取角色信息
        path: '/role/:roleId',
        locale: 'route.role.info',
        menuPath: '/system/role',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 修改角色
        path: '/role/:roleId',
        locale: 'route.modify',
        menuPath: '/system/role',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 删除角色，角色下的用户也会删除
        path: '/role/:roleId',
        locale: 'route.del',
        menuPath: '/system/role',
        method: 'DELETE',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    // 用户管理
    {
        // 登录
        path: '/user/login',
        locale: 'route.user.login',
        menuPath: '/',
        method: 'POST',
        roleGroupType: '*',
    },
    {
        // 退出登录
        path: '/user/logout',
        locale: 'route.user.logout',
        menuPath: '/',
        method: 'GET',
        roleGroupType: '*',
    },
    {
        // 刷新登录 token
        path: '/user/refresh-token',
        locale: 'route.user.refreshToken',
        menuPath: '/',
        method: 'GET',
        roleGroupType: '*',
    },
    {
        // 修改密码
        path: '/user/password/:userId',
        locale: 'route.user.password.modify',
        menuPath: '/',
        method: 'PATCH',
        roleGroupType: '*',
    },
    {
        // 重置密码
        path: '/user/passwords',
        locale: 'route.user.passwords.modify',
        menuPath: '/system/user',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 获取登录用户信息-头部
        path: '/user/profile',
        locale: 'route.user.profile',
        menuPath: '/',
        method: 'GET',
        roleGroupType: '*',
    },
    {
        // 修改登录用户信息-头部
        path: '/user/profile',
        locale: 'route.user.profile.modify',
        menuPath: '/',
        method: 'PATCH',
        roleGroupType: '*',
    },
    {
        // 获取角色名称下拉列表
        path: '/user/role-list',
        locale: 'route.user.roleList',
        menuPath: '/',
        method: 'GET',
        roleGroupType: '*',
    },
    {
        // 用户分页-查询
        path: '/user/query',
        locale: 'route.page',
        menuPath: '/system/user',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 删除/批量删除用户
        path: '/user/deletion',
        locale: 'route.del',
        menuPath: '/system/user',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 添加用户
        path: '/user',
        locale: 'route.add',
        menuPath: '/system/user',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 获取指定用户信息(包含角色)-用户管理
        path: '/user/:userId',
        locale: 'route.user.info',
        menuPath: '/system/user',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 修改用户
        path: '/user/:userId',
        locale: 'route.modify',
        menuPath: '/system/user',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    // 系统服务 & 系统维护
    {
        // 服务操作-启动停止重启
        path: '/maintain',
        locale: 'route.stopstart',
        menuPath: '/system/service',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 服务操作-配置
        path: '/maintain',
        locale: 'route.modify',
        menuPath: '/system/service',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 重启设备
        path: '/maintain/reboot',
        locale: 'route.reboot',
        menuPath: '/system/maintain',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 关闭设备
        path: '/maintain/shutdown',
        locale: 'route.shutdown',
        menuPath: '/system/maintain',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    // 租户管理
    {
        // 租户表格分页数据
        path: '/tenant/query',
        locale: 'route.page',
        menuPath: '/system/tenant',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 添加租户
        path: '/tenant',
        locale: 'route.add',
        menuPath: '/system/tenant',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 获取租户信息
        path: '/tenant/:tenantId',
        locale: 'route.info',
        menuPath: '/system/tenant',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 修改租户
        path: '/tenant/:tenantId',
        locale: 'route.modify',
        menuPath: '/system/tenant',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 删除租户，租户下的用户也会删除
        path: '/tenant/:tenantId',
        locale: 'route.del',
        menuPath: '/system/tenant',
        method: 'DELETE',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
];

// 系统配置 /system-conf
const systemConfCenter: AdminRouteInterface[] = [
    // 时间配置
    {
        // 获取时间配置信息
        path: '/time-configure',
        locale: 'route.systemConfigure.info',
        menuPath: '/system-conf/time-configure',
        method: 'GET',
        roleGroupType: '*',
    },
    {
        // 保存时间配置
        path: '/time-configure',
        locale: 'route.systemConfigure.save',
        menuPath: '/system-conf/time-configure',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 立即更新/手动同步
        path: '/time-configure',
        locale: 'route.systemConfigure.updateTime',
        menuPath: '/system-conf/time-configure',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    // 静态路由
    {
        // 获取网卡名列表
        path: '/static-route/device',
        locale: 'route.staticRoute.device',
        menuPath: '/system-conf/static-route',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 静态路由分页-查询
        path: '/static-route/query',
        locale: 'route.page',
        menuPath: '/system-conf/static-route',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 添加静态路由
        path: '/static-route',
        locale: 'route.add',
        menuPath: '/system-conf/static-route',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 获取指定静态路由信息
        path: '/static-route/:staticRouteId',
        locale: 'route.staticRoute.info',
        menuPath: '/system-conf/static-route',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 修改静态路由
        path: '/static-route/:staticRouteId',
        locale: 'route.modify',
        menuPath: '/system-conf/static-route',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 删除静态路由
        path: '/static-route/:staticRouteId',
        locale: 'route.del',
        menuPath: '/system-conf/static-route',
        method: 'DELETE',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    // 网卡配置
    {
        // 网卡启停
        path: '/network/status',
        locale: 'route.network.status',
        menuPath: '/system-conf/network',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 网卡监听
        path: '/network/listen',
        locale: 'route.network.listen',
        menuPath: '/system-conf/network',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 删除IP
        path: '/network/deletion',
        locale: 'route.network.delete',
        menuPath: '/system-conf/network',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 网卡配置卡片/表格
        path: '/network',
        locale: 'route.page',
        menuPath: '/system-conf/network',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 获取单张网卡信息
        path: '/network/:device',
        locale: 'route.network.info',
        menuPath: '/system-conf/network',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 配置IP
        path: '/network/:device',
        locale: 'route.network.set',
        menuPath: '/system-conf/network',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    // 系统安全配置
    {
        // 保存登录安全配置
        path: '/security-configure/login-safety',
        locale: 'route.security.login',
        menuPath: '/system-conf/security-configure',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 保存密码安全配置
        path: '/security-configure/password-safety',
        locale: 'route.security.password',
        menuPath: '/system-conf/security-configure',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 端口安全配置启停
        path: '/security-configure/server-port',
        locale: 'route.security.port',
        menuPath: '/system-conf/security-configure',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 远程调试启停
        path: '/security-configure/remote-debug',
        locale: 'route.security.remote',
        menuPath: '/system-conf/security-configure',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 获取安全配置信息
        path: '/security-configure',
        locale: 'route.security.info',
        menuPath: '/system-conf/security-configure',
        method: 'GET',
        roleGroupType: '*',
    },
    // 系统安全配置-管理主机
    {
        // 管理主机分页-查询
        path: '/admin-host/query',
        locale: 'route.adminHost.page',
        menuPath: '/system-conf/security-configure',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 删除/批量删除管理主机
        path: '/admin-host/deletion',
        locale: 'route.adminHost.del',
        menuPath: '/system-conf/security-configure',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 启用/停用管理主机
        path: '/admin-host/status',
        locale: 'route.adminHost.status',
        menuPath: '/system-conf/security-configure',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 添加管理主机
        path: '/admin-host',
        locale: 'route.adminHost.add',
        menuPath: '/system-conf/security-configure',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 获取指定管理主机信息
        path: '/admin-host/:adminHostId',
        locale: 'route.adminHost.info',
        menuPath: '/system-conf/security-configure',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 修改管理主机
        path: '/admin-host/:adminHostId',
        locale: 'route.adminHost.modify',
        menuPath: '/system-conf/security-configure',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    // 系统安全配置-锁定客户端
    {
        // 锁定客户端-查询
        path: '/locker/query',
        locale: 'route.locker.page',
        menuPath: '/system-conf/security-configure',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 解锁客户端
        path: '/locker/unlocking',
        locale: 'route.locker.unlocking',
        menuPath: '/system-conf/security-configure',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    // 响应配置
    {
        // (单条/批量)启用/停用响应配置
        path: '/reply-conf/status/:type',
        locale: 'route.modify',
        menuPath: '/system-conf/response-configure',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 删除/批量删除响应配置
        path: '/reply-conf/deletion/:type',
        locale: 'route.del',
        menuPath: '/system-conf/response-configure',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 获取单个响应配置信息
        path: '/reply-conf/info/:oid',
        locale: 'route.info',
        menuPath: '/system-conf/response-configure',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 发送测试
        path: '/reply-conf/test/:type',
        locale: 'route.test',
        menuPath: '/system-conf/response-configure',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 获取响应配置信息
        path: '/reply-conf/:type',
        locale: 'route.info',
        menuPath: '/system-conf/response-configure',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 添加响应配置
        path: '/reply-conf/:type',
        locale: 'route.add',
        menuPath: '/system-conf/response-configure',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 修改响应配置
        path: '/reply-conf/:type/:oid',
        locale: 'route.modify',
        menuPath: '/system-conf/response-configure',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    // 数据归档
    {
        // 归档文件列表
        path: '/archive/list',
        locale: 'route.page',
        menuPath: '/system-conf/archive',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 删除/批量删除文件
        path: '/archive/deletion',
        locale: 'route.del',
        menuPath: '/system-conf/archive',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 外传配置-获取
        path: '/archive/conf',
        locale: 'route.info',
        menuPath: '/system-conf/archive',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 外传配置-修改
        path: '/archive/conf',
        locale: 'route.modify',
        menuPath: '/system-conf/archive',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 加密配置-获取
        path: '/archive/cipher',
        locale: 'route.info',
        menuPath: '/system-conf/archive',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 加密配置-修改
        path: '/archive/cipher',
        locale: 'route.modify',
        menuPath: '/system-conf/archive',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
];

// 日志管理 /log
const logCenter: AdminRouteInterface[] = [
    // 运行日志
    {
        // 导出运行日志-生成文件-选中/全部
        path: '/runtime-log/file',
        locale: 'route.log.createFile',
        menuPath: '/log/runtime-log',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 运行日志分页
        path: '/runtime-log/query',
        locale: 'route.page',
        menuPath: '/log/runtime-log',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 获取运行日志响应配置
        path: '/log/runtime-action',
        locale: 'route.info',
        menuPath: '/log/runtime-log',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 修改运行日志响应配置
        path: '/log/runtime-action',
        locale: 'route.modify',
        menuPath: '/log/runtime-log',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    // 操作日志
    {
        // 导出操作日志-生成文件-选中/全部
        path: '/operate-log/file',
        locale: 'route.log.createFile',
        menuPath: '/log/operate-log',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.auditAdmin, RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 操作日志分页-查询
        path: '/operate-log/query',
        locale: 'route.page',
        menuPath: '/log/operate-log',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.auditAdmin, RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 获取操作日志响应配置
        path: '/log/operate-action',
        locale: 'route.info',
        menuPath: '/log/operate-log',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin, RoleGroupTypeEnum.auditAdmin],
    },
    {
        // 修改操作日志响应配置
        path: '/log/operate-action',
        locale: 'route.modify',
        menuPath: '/log/operate-log',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin, RoleGroupTypeEnum.auditAdmin],
    },
    // 日志保留时间配置
    {
        // 获取日志保留时间配置
        path: '/log/keep-time',
        locale: 'route.info',
        menuPath: '/log/keep-time',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 修改日志保留时间配置
        path: '/log/keep-time',
        locale: 'route.modify',
        menuPath: '/log/keep-time',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
];
// 部署管理 /deploy
const deployCenter: AdminRouteInterface[] = [
    // 数据库发现
    {
        // 获取数据库列表
        path: '/db-discovery/query-db-list',
        locale: 'route.page',
        menuPath: '/deploy/db-discovery',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 获取数据库状态
        path: '/db-discovery/query-scan-status',
        locale: 'route.info',
        menuPath: '/deploy/db-discovery',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 更新扫描状态
        path: '/db-discovery/replace-scan-cmd',
        locale: 'route.modify',
        menuPath: '/deploy/db-discovery',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 查询扫描状态
        path: '/db-discovery/query-scan-cmd',
        locale: 'route.info',
        menuPath: '/deploy/db-discovery',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 查询扫描配置
        path: '/db-discovery/query-discover-cfg',
        locale: 'route.page',
        menuPath: '/deploy/db-discovery',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 添加扫描配置
        path: '/db-discovery/insert-discover-scan-cfg',
        locale: 'route.add',
        menuPath: '/deploy/db-discovery',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 修改扫描配置
        path: '/db-discovery/replace-discover-scan-cfg',
        locale: 'route.modify',
        menuPath: '/deploy/db-discovery',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    // 业务系统配置
    {
        // 获取所有业务系统
        path: '/business/all',
        locale: 'route.list',
        menuPath: '/deploy/business',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin, RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 获取业务系统列表
        path: '/business/list',
        locale: 'route.page',
        menuPath: '/deploy/business',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 删除/批量删除业务系统
        path: '/business/deletion',
        locale: 'route.del',
        menuPath: '/deploy/business',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // (单条/批量)启用/停用业务系统
        path: '/business/status',
        locale: 'route.modify',
        menuPath: '/deploy/business',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 批量添加业务系统
        path: '/business/add-list',
        locale: 'route.add',
        menuPath: '/deploy/business',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 添加业务系统
        path: '/business',
        locale: 'route.add',
        menuPath: '/deploy/business',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 获取单个业务系统信息
        path: '/business/:oid',
        locale: 'route.info',
        menuPath: '/deploy/business',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 修改业务系统
        path: '/business/:oid',
        locale: 'route.modify',
        menuPath: '/deploy/business',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    // 探针管理
    {
        // 探针数据统计
        path: '/probe/count',
        locale: 'route.info',
        menuPath: '/deploy/prob',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 探针名称列表 & 探针IP列表 & 服务器操作系统列表
        path: '/probe/item',
        locale: 'route.list',
        menuPath: '/deploy/prob',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 探针列表一级
        path: '/probe/list',
        locale: 'route.page',
        menuPath: '/deploy/prob',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 24小时流量
        path: '/probe/flux/:id',
        locale: 'route.info',
        menuPath: '/deploy/prob',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 删除/清空探针
        path: '/probe/deletion',
        locale: 'route.del',
        menuPath: '/deploy/prob',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 升级/全部升级探针
        path: '/probe/upgade',
        locale: 'route.modify',
        menuPath: '/deploy/prob',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 探针列表二级 & 探针信息
        path: '/probe/:id',
        locale: 'route.info',
        menuPath: '/deploy/prob',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 修改探针信息
        path: '/probe/:id',
        locale: 'route.modify',
        menuPath: '/deploy/prob',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
];

// 数据分析 /analysis
const analysisCenter: AdminRouteInterface[] = [
    // 报表任务
    {
        // 获取报表任务列表
        path: '/report-task/list',
        locale: 'route.list',
        menuPath: '/analysis/report-task',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 删除/批量删除报表任务
        path: '/report-task/deletion',
        locale: 'route.delete',
        menuPath: '/analysis/report-task',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 获取报表任务配置信息
        path: '/report-task/info',
        locale: 'route.info',
        menuPath: '/analysis/report-task',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 导入报表任务
        path: '/report-task/import',
        locale: 'route.import',
        menuPath: '/analysis/report-task',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 导出报表任务
        path: '/report-task/export',
        locale: 'route.export',
        menuPath: '/analysis/report-task',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 修改报表任务
        path: '/report-task/:id',
        locale: 'route.modify',
        menuPath: '/analysis/report-task',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 添加报表任务
        path: '/report-task',
        locale: 'route.add',
        menuPath: '/analysis/report-task',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 获取报表保留时间配置
        path: '/report-task/keep-time',
        locale: 'route.info',
        menuPath: '/analysis/report-task',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 修改报表保留时间配置
        path: '/report-task/keep-time',
        locale: 'route.modify',
        menuPath: '/analysis/report-task',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    // 报告查看
    {
        // 显示周期性报表的时间列表
        path: '/reports-view/cycle-time-list',
        locale: 'route.info',
        menuPath: '/analysis/reports-view',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 显示指定报表的配置和数据内容
        path: '/reports-view/detail',
        locale: 'route.info',
        menuPath: '/analysis/reports-view',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 显示报表日历
        path: '/reports-view/calendar',
        locale: 'route.info',
        menuPath: '/analysis/reports-view',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 显示报表类型标签
        path: '/reports-view/tag',
        locale: 'route.info',
        menuPath: '/analysis/reports-view',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 修改发送配置
        path: '/reports-view/send-conf',
        locale: 'route.modify',
        menuPath: '/analysis/reports-view',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 发送
        path: '/reports-view/send',
        locale: 'route.modify',
        menuPath: '/analysis/reports-view',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
];

// 策略管理 /strategy
const strategyCenter: AdminRouteInterface[] = [
    // 对象管理
    {
        // 按类型获取所有对象
        path: '/object/all/:type',
        locale: 'route.list',
        menuPath: '/strategy/object',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 按类型获取对象列表
        path: '/object/list/:type',
        locale: 'route.page',
        menuPath: '/strategy/object',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 删除/批量删除对象
        path: '/object/deletion/:type',
        locale: 'route.del',
        menuPath: '/strategy/object',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 清空对象
        path: '/object/flush/:type',
        locale: 'route.flush',
        menuPath: '/strategy/object',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 导出对象-选中/全部-生成文件
        path: '/object/file/:type',
        locale: 'route.export',
        menuPath: '/strategy/object',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 下载模板
        path: '/object/download/:type',
        locale: 'route.download',
        menuPath: '/strategy/object',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 添加对象
        path: '/object/:type',
        locale: 'route.add',
        menuPath: '/strategy/object',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 获取单个对象信息
        path: '/object/:type/:oid',
        locale: 'route.info',
        menuPath: '/strategy/object',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 修改对象
        path: '/object/:type/:oid',
        locale: 'route.modify',
        menuPath: '/strategy/object',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 导入对象管理信息
        path: '/object/import',
        locale: 'route.import',
        menuPath: '/strategy/object',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    // 事件定义
    {
        // 获取规则默认响应配置
        path: '/rule/action',
        locale: 'route.info',
        menuPath: '/strategy/rule',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 修改规则默认响应配置
        path: '/rule/action',
        locale: 'route.modify',
        menuPath: '/strategy/rule',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 获取所有规则
        path: '/rule/all',
        locale: 'route.list',
        menuPath: '/strategy/rule',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 获取所有规则
        path: '/rule/all',
        locale: 'route.list',
        menuPath: '/strategy/rule',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 获取规则列表
        path: '/rule/list',
        locale: 'route.page',
        menuPath: '/strategy/rule',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 删除/批量删除规则
        path: '/rule/deletion',
        locale: 'route.del',
        menuPath: '/strategy/rule',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // (单条/批量)启用/停用规则
        path: '/rule/status',
        locale: 'route.modify',
        menuPath: '/strategy/rule',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 全部启用/停用规则
        path: '/rule/status-all',
        locale: 'route.modify',
        menuPath: '/strategy/rule',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 添加规则
        path: '/rule',
        locale: 'route.add',
        menuPath: '/strategy/rule',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 获取单个规则信息
        path: '/rule/:oid',
        locale: 'route.info',
        menuPath: '/strategy/rule',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 修改规则
        path: '/rule/:oid',
        locale: 'route.modify',
        menuPath: '/strategy/rule',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 获取规则组
        path: '/rule/group',
        locale: 'route.info',
        menuPath: '/strategy/rule',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 添加规则组
        path: '/rule/group',
        locale: 'route.add',
        menuPath: '/strategy/rule',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 修改规则组
        path: '/rule/group',
        locale: 'route.modify',
        menuPath: '/strategy/rule',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 删除规则组
        path: '/rule/group/deletion',
        locale: 'route.del',
        menuPath: '/strategy/rule',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 修改默认规则
        path: '/rule/factory/:oid',
        locale: 'route.modify',
        menuPath: '/strategy/rule',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    // 客户端信息
    {
        // 客户端列表
        path: '/client/list',
        locale: 'route.page',
        menuPath: '/strategy/clientinfo',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 导出全部-生成文件
        path: '/client/export',
        locale: 'route.export',
        menuPath: '/strategy/clientinfo',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 下载模板-生成文件
        path: '/client/template',
        locale: 'route.download',
        menuPath: '/strategy/clientinfo',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 删除/批量删除客户端
        path: '/client/deletion',
        locale: 'route.del',
        menuPath: '/strategy/clientinfo',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 获取客户端信息
        path: '/client/info',
        locale: 'route.info',
        menuPath: '/strategy/clientinfo',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 修改客户端
        path: '/client/:id',
        locale: 'route.modify',
        menuPath: '/strategy/clientinfo',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 添加客户端
        path: '/client',
        locale: 'route.add',
        menuPath: '/strategy/clientinfo',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 清空客户端
        path: '/client',
        locale: 'route.flush',
        menuPath: '/strategy/clientinfo',
        method: 'DELETE',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 导入客户端信息
        path: '/client/import',
        locale: 'route.import',
        menuPath: '/strategy/clientinfo',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    // 数据脱敏
    {
        // 数据脱敏列表
        path: '/desensitization/list',
        locale: 'route.page',
        menuPath: '/strategy/desensitization',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 删除/批量删除数据脱敏
        path: '/desensitization/deletion',
        locale: 'route.del',
        menuPath: '/strategy/desensitization',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // (批量)启用/停用数据脱敏
        path: '/desensitization/status',
        locale: 'route.modify',
        menuPath: '/strategy/desensitization',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 获取数据脱敏信息
        path: '/desensitization/:id',
        locale: 'route.info',
        menuPath: '/strategy/desensitization',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 修改数据脱敏
        path: '/desensitization/:id',
        locale: 'route.modify',
        menuPath: '/strategy/desensitization',
        method: 'PATCH',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 添加数据脱敏
        path: '/desensitization',
        locale: 'route.add',
        menuPath: '/strategy/desensitization',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
];

// 审计中心 /audit
const auditCenter: AdminRouteInterface[] = [
    // 语句查询
    {
        // 查询语句列表 & 查看类似语句(sqlcode)
        path: '/statement/list',
        locale: 'route.page',
        menuPath: '/audit/statement',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 导出-选中/全部-生成文件
        path: '/statement/export',
        locale: 'route.export',
        menuPath: '/audit/statement',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 获取语句有效查询时间范围
        path: '/statement/range',
        locale: 'route.info',
        menuPath: '/audit/statement',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 查看语句详细
        path: '/statement/:detailId',
        locale: 'route.info',
        menuPath: '/audit/statement',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 获取语句查询-字段展示 & 查询设置
        path: '/content-conf/statement',
        locale: 'route.info',
        menuPath: '/audit/statement',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 获取语句查询-历史查询条件
        path: '/content-conf/statement-query',
        locale: 'route.info',
        menuPath: '/audit/statement',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 修改字段展示 & 查询设置
        path: '/content-conf/statement',
        locale: 'route.info',
        menuPath: '/audit/statement',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    // 事件查询
    {
        // 关联分析查询一级
        path: '/event/analysis',
        locale: 'route.page',
        menuPath: '/audit/event-viewing',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 关联分析查询二级
        path: '/event/secondary-analysis',
        locale: 'route.page',
        menuPath: '/audit/event-viewing',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 关关联分析查询三级 & 明细数据查询
        path: '/event/list',
        locale: 'route.page',
        menuPath: '/audit/event-viewing',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 事件查询返回值
        path: '/event/return/:eventId',
        locale: 'route.info',
        menuPath: '/audit/event-viewing',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 导出-选中/全部-生成文件
        path: '/event/export',
        locale: 'route.export',
        menuPath: '/audit/event-viewing',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 查看事件详细-事件追踪
        path: '/event/:eventId',
        locale: 'route.info',
        menuPath: '/audit/event-viewing',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 获取事件查询-字段展示 & 查询设置
        path: '/content-conf/event',
        locale: 'route.info',
        menuPath: '/audit/event-viewing',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 修改字段展示 & 查询设置
        path: '/content-conf/event',
        locale: 'route.info',
        menuPath: '/audit/event-viewing',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    // SQL模板
    {
        // SQL模板列表
        path: '/sqlcode/list',
        locale: 'route.page',
        menuPath: '/audit/sql-template',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 设置SQL模板状态
        path: '/sqlcode/status',
        locale: 'route.modify',
        menuPath: '/audit/sql-template',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 设置SQL模板别名
        path: '/sqlcode/alias',
        locale: 'route.modify',
        menuPath: '/audit/sql-template',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 数据更新时间
        path: '/sqlcode',
        locale: 'route.info',
        menuPath: '/audit/sql-template',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
];

// 监控中心 /monitor
const monitorCenter: AdminRouteInterface[] = [
    // 运行状态
    {
        // 服务状态
        path: '/runtime/service',
        locale: 'route.info',
        menuPath: '/monitor/running-state',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 设备状态-运行时间-存储空间
        path: '/runtime/device',
        locale: 'route.info',
        menuPath: '/monitor/running-state',
        method: 'GET',
        roleGroupType: '*',
    },
    {
        // 存储状态-圆圈图
        path: '/runtime/storage',
        locale: 'route.info',
        menuPath: '/monitor/running-state',
        method: 'GET',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 系统状态
        path: '/runtime/system',
        locale: 'route.info',
        menuPath: '/monitor/running-state',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 网卡流量
        path: '/runtime/netflux',
        locale: 'route.info',
        menuPath: '/monitor/running-state',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    // 运维分析
    {
        // 业务系统信息
        path: '/operation/bussinfo',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 业务系统信息-业务系统数据库类型统计-业务系统运行状态
        path: '/operation/bussinfo-type-status',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 业务系统信息-未知数据库列表-前端做分页
        path: '/operation/bussinfo-unknow-ip',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 语句统计-会话统计-风险统计-非法访问
        path: '/operation/whole-info',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 趋势统计-ots操作趋势统计 & sess会话趋势统计 & risk风险趋势统计
        path: '/operation/trend-info',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 错误语句统计-慢语句统计
        path: '/operation/comm-info',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 语句统计-业务系统语句统计
        path: '/operation/detail-info-top',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 语句统计-指定业务系统各时间统计值
        path: '/operation/detail-info-buss',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 语句统计-指定业务系统指定时间明细表-前端分页
        path: '/operation/detail-info-list',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 会话统计/会话趋势-业务系统会话排行
        path: '/operation/sess-top',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 会话统计/会话趋势-业务系统会话时间趋势
        path: '/operation/sess-trend',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 会话统计/会话趋势-业务系统会话列表-前端分页
        path: '/operation/sess-list',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 风险统计/风险趋势-业务系统风险排行
        path: '/operation/risk-top',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 风险统计/风险趋势-业务系统风险时间趋势
        path: '/operation/risk-trend',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 风险统计/风险趋势-业务系统风险列表-前端分页
        path: '/operation/risk-list',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 非法访问-非法访问IP统计 & 非法访问时段统计
        path: '/operation/illegal-top',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 非法访问-非法访问IP-趋势
        path: '/operation/illegal-ip-trend',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 非法访问-非法访问IP-列表-前端分页
        path: '/operation/illegal-ip-list',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 非法访问-非法访问时段-趋势
        path: '/operation/illegal-time-trend',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 非法访问-非法访问时段-列表-前端分页
        path: '/operation/illegal-time-list',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 操作趋势统计-业务系统操作语句排行
        path: '/operation/operate-top',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 操作趋势统计-业务系统操作语句-趋势
        path: '/operation/operate-trend',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 操作趋势统计-业务系统操作语句-列表-前端分页
        path: '/operation/operate-list',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 错误语句统计-业务系统操错误语句统计
        path: '/operation/error-top',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 错误语句统计-业务系统操错误语句-趋势
        path: '/operation/error-trend',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 错误语句统计-业务系统操错误语句-列表-前端分页
        path: '/operation/error-list',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 慢语句统计-业务系统操慢语句统计
        path: '/operation/slow-top',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 慢语句统计-业务系统操慢语句-趋势
        path: '/operation/slow-trend',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 慢语句统计-业务系统操慢语句-列表-前端分页
        path: '/operation/slow-list',
        locale: 'route.info',
        menuPath: '/monitor/database-operation',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
];

// 添加页面route权限 admin_routes
export const defaultAdminRoute: AdminRouteInterface[] = [
    // 监控中心
    ...monitorCenter,
    // 审计中心
    ...auditCenter,
    // 数据分析
    ...analysisCenter,
    // 策略管理
    ...strategyCenter,
    // 部署管理
    ...deployCenter,
    // 系统管理
    ...systemCenter,
    // 系统配置
    ...systemConfCenter,
    // 日志管理
    ...logCenter,
    // 验证码
    { path: '/captcha', locale: 'route.captcha', menuPath: '/', method: 'GET', roleGroupType: '*' },
    // 菜单
    {
        // 获取登录用户菜单
        path: '/menu',
        locale: 'route.menu',
        menuPath: '/',
        method: 'GET',
        roleGroupType: '*',
    },
    // 下载文件
    {
        // 下载流量探针客户端
        path: '/download/probe',
        locale: 'route.download',
        menuPath: '/',
        method: 'GET',
        roleGroupType: '*',
    },
    {
        // 下载数据归档文件
        path: '/download/archive',
        locale: 'route.download',
        menuPath: '/',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        // 下载文件
        path: '/download',
        locale: 'route.download',
        menuPath: '/',
        method: 'POST',
        roleGroupType: '*',
    },
    // 文件上传
    {
        // 文件检查
        path: '/upload/check',
        locale: 'route.upload',
        menuPath: '/',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin, RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 文件合并
        path: '/upload/merge',
        locale: 'route.upload',
        menuPath: '/',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin, RoleGroupTypeEnum.securityAdmin],
    },
    {
        // 文件上传
        path: '/upload',
        locale: 'route.upload',
        menuPath: '/',
        method: 'POST',
        roleGroupType: [RoleGroupTypeEnum.systemAdmin, RoleGroupTypeEnum.securityAdmin],
    },
];
