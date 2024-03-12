// 对应前端 src/router/routes/default-routes.ts
// 添加菜单权限 menu menu_permission_relation

import { ObjectIdType } from '@/common/services';
import { RoleGroupTypeEnum } from '@/modules/core/role-group/enums';

// 菜单接口
export interface MenuInterface {
    // 路径 与路由路径menuPath对应 src/init/auth/consts/default-admin-route.ts
    menuUrl: string;
    // 本地化/国际化名称，对应 i18n 文件 menu.json 中的字段
    locale: string;
    // 菜单名称，可以做为前端组件名要大写开头
    menuName: string;
    // 路由组件名称
    routeName?: string;
    // 菜单父路径
    parentPath?: string;
    // 排序值
    order?: number;
    // 图标
    icon?: string;
    // 嵌套的子菜单
    children?: MenuInterface[];
    // 父ID
    parentId?: ObjectIdType;
    // 是否在菜单中隐藏该项hideInMenu 0-否|1-是
    hideInMenu?: boolean;
    // 是否在菜单中隐藏三级children 0-否|1-是
    hideChildrenInMenu?: boolean;
    // 是否显示在tab-bar标签中
    noAffix?: boolean;
    // 拥有权限的角色组type集合，*表示所有角色都有的操作
    roleGroupType?: '*' | RoleGroupTypeEnum[];
}

// 监控中心
const monitorCenter: MenuInterface[] = [
    // 运行状态
    {
        parentPath: '/monitor',
        menuUrl: '/monitor/running-state',
        locale: 'menu.runningState',
        menuName: '运行状态',
        routeName: 'RunningState',
        order: 11,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    // 运维分析
    {
        parentPath: '/monitor',
        menuUrl: '/monitor/database-operation',
        locale: 'menu.databaseOperation',
        menuName: '运维分析',
        routeName: 'DatabaseOperation',
        order: 12,
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
];

// 审计中心
const auditCenter: MenuInterface[] = [
    {
        parentPath: '/audit',
        menuUrl: '/audit/statement',
        locale: 'menu.statement',
        menuName: '语句查询',
        routeName: 'Statement',
        order: 21,
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        parentPath: '/audit',
        menuUrl: '/audit/event-viewing',
        locale: 'menu.eventViewing',
        menuName: '事件查询',
        routeName: 'EventViewing',
        order: 22,
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        parentPath: '/audit',
        menuUrl: '/audit/sql-template',
        locale: 'menu.sqlTemplate',
        menuName: 'SQL模板',
        routeName: 'SqlTemplate',
        order: 23,
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
];

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
const strategyCenter: MenuInterface[] = [
    {
        parentPath: '/strategy',
        menuUrl: '/strategy/rule',
        locale: 'menu.rule',
        menuName: '事件定义',
        routeName: 'Rule',
        order: 31,
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        parentPath: '/strategy',
        menuUrl: '/strategy/object',
        locale: 'menu.strategyObject',
        menuName: '对象管理',
        routeName: 'StrategyObject',
        order: 32,
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        parentPath: '/strategy',
        menuUrl: '/strategy/clientinfo',
        locale: 'menu.clientinfo',
        menuName: '客户端信息',
        routeName: 'Clientinfo',
        order: 33,
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        parentPath: '/strategy',
        menuUrl: '/strategy/desensitization',
        locale: 'menu.desensitization',
        menuName: '数据脱敏',
        routeName: 'Desensitization',
        order: 34,
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
];

// 部署管理
const deployCenter: MenuInterface[] = [
    {
        parentPath: '/deploy',
        menuUrl: '/deploy/business',
        locale: 'menu.business',
        menuName: '业务系统配置',
        routeName: 'Business',
        order: 41,
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
    {
        parentPath: '/deploy',
        menuUrl: '/deploy/prob',
        locale: 'menu.prob',
        menuName: '探针管理',
        routeName: 'Prob',
        order: 42,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        parentPath: '/deploy',
        menuUrl: '/deploy/db-discovery',
        locale: 'menu.dbDiscovery',
        menuName: '数据库发现',
        routeName: 'DbDiscovery',
        order: 43,
        roleGroupType: [RoleGroupTypeEnum.securityAdmin],
    },
];

// 系统管理员-系统管理
const systemCenter: MenuInterface[] = [
    {
        parentPath: '/system',
        menuUrl: '/system/user',
        locale: 'menu.user',
        menuName: '用户管理',
        routeName: 'User',
        order: 51,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        parentPath: '/system',
        menuUrl: '/system/role',
        locale: 'menu.role',
        menuName: '角色管理',
        routeName: 'Role',
        order: 52,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        parentPath: '/system',
        menuUrl: '/system/service',
        locale: 'menu.service',
        menuName: '系统服务',
        routeName: 'Service',
        order: 53,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        parentPath: '/system',
        menuUrl: '/system/maintain',
        locale: 'menu.maintain',
        menuName: '系统维护',
        routeName: 'Maintain',
        order: 54,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        parentPath: '/system',
        menuUrl: '/system/profile',
        locale: 'menu.systemProfile',
        menuName: '系统信息',
        routeName: 'Profile',
        order: 55,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
];

// 系统管理员-系统配置
const systemConfCenter: MenuInterface[] = [
    {
        parentPath: '/system-conf',
        menuUrl: '/system-conf/network',
        locale: 'menu.network',
        menuName: '网卡配置',
        routeName: 'Network',
        order: 61,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        parentPath: '/system-conf',
        menuUrl: '/system-conf/static-route',
        locale: 'menu.staticRoute',
        menuName: '静态路由',
        routeName: 'StaticRoute',
        order: 62,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    // {
    //     parentPath: '/system-conf',
    //     menuUrl: '/system-conf/backup-restore',
    //     locale: 'menu.backupAndRestore',
    //     menuName: '配置备份还原',
    //     routeName: 'BackupRestore',
    //     order: 63,
    //     roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    // },
    {
        parentPath: '/system-conf',
        menuUrl: '/system-conf/security-configure',
        locale: 'menu.securityConfigure',
        menuName: '安全配置',
        routeName: 'SecurityConfigure',
        order: 64,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        parentPath: '/system-conf',
        menuUrl: '/system-conf/response-configure',
        locale: 'menu.responseConfigure',
        menuName: '响应配置',
        routeName: 'ResponseConfigure',
        order: 65,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        parentPath: '/system-conf',
        menuUrl: '/system-conf/time-configure',
        locale: 'menu.timeConfigure',
        menuName: '时间配置',
        routeName: 'TimeConfigure',
        order: 66,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        parentPath: '/system-conf',
        menuUrl: '/system-conf/archive',
        locale: 'menu.archive',
        menuName: '数据归档',
        routeName: 'Archive',
        order: 67,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
];

// 日志管理
const logCenter: MenuInterface[] = [
    {
        parentPath: '/log',
        menuUrl: '/log/operate-log',
        locale: 'menu.operateLog',
        menuName: '操作日志',
        routeName: 'OperateLog',
        order: 71,
        roleGroupType: [RoleGroupTypeEnum.auditAdmin, RoleGroupTypeEnum.securityAdmin],
    },
    {
        parentPath: '/log',
        menuUrl: '/log/runtime-log',
        locale: 'menu.runtimeLog',
        menuName: '运行日志',
        routeName: 'RuntimeLog',
        order: 72,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
    {
        parentPath: '/log',
        menuUrl: '/log/keep-time',
        locale: 'menu.keepTime',
        menuName: '保留时间配置',
        routeName: 'KeepTime',
        order: 73,
        roleGroupType: [RoleGroupTypeEnum.systemAdmin],
    },
];

// 系统菜单
export const defaultMenu: MenuInterface[] = [
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
        roleGroupType: '*',
        // 嵌套的子菜单
        children: [...logCenter],
    },
];
