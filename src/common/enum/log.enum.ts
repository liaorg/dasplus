/**
 * 操作日志类型
 * 99其它操作 1用户登录 2用户退出 3配置修改
 * 4系统管理 5业务操作 6导入 7导出
 */
export enum OperateLogEnum {
    all = 0,
    login = 1,
    logout = 2,
    configModify = 3,
    systemAdmin = 4,
    businessOperate = 5,
    import = 6,
    export = 7,
    createFile = 8,
    other = 99,
}

/**
 * 运行日志类型
 * 99其它运行 1运行正常 2系统异常
 */
export enum RuntimeLogEnum {
    all = 0,
    normal = 1,
    abnormal = 2,
    other = 99,
}
