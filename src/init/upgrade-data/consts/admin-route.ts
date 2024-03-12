import { AdminRouteInterface } from '@/init/auth/consts';
import { RoleGroupTypeEnum } from '@/modules/core/role-group/enums';

// roleGroup: [RoleGroupTypeEnum.systemAdmin],

// 添加页面Route权限 admin_routes
export const adminRouteData: AdminRouteInterface[] = [
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
