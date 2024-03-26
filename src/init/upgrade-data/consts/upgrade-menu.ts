import { MenuInterface } from '@/init/auth/consts';
import { RoleGroupTypeEnum } from '@/modules/core/role-group/enums';

// 添加页面 Menu 权限 menus

// 监控中心
const monitorCenter: MenuInterface[] = [];
// 审计中心
const auditCenter: MenuInterface[] = [];
// 数据分析
const analysisCenter: MenuInterface[] = [
    {
        parentPath: '/analysis',
        menuUrl: '/analysis/report-task',
        locale: 'menu.reportTask',
        menuName: '报表任务',
        routeName: 'ReportTask',
        order: 1,
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        parentPath: '/analysis',
        menuUrl: '/analysis/reports-view',
        locale: 'menu.reportsView',
        menuName: '报告查看',
        routeName: 'ReportsView',
        order: 2,
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        parentPath: '/analysis',
        menuUrl: '/analysis/cycle-reports/:id',
        locale: 'menu.cycleReports',
        menuName: '报表',
        routeName: 'CycleReports',
        hideInMenu: true,
        order: 3,
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        parentPath: '/analysis',
        menuUrl: '/analysis/once-reports/:id',
        locale: 'menu.onceReports',
        menuName: '报表',
        routeName: 'OnceReports',
        hideInMenu: true,
        order: 4,
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
];

// 策略管理
const strategyCenter: MenuInterface[] = [];

// 部署管理
const deployCenter: MenuInterface[] = [];
// 系统管理
const systemCenter: MenuInterface[] = [
    {
        parentPath: '/system',
        menuUrl: '/system/tenant',
        locale: 'menu.tenant',
        menuName: '租户管理',
        routeName: 'Tenant',
        order: 52,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
];
// 系统配置
const systemConfCenter: MenuInterface[] = [];
// 日志管理
const logCenter: MenuInterface[] = [];

// 系统菜单
export const upgradeMenuData: MenuInterface[] = [
    {
        // 监控中心
        menuUrl: '/monitor',
        locale: 'menu.monitorCenter',
        menuName: '监控中心',
        icon: 'monitor',
        parentPath: '',
        order: 1,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin, RoleGroupTypeEnum.securityAdmin],
        children: [...monitorCenter],
    },
    {
        // 审计中心
        menuUrl: '/audit',
        locale: 'menu.auditCenter',
        menuName: '审计中心',
        icon: 'audit',
        parentPath: '',
        order: 2,
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
        children: [...auditCenter],
    },
    {
        // 数据分析
        menuUrl: '/analysis',
        locale: 'menu.analysisCenter',
        menuName: '数据分析',
        icon: 'analysis',
        parentPath: '',
        order: 3,
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
        children: [...analysisCenter],
    },
    {
        // 策略管理
        menuUrl: '/strategy',
        locale: 'menu.strategyCenter',
        menuName: '策略管理',
        icon: 'strategy',
        parentPath: '',
        order: 4,
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
        children: [...strategyCenter],
    },
    {
        // 部署管理
        menuUrl: '/deploy',
        locale: 'menu.deployCenter',
        menuName: '部署管理',
        icon: 'deploy',
        parentPath: '',
        order: 5,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin, RoleGroupTypeEnum.securityAdmin],
        children: [...deployCenter],
    },
    {
        // 系统管理
        menuUrl: '/system',
        locale: 'menu.systemCenter',
        menuName: '系统管理',
        icon: 'system',
        parentPath: '',
        order: 6,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
        children: [...systemCenter],
    },
    {
        // 系统配置
        menuUrl: '/system-conf',
        locale: 'menu.systemConfCenter',
        menuName: '系统配置',
        icon: 'conf',
        parentPath: '',
        order: 7,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
        // 嵌套的子菜单
        children: [...systemConfCenter],
    },
    {
        // 日志管理
        menuUrl: '/log',
        locale: 'menu.logCenter',
        menuName: '日志管理',
        icon: 'log-management',
        parentPath: '',
        order: 8,
        roleGroupType: [
            RoleGroupTypeEnum.systemAdmin,
            RoleGroupTypeEnum.auditAdmin,
            RoleGroupTypeEnum.securityAdmin,
        ],
        // 嵌套的子菜单
        children: [...logCenter],
    },
];
