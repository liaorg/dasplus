import { OperateLogEnum, RuntimeLogEnum } from '../enum';

/**
 * 操作日志类型
 * 99其它 1登录 2退出 3配置修改
 * 4系统管理 5业务操作 6导入 7导出
 */
export const OPERATE_LOG = [
    OperateLogEnum.all,
    OperateLogEnum.login,
    OperateLogEnum.logout,
    OperateLogEnum.configModify,
    OperateLogEnum.systemAdmin,
    OperateLogEnum.businessOperate,
    OperateLogEnum.export,
    OperateLogEnum.import,
    OperateLogEnum.createFile,
    OperateLogEnum.other,
];

/**
 * 运行日志类型
 * 99其它 1正常 2异常
 */
export const RUNTIME_LOG = [
    RuntimeLogEnum.all,
    RuntimeLogEnum.abnormal,
    RuntimeLogEnum.normal,
    RuntimeLogEnum.other,
];
