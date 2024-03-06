/**
 * 系统管理员组角色下的用户
 * 用户管理和角色管理的权限
 * src/init/auth/consts/default-admin-route.ts
 */

export const ExcludeAdminUserRoute = [
    {
        // 登录
        path: '/user/login',
        method: 'POST',
    },
    {
        // 退出登录
        path: '/user/logout',
        method: 'GET',
    },
    {
        // 获取登录用户信息-头部
        path: '/user/profile',
        method: 'GET',
    },
    {
        // 修改登录用户信息-头部
        path: '/user/profile',
        method: 'PATCH',
    },
];

export const AdminUserRoleRouteConst = [
    // 角色管理
    {
        // 获取角色组名称下拉列表
        path: '/role/role-group-list',
        method: 'GET',
    },
    {
        // 根据角色组，获取用户名称下拉列表
        path: '/role/user-list/:roleGroupId',
        method: 'GET',
    },
    {
        // 根据角色组，获取菜单树
        path: '/role/menu-list/:roleGroupId',
        method: 'GET',
    },
    {
        // 获取角色菜单权限
        path: '/role/menu-route/:roleId',
        method: 'GET',
    },
    {
        // 设置默认管理员
        path: '/role/default-adminer',
        method: 'PATCH',
    },
    {
        // 角色表格分页数据
        path: '/role/query',
        method: 'POST',
    },
    {
        // 添加角色
        path: '/role',
        method: 'POST',
    },
    {
        // 获取角色信息
        path: '/role/:roleId',
        method: 'GET',
    },
    {
        // 修改角色
        path: '/role/:roleId',
        method: 'PATCH',
    },
    {
        // 删除角色，角色下的用户也会删除
        path: '/role/:roleId',
        method: 'DELETE',
    },
    // 用户管理
    {
        // 重置密码
        path: '/user/passwords',
        method: 'PATCH',
    },
    {
        // 获取角色名称下拉列表
        path: '/user/role-list',
        method: 'GET',
    },
    {
        // 用户分页-查询
        path: '/user/query',
        method: 'POST',
    },
    {
        // 删除/批量删除用户
        path: '/user/deletion',
        method: 'POST',
    },
    {
        // 添加用户
        path: '/user',
        method: 'POST',
    },
    {
        // 获取指定用户信息(包含角色)-用户管理
        path: '/user/:userId',
        method: 'GET',
    },
    {
        // 修改用户
        path: '/user/:userId',
        method: 'PATCH',
    },
];
