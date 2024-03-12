// 客户端错误 400000+
// 服务端错误 500000+
// api 错误 400000 - 400999
// errorCode：错误码 langKeyword：多语言关键字，对应i18n中的字段

// 引擎业务操作接口错误码范围
// 405001+ -- 407999

export const EngineError = {
    // 引擎错误信息
    serverError: { errorCode: 405000, langKeyword: 'engine.error.serverError' },
    // 没有权限
    forbidden: { errorCode: 405001, langKeyword: 'engine.error.forbidden' },
    // 错误的请求参数
    badParams: { errorCode: 405002, langKeyword: 'engine.error.badParams' },
};

// 数据库发现 405101+
export const DbDiscoveryError = {
    // 获取数据库列表失败
    queryDbListFailed: { errorCode: 405101, langKeyword: 'dbDiscovery.error.queryDbListFailed' },
    // 获取数据库状态失败
    queryScanStatusFailed: { errorCode: 405102, langKeyword: 'dbDiscovery.error.queryScanStatusFailed' },
    // 修改 _id 失败
    insertDiscoverCacheFailed: {
        errorCode: 405103,
        langKeyword: 'dbDiscovery.error.insertDiscoverCacheFailed',
    },
    // 扫描失败
    replaceScanFailed: {
        errorCode: 405104,
        langKeyword: 'dbDiscovery.error.replaceScanFailed',
    },
    // 扫描失败
    queryScanFailed: {
        errorCode: 405105,
        langKeyword: 'dbDiscovery.error.queryScanFailed',
    },
    // 查询扫描配置失败
    queryDiscoverCfgFailed: {
        errorCode: 405106,
        langKeyword: 'dbDiscovery.error.queryDiscoverCfgFailed',
    },
    // 添加扫描配置失败
    insertDiscoverScanCfgFailed: {
        errorCode: 405107,
        langKeyword: 'dbDiscovery.error.insertDiscoverScanCfgFailed',
    },
    // 修改扫描配置失败
    replaceDiscoverScanCfgFailed: {
        errorCode: 405108,
        langKeyword: 'dbDiscovery.error.replaceDiscoverScanCfgFailed',
    },
    // 修改扫描配置失败
    delFailed: {
        errorCode: 405109,
        langKeyword: 'dbDiscovery.error.delFailed',
    },
};

// 业务系统配置 405201+
export const BusinessError = {
    // 获取业务系统列表失败
    queryListFailed: { errorCode: 405201, langKeyword: 'business.error.queryListFailed' },
    // 添加业务系统失败
    addBusinessFailed: { errorCode: 405202, langKeyword: 'business.error.addBusinessFailed' },
    // 删除业务系统失败
    delBusinessFailed: { errorCode: 405203, langKeyword: 'business.error.delBusinessFailed' },
    // 获取业务系统信息失败
    findBusinessInfoFailed: { errorCode: 405204, langKeyword: 'business.error.findBusinessInfoFailed' },
    // 修改业务系统信息失败
    updateBusinessFailed: { errorCode: 405205, langKeyword: 'business.error.updateBusinessFailed' },
    // 修改业务系统状态失败
    updateStatusFailed: { errorCode: 405206, langKeyword: 'business.error.updateStatusFailed' },
    // 业务系统对象名称已经存在
    existedName: { errorCode: 405207, langKeyword: 'business.error.existedName' },
    // 添加业务系统失败，存在重复的IP-端口对：
    existedIpPort: { errorCode: 405208, langKeyword: 'business.error.existedIpPort' },
    // 修改业务系统失败，存在重复的IP-端口对：
    updateExistedIpPort: { errorCode: 405208, langKeyword: 'business.error.updateExistedIpPort' },
    // 业务系统不存在
    notExisted: { errorCode: 405209, langKeyword: 'business.error.notExisted' },
    // 包含不存在的业务系统
    inCludeNotExisted: { errorCode: 405210, langKeyword: 'business.error.inCludeNotExisted' },
};

// 对象管理 405301+
export const ObjectError = {
    // 获取对象管理失败
    queryListFailed: { errorCode: 405301, langKeyword: 'object.error.queryListFailed' },
    // 添加对象失败
    addObjectFailed: { errorCode: 405302, langKeyword: 'object.error.addObjectFailed' },
    // 删除对象失败
    delObjectFailed: { errorCode: 405303, langKeyword: 'object.error.delObjectFailed' },
    // 获取对象信息失败
    findObjectInfoFailed: { errorCode: 405304, langKeyword: 'object.error.findObjectInfoFailed' },
    // 修改对象信息失败失败
    updateObjectFailed: { errorCode: 405305, langKeyword: 'object.error.updateObjectFailed' },
    // 对象名称已经存在
    existedName: { errorCode: 405306, langKeyword: 'object.error.existedName' },
    // 清空对象失败
    flushObjectFailed: { errorCode: 405306, langKeyword: 'object.error.flushObjectFailed' },
    // 内容最多为N组
    contentMaxN: { errorCode: 405307, langKeyword: 'object.error.contentMaxN' },
    // 导入{name}对象失败
    importFailed: { errorCode: 405308, langKeyword: 'object.error.importFailed' },
    // 对象不存在
    notExisted: { errorCode: 405309, langKeyword: 'object.error.notExisted' },
};

// 响应配置 405401+
export const ReplyConfError = {
    // 获取响应配置失败
    queryInfoFailed: { errorCode: 405401, langKeyword: 'replyConf.error.queryInfoFailed' },
    // 添加响应配置失败
    addFailed: { errorCode: 405402, langKeyword: 'replyConf.error.addFailed' },
    // 修改响应配置失败
    updateFailed: { errorCode: 405403, langKeyword: 'replyConf.error.updateFailed' },
    // 修改响应配置状态失败
    updateStatusFailed: { errorCode: 405404, langKeyword: 'replyConf.error.updateStatusFailed' },
    // 删除响应配置失败
    delFailed: { errorCode: 405405, langKeyword: 'replyConf.error.delFailed' },
    // 发送测试失败
    testFailed: { errorCode: 405406, langKeyword: 'replyConf.error.testFailed' },
    // 查询测试结果失败
    queryTestFailed: { errorCode: 405407, langKeyword: 'replyConf.error.queryTestFailed' },
    // 添加失败，该服务器地址与端口已存在
    addExistedIpPort: { errorCode: 405408, langKeyword: 'replyConf.error.addExistedIpPort' },
    // 修改失败，该服务器地址与端口已存在
    updateExistedIpPort: { errorCode: 405409, langKeyword: 'replyConf.error.updateExistedIpPort' },
    // 配置不存在
    notExisted: { errorCode: 405410, langKeyword: 'replyConf.error.notExisted' },
    // 没有一个响应配置启用，请先在响应配置页面进行配置
    notExistedConf: { errorCode: 405411, langKeyword: 'replyConf.error.notExistedConf' },
    // 保存失败，短信/钉钉/邮件/企业微信/SNMP TRAP/KAFKA/SYSLOG配置未启用，请先在响应配置页面进行配置, 以“、”分隔
    actionConfFailedHasDisable: {
        errorCode: 405412,
        langKeyword: 'replyConf.error.actionConfFailedHasDisable',
    },
};

// 事件定义 规则 405501+
export const RuleError = {
    // 获取规则失败
    queryFailed: { errorCode: 405501, langKeyword: 'rule.error.queryFailed' },
    // 规则名称已经存在
    existedName: { errorCode: 405502, langKeyword: 'rule.error.existedName' },
    // 添加规则失败
    addFailed: { errorCode: 405503, langKeyword: 'rule.error.addFailed' },
    // 修改规则失败
    updateFailed: { errorCode: 405504, langKeyword: 'rule.error.updateFailed' },
    // 删除规则失败
    deleteFailed: { errorCode: 405505, langKeyword: 'rule.error.deleteFailed' },
    // 修改规则状态失败
    updateStatusFailed: { errorCode: 405506, langKeyword: 'rule.error.updateStatusFailed' },
    // 启用/停用全部规则失败
    updateStatusAllFailed: { errorCode: 405507, langKeyword: 'rule.error.updateStatusAllFailed' },
    // 规则添加成功，关联业务系统失败
    addBusinessFailed: { errorCode: 405508, langKeyword: 'rule.error.addBusinessFailed' },
    // 修改规则成功，软删除旧规则失败
    updateDelFailed: { errorCode: 405509, langKeyword: 'rule.error.updateDelFailed' },
    // 获取规则默认响应配置失败
    queryActionFailed: { errorCode: 405510, langKeyword: 'rule.error.queryActionFailed' },
    // 修改规则默认响应配置失败
    actionConfFailed: { errorCode: 405511, langKeyword: 'rule.error.actionConfFailed' },
    // 规则不存在
    notExisted: { errorCode: 405512, langKeyword: 'rule.error.notExisted' },
    // 默认响应配置已经存在请传oid值
    existedConf: { errorCode: 405514, langKeyword: 'rule.error.existedConf' },
    // 没有一个响应配置启用，请先在响应配置页面进行配置
    notExistedConf: { errorCode: 405515, langKeyword: 'rule.error.notExistedConf' },
    // 保存失败，短信/钉钉/邮件/企业微信/SNMP TRAP/KAFKA/SYSLOG配置未启用，请先在响应配置页面进行配置, 以“、”分隔
    actionConfFailedHasDisable: {
        errorCode: 405516,
        langKeyword: 'rule.error.actionConfFailedHasDisable',
    },
    // 修改规则组名失败
    updateGroupNameFailed: {
        errorCode: 405517,
        langKeyword: 'rule.error.updateGroupNameFailed',
    },
    // 查询规则组失败
    queryGroupFailed: {
        errorCode: 405518,
        langKeyword: 'rule.error.queryGroupFailed',
    },
    // 修改规则组失败
    updateGroupFailed: {
        errorCode: 405519,
        langKeyword: 'rule.error.updateGroupFailed',
    },
    // 添加规则组失败
    addGroupFailed: {
        errorCode: 405520,
        langKeyword: 'rule.error.addGroupFailed',
    },
    // 删除规则组失败
    deleteGroupFailed: {
        errorCode: 405521,
        langKeyword: 'rule.error.deleteGroupFailed',
    },
    // 规则组不存在
    notExistedRuleGroup: {
        errorCode: 405522,
        langKeyword: 'rule.error.notExistedRuleGroup',
    },
};

// 系统服务和维护 405600+
export const MaintainError = {
    // 启动{type}服务失败
    startFailed: { errorCode: 405600, langKeyword: 'maintain.error.startFailed' },
    stopFailed: { errorCode: 405601, langKeyword: 'maintain.error.stopFailed' },
    restartFailed: { errorCode: 405602, langKeyword: 'maintain.error.restartFailed' },
    updateFailed: { errorCode: 405603, langKeyword: 'maintain.error.updateFailed' },
    rebootFailed: { errorCode: 405604, langKeyword: 'maintain.error.rebootFailed' },
    shutdownFailed: { errorCode: 405605, langKeyword: 'maintain.error.shutdownFailed' },
};

// 日志保留时间配置 405700+
export const LogKeepTimeError = {
    // 获取日志保留时间配置失败
    queryLogKeepTimeFailed: { errorCode: 405700, langKeyword: 'log.error.queryLogKeepTimeFailed' },
    // 修改日志保留时间配置失败
    updateLogKeepTimeFailed: { errorCode: 405701, langKeyword: 'log.error.updateLogKeepTimeFailed' },
    // 日志保留时间配置已存在请传oid值
    existedConf: { errorCode: 405702, langKeyword: 'log.error.existedConf' },
};

// 系统内容的一些配置 405800+
// 语句查询 - 展示设置 & 查询设置;
export const ContentConfError = {
    // 获取语句查询字段展示和查询设置失败
    queryStatementFailed: {
        errorCode: 405800,
        langKeyword: 'contentConf.error.queryStatementFailed',
    },
    // 获取事件查询字段展示和查询设置失败
    queryEventFailed: {
        errorCode: 405803,
        langKeyword: 'contentConf.error.queryEventFailed',
    },
    // 修改字段展示和查询设置失败
    updateConfFailed: {
        errorCode: 405804,
        langKeyword: 'contentConf.error.updateConfFailed',
    },
    // 设置已经存在请修改
    existed: {
        errorCode: 405805,
        langKeyword: 'contentConf.error.existed',
    },
    notExisted: {
        errorCode: 405806,
        langKeyword: 'contentConf.error.notExisted',
    },
};

// 日志响应配置 405900+
export const LogReplyError = {
    // 获取日志响应配置失败
    queryReplyConfFailed: { errorCode: 405900, langKeyword: 'log.error.queryReplyConfFailed' },
    // 响应配置已经存在请传正确的oid值
    existedReplyConf: { errorCode: 405901, langKeyword: 'log.error.existedReplyConf' },
    // 日志响应配置失败
    actionConfFailed: { errorCode: 405902, langKeyword: 'log.error.actionConfFailed' },
};
