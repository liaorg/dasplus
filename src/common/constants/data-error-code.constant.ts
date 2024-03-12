// 客户端错误 400000+
// 服务端错误 500000+
// api 错误 400000 - 400999
// errorCode：错误码 langKeyword：多语言关键字，对应i18n中的字段

// 数据接口错误码范围
// 408000+ -- 410399

export const DataError = {
    // 数据错误信息
    serverError: { errorCode: 408000, langKeyword: 'data.error.serverError' },
    // 没有权限
    forbidden: { errorCode: 408001, langKeyword: 'data.error.forbidden' },
    // 错误的请求参数
    badParams: { errorCode: 408002, langKeyword: 'data.error.badParams' },
    // 包含不存在的文件
    includeNotExistFile: { errorCode: 408003, langKeyword: 'data.error.includeNotExistFile' },
};

// 运行状态 408100+
export const RuntimeError = {
    // 获取设备状态失败
    queryDeviceStatusFailed: { errorCode: 408100, langKeyword: 'runtime.error.queryDeviceStatusFailed' },
    // 获取存储状态失败
    queryStorageFailed: { errorCode: 408101, langKeyword: 'runtime.error.queryStorageFailed' },
    // 获取系统状态状态失败
    querySystemStatusFailed: { errorCode: 408102, langKeyword: 'runtime.error.querySystemStatusFailed' },
    // 获取网卡流量失败
    queryNetFluxFailed: { errorCode: 408103, langKeyword: 'runtime.error.queryNetFluxFailed' },
    // 获取服务状态失败
    queryServiceFailed: { errorCode: 408104, langKeyword: 'runtime.error.queryServiceFailed' },
};

// 运维分析 408200+
export const OperationError = {
    // 获取业务系统信息失败
    queryBussinfoFailed: { errorCode: 408200, langKeyword: 'operation.error.queryBussinfoFailed' },
    // 获取语句统计失败
    queryDetailInfoFailed: { errorCode: 408201, langKeyword: 'operation.error.queryDetailInfoFailed' },
    // 获取风险统计失败
    queryEventInfoFailed: { errorCode: 408202, langKeyword: 'operation.error.queryEventInfoFailed' },
    // 获取未知数据库列表失败
    queryUnknowIpFailed: { errorCode: 408203, langKeyword: 'operation.error.queryUnknowIpFailed' },
    // 获取业务系统语句统计失败
    queryDetailInfoTopFailed: {
        errorCode: 408204,
        langKeyword: 'operation.error.queryDetailInfoTopFailed',
    },
    // 获取业务系统各时间统计值失败
    queryDetailInfoBussFailed: {
        errorCode: 408205,
        langKeyword: 'operation.error.queryDetailInfoBussFailed',
    },
    // 获取业务系统各时间统计值失败
    queryDetailInfoQuryFailed: {
        errorCode: 408206,
        langKeyword: 'operation.error.queryDetailInfoQuryFailed',
    },
    // 获取业务系统会话排行失败
    querySessInfoTopFailed: {
        errorCode: 408207,
        langKeyword: 'operation.error.querySessInfoTopFailed',
    },
    // 获取业务系统会话时间趋势失败
    querySessTendFailed: {
        errorCode: 408208,
        langKeyword: 'operation.error.querySessTendFailed',
    },
    // 获取业务系统会话列表失败
    querySessListFailed: {
        errorCode: 408209,
        langKeyword: 'operation.error.querySessListFailed',
    },
    // 获取业务系统风险排行失败
    queryRiskTopFailed: {
        errorCode: 408210,
        langKeyword: 'operation.error.queryRiskTopFailed',
    },
    // 获取业务系统风险时间趋势失败
    queryRiskTendFailed: {
        errorCode: 408211,
        langKeyword: 'operation.error.queryRiskTendFailed',
    },
    // 获取业务系统风险列表失败
    queryRiskListFailed: {
        errorCode: 408212,
        langKeyword: 'operation.error.queryRiskListFailed',
    },
    // 获取业务系统非法访问IP趋势失败
    queryIllegalIpTrendFailed: {
        errorCode: 408213,
        langKeyword: 'operation.error.queryIllegalIpTrendFailed',
    },
    // 获取业务系统非法访问IP列表失败
    queryIllegalIpListFailed: {
        errorCode: 408214,
        langKeyword: 'operation.error.queryIllegalIpListFailed',
    },
    // 获取业务系统非法访问时段趋势失败
    queryIllegalTimeTrendFailed: {
        errorCode: 408215,
        langKeyword: 'operation.error.queryIllegalTimeTrendFailed',
    },
    // 获取业务系统非法访问时段列表失败
    queryIllegalTimeListFailed: {
        errorCode: 408216,
        langKeyword: 'operation.error.queryIllegalTimeListFailed',
    },
    // 获取业务系统操作语句排行失败
    queryOperateTopFailed: {
        errorCode: 408217,
        langKeyword: 'operation.error.queryOperateTopFailed',
    },
    // 获取业务系统操作语句趋势失败
    queryOperateTrendFailed: {
        errorCode: 408218,
        langKeyword: 'operation.error.queryOperateTrendFailed',
    },
    // 获取业务系统操作语句列表失败
    queryOperateListFailed: {
        errorCode: 408219,
        langKeyword: 'operation.error.queryOperateListFailed',
    },
    // 获取业务系统操错误语句统计失败
    queryErrorCommTotalFailed: {
        errorCode: 408220,
        langKeyword: 'operation.error.queryErrorCommTotalFailed',
    },
    // 获取业务系统操错误语句趋势失败
    queryErrorTrendFailed: {
        errorCode: 408221,
        langKeyword: 'operation.error.queryErrorCommTotalFailed',
    },
    // 获取业务系统操错误语句列表失败
    queryErrorListFailed: {
        errorCode: 408222,
        langKeyword: 'operation.error.queryErrorListFailed',
    },
    // 获取业务系统操慢语句统计失败
    querySlowTopFailed: {
        errorCode: 408223,
        langKeyword: 'operation.error.querySlowTopFailed',
    },
    // 获取业务系统操慢语句趋势失败
    querySlowTrendFailed: {
        errorCode: 408224,
        langKeyword: 'operation.error.querySlowTopFailed',
    },
    // 获取业务系统操慢语句列表失败
    querySlowListFailed: {
        errorCode: 408225,
        langKeyword: 'operation.error.querySlowListFailed',
    },
};

// 语句查询 408300+
export const StatementError = {
    // 获取语句列表失败
    queryListFailed: { errorCode: 408300, langKeyword: 'statement.error.queryListFailed' },
    // 查看语句详细失败
    queryDetailFailed: { errorCode: 408301, langKeyword: 'statement.error.queryDetailFailed' },
    // 查看类似语句失败
    querylikeLlistFailed: { errorCode: 408302, langKeyword: 'statement.error.querylikeLlistFailed' },
    // 导出语句信息失败
    exportFailed: { errorCode: 408303, langKeyword: 'statement.error.exportFailed' },
    // 获取语句有效查询时间范围失败
    queryRangeFailed: { errorCode: 408304, langKeyword: 'statement.error.queryRangeFailed' },
};

// 事件查询 408400+
export const EventError = {
    // 获取事件列表失败
    queryListFailed: { errorCode: 408400, langKeyword: 'event.error.queryListFailed' },
    // 获取事件追踪信息失败
    queryDetailFailed: { errorCode: 408401, langKeyword: 'event.error.queryDetailFailed' },
    // 获取事件返回值信息失败
    queryResponseDataFailed: { errorCode: 408402, langKeyword: 'event.error.queryResponseDataFailed' },
    // 导出事件查询信息失败
    exportFailed: { errorCode: 408403, langKeyword: 'event.error.exportFailed' },
};

// SQL模板 408500+
export const SqlcodeError = {
    // 获取SQL模板列表失败
    queryListFailed: { errorCode: 408500, langKeyword: 'sqlcode.error.queryListFailed' },
    // 获取数据更新时间失败
    queryUpdateTimeFailed: { errorCode: 408501, langKeyword: 'sqlcode.error.queryUpdateTimeFailed' },
    // 设置SQL模板别名失败
    setAliasNameFailed: { errorCode: 408502, langKeyword: 'sqlcode.error.setAliasNameFailed' },
    // 设置SQL模板状态失败
    setStatFailed: { errorCode: 408503, langKeyword: 'sqlcode.error.setStatFailed' },
};

// 探针管理 408600+
export const ProbeError = {
    // 获取探针列表失败
    queryListFailed: { errorCode: 408600, langKeyword: 'probe.error.queryListFailed' },
    // 获取探针名称IP操作系统列表失败
    queryItemFailed: { errorCode: 408601, langKeyword: 'probe.error.queryItemFailed' },
    // 获取探针信息失败
    queryInfoFailed: { errorCode: 408602, langKeyword: 'probe.error.queryInfoFailed' },
    // 获取探针24小时流量信息失败
    queryFluxFailed: { errorCode: 408603, langKeyword: 'probe.error.queryFluxFailed' },
    // 删除探针失败
    deleteFailed: { errorCode: 408604, langKeyword: 'probe.error.deleteFailed' },
    // 清空探针失败
    flushFailed: { errorCode: 408605, langKeyword: 'probe.error.flushFailed' },
    // 升级探针失败
    upgadeFailed: { errorCode: 408606, langKeyword: 'probe.error.upgadeFailed' },
    // 升级全部探针失败
    upgadeAllFailed: { errorCode: 408607, langKeyword: 'probe.error.upgadeAllFailed' },
    // 修改探针探针失败
    updateFailed: { errorCode: 408608, langKeyword: 'probe.error.updateFailed' },
    // 获取探针统计信息失败
    queryCountFailed: { errorCode: 408609, langKeyword: 'probe.error.queryCountFailed' },
    // 名称已存在
    existedName: { errorCode: 408610, langKeyword: 'probe.error.existedName' },
};

// 客户端信息 408700+
export const ClientError = {
    // 获取客户端列表失败
    queryListFailed: { errorCode: 408700, langKeyword: 'client.error.queryListFailed' },
    // 添加客户端失败
    addFailed: { errorCode: 408701, langKeyword: 'client.error.addFailed' },
    // 修改客户端失败
    updateFailed: { errorCode: 408702, langKeyword: 'client.error.updateFailed' },
    // 获取客户端信息失败
    queryInfoFailed: { errorCode: 408703, langKeyword: 'client.error.queryInfoFailed' },
    // 删除客户端信息失败
    deleteFailed: { errorCode: 408704, langKeyword: 'client.error.deleteFailed' },
    // 清空客户端失败
    flushFailed: { errorCode: 408705, langKeyword: 'client.error.flushFailed' },
    // 导出客户端失败
    exportFailed: { errorCode: 408706, langKeyword: 'client.error.exportFailed' },
    // IP已经存在
    ipExixted: { errorCode: 408707, langKeyword: 'client.error.ipExixted' },
    // IP不存在
    ipNotExixted: { errorCode: 408708, langKeyword: 'client.error.ipNotExixted' },
    // 导入客户端失败
    importFailed: { errorCode: 408709, langKeyword: 'client.error.importFailed' },
};

// 数据归档 408800+
export const ArchiveError = {
    // 获取数据归档列表失败
    queryListFailed: { errorCode: 408800, langKeyword: 'archive.error.queryListFailed' },
    // 删除数据归档失败
    deleteFailed: { errorCode: 408801, langKeyword: 'archive.error.deleteFailed' },
    // 修改数据归档外传配置失败
    updateConfFailed: { errorCode: 408802, langKeyword: 'archive.error.updateConfFailed' },
    // 获取数据归档外传配置失败
    getConfFailed: { errorCode: 408803, langKeyword: 'archive.error.getConfFailed' },
    // 获取数据归档加密配置失败
    getCipherConfFailed: { errorCode: 408804, langKeyword: 'archive.error.getCipherConfFailed' },
    // 修改数据归档加密配置失败
    updateCipherFailed: { errorCode: 408805, langKeyword: 'archive.error.updateCipherFailed' },
};

// 数据脱敏 规则 408900+
export const DesensitizationError = {
    // 获取数据脱敏失败
    queryFailed: { errorCode: 408900, langKeyword: 'desensitization.error.queryFailed' },
    // 名称已经存在
    existedName: { errorCode: 408901, langKeyword: 'desensitization.error.existedName' },
    // 添加数据脱敏失败
    addFailed: { errorCode: 408903, langKeyword: 'desensitization.error.addFailed' },
    // 修改数据脱敏失败
    updateFailed: { errorCode: 408904, langKeyword: 'desensitization.error.updateFailed' },
    // 删除数据脱敏失败
    deleteFailed: { errorCode: 408905, langKeyword: 'desensitization.error.deleteFailed' },
    // 修改数据脱敏状态失败
    updateStatusFailed: { errorCode: 408906, langKeyword: 'desensitization.error.updateStatusFailed' },
    // 数据脱敏不存在
    notExisted: { errorCode: 408907, langKeyword: 'desensitization.error.notExisted' },
};

// 事件查询 409000+
export const ReportTaskError = {
    // 获取报表任务列表失败
    queryListFailed: { errorCode: 409000, langKeyword: 'reportTask.error.queryListFailed' },
    // 添加报表任务失败
    addFailed: { errorCode: 409001, langKeyword: 'reportTask.error.addFailed' },
    // 修改报表任务失败
    updateFailed: { errorCode: 409002, langKeyword: 'reportTask.error.updateFailed' },
    // 删除报表任务失败
    deleteFailed: { errorCode: 409003, langKeyword: 'reportTask.error.deleteFailed' },
    // 获取报表任务失败
    queryDetailFailed: { errorCode: 409004, langKeyword: 'reportTask.error.queryDetailFailed' },
    // 导出报表任务全部配置失败
    exportFailed: { errorCode: 409005, langKeyword: 'reportTask.error.exportFailed' },
    // 名称已经存在
    existedName: { errorCode: 409006, langKeyword: 'reportTask.error.existedName' },
    // 获取报表任务配置信息失败
    queryInfoFailed: { errorCode: 409007, langKeyword: 'reportTask.error.queryInfoFailed' },
    // 获取报表保留时间配置失败
    queryKeepTimeFailed: { errorCode: 409008, langKeyword: 'reportTask.error.queryKeepTimeFailed' },
    // 修改报表保留时间配置失败
    updateKeepTimeFailed: { errorCode: 409009, langKeyword: 'reportTask.error.updateKeepTimeFailed' },
    // 导入报表任务配置失败
    importFailed: { errorCode: 409010, langKeyword: 'reportTask.error.importFailed' },
};
// 报表查看 409100+
export const ReportsViewError = {
    // 获取周期性报表的时间列表
    queryCycleTimeListFailed: {
        errorCode: 409100,
        langKeyword: 'reportsView.error.queryCycleTimeListFailed',
    },
    // 获取报表任务配置和数据失败
    queryDetailFailed: { errorCode: 409101, langKeyword: 'reportsView.error.queryDetailFailed' },
    // 获取报表日历数据失败
    queryCalendarFailed: { errorCode: 409102, langKeyword: 'reportsView.error.queryCalendarFailed' },
    // 获取报表类型标签数据失败
    queryTagFailed: { errorCode: 4091013, langKeyword: 'reportsView.error.queryTagFailed' },
    // 修改报表发送配置失败
    updateSendConfFailed: { errorCode: 4091014, langKeyword: 'reportsView.error.updateSendConfFailed' },
};
