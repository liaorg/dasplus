// 客户端错误 400000+
// 服务端错误 500000+
// api 错误 400000 - 400999
// errorCode：错误码 langKeyword：多语言关键字，对应i18n中的字段

// 400000+ -- 400199
export const ApiError = {
    // 请求超时
    requestTimeout: { errorCode: -1, langKeyword: 'api.error.requestTimeout' },
    // 请求成功
    requestSuccess: { errorCode: 0, langKeyword: 'api.error.requestSuccess' },
    // 未知错误
    unknowError: { errorCode: 400000, langKeyword: 'api.error.unknowError' },
    // 错误的请求参数
    badParams: { errorCode: 400001, langKeyword: 'api.error.badParams' },
    // 文件不存在
    fileNotExisted: { errorCode: 400002, langKeyword: 'api.error.fileNotExisted' },
    // 创建文件失败
    createFileFailed: { errorCode: 400003, langKeyword: 'api.error.createFileFailed' },
    // 下载文件失败
    downloadFileFailed: { errorCode: 400004, langKeyword: 'api.error.downloadFileFailed' },
    // 写入文件失败
    writeFileFailed: { errorCode: 400005, langKeyword: 'api.error.writeFileFailed' },
    // 读取文件失败
    readFileFailed: { errorCode: 400006, langKeyword: 'api.error.readFileFailed' },
    // 复制文件失败
    copyFileFailed: { errorCode: 400007, langKeyword: 'api.error.copyFileFailed' },
    // 暂无数据
    noData: { errorCode: 400008, langKeyword: 'api.error.noData' },
    // 参数解密错误
    encryptError: { errorCode: 400009, langKeyword: 'api.error.encryptError' },
    // 参数签名错误
    signError: { errorCode: 400010, langKeyword: 'api.error.signError' },
    // objectId 错误
    objectIdError: { errorCode: 400011, langKeyword: 'api.error.objectIdError' },
    // 密码为弱密码 检测到当前密码容易被攻击，请重新设置
    weakPassword: { errorCode: 400012, langKeyword: 'api.error.weakPassword' },
    // 服务器错误
    serverError: { errorCode: 500001, langKeyword: 'api.error.serverError' },
};

// 系统管理接口错误码范围
// 400200+ -- 404999

// 登录验证 权限验证 400200+
export const AuthError = {
    // 用户名或密码错误
    wrongUserOrPassword: { errorCode: 400201, langKeyword: 'auth.error.wrongUserOrPassword' },
    // 未登录
    unauthorized: { errorCode: 400202, langKeyword: 'auth.error.unauthorized' },
    // 没有权限
    forbidden: { errorCode: 400203, langKeyword: 'auth.error.forbidden' },
    forbiddenLogin: { errorCode: 400204, langKeyword: 'auth.error.forbiddenLogin' },
    forbiddenLogout: { errorCode: 400205, langKeyword: 'auth.error.forbiddenLogout' },
    forbiddenRoute: { errorCode: 400206, langKeyword: 'auth.error.forbiddenRoute' },
    forbiddenUserRoleRoute: { errorCode: 400207, langKeyword: 'auth.error.forbiddenRoute' },
    // 退出登录失败
    logoutFailed: { errorCode: 400208, langKeyword: 'auth.error.logoutFailed' },
    // jwt token错误
    errorJwtToken: { errorCode: 400209, langKeyword: 'auth.error.errorJwtToken' },
    // 用户已停用，请联系管理员
    disabledUser: { errorCode: 400210, langKeyword: 'auth.error.disabledUser' },
    // 客户端已经被锁定，请联系管理员
    lockedClient: { errorCode: 400211, langKeyword: 'auth.error.lockedClient' },
    localLockedClient: { errorCode: 400212, langKeyword: 'auth.error.lockedClient' },
    // 登录超时
    tokenExpired: { errorCode: 400213, langKeyword: 'auth.error.tokenExpired' },
    // 登录验证
    mastCaptcha: { errorCode: 400214, langKeyword: 'auth.error.mastCaptcha' },
    // 登录验证错误
    wrongCaptcha: { errorCode: 400215, langKeyword: 'auth.error.wrongCaptcha' },
};

// 用户管理 401000+
export const UserError = {
    // 用户名已存在
    existedName: { errorCode: 401001, langKeyword: 'user.error.existedName' },
    // 错误的id
    errorid: { errorCode: 401002, langKeyword: 'user.error.errorid' },
    // 用户不存在
    notExisted: { errorCode: 401003, langKeyword: 'user.error.notExisted' },
    // 添加用户失败
    addFailed: { errorCode: 401004, langKeyword: 'user.error.addFailed' },
    // 修改用户失败
    updateFailed: { errorCode: 401005, langKeyword: 'user.error.updateFailed' },
    // 删除用户失败
    deleteFailed: { errorCode: 401006, langKeyword: 'user.error.deleteFailed' },
    // 不能包含默认用户
    unContainDefault: { errorCode: 401007, langKeyword: 'user.error.unContainDefault' },
    // 重置密码失败
    resetPasswordFailed: { errorCode: 401008, langKeyword: 'user.error.resetPasswordFailed' },
    // 修改密码失败
    updatePasswordFailed: { errorCode: 401009, langKeyword: 'user.error.updatePasswordFailed' },
    // 不能包含当前登录用户
    unContainLoginUser: { errorCode: 401010, langKeyword: 'user.error.unContainLoginUser' },
    // 不能包含默认系统管理员用户
    unContainSystemDefault: { errorCode: 401011, langKeyword: 'user.error.unContainSystemDefault' },
    // 包含不存在的用户
    containNotExistUser: { errorCode: 401012, langKeyword: 'user.error.containNotExistUser' },
    // 旧密码错误
    passwordError: { errorCode: 401013, langKeyword: 'user.error.passwordError' },
    // 确认密码应该与密码相同
    repasswordError: { errorCode: 401014, langKeyword: 'user.error.repasswordError' },
    // 旧密码必填
    oldPasswordReruired: { errorCode: 401015, langKeyword: 'user.error.oldPasswordReruired' },
    // 新密码不能和旧密码相同
    notEqualOldPassword: { errorCode: 401016, langKeyword: 'user.error.notEqualOldPassword' },
};

// 角色管理 401100+
export const RoleError = {
    // 角色名已存在
    existedName: { errorCode: 401101, langKeyword: 'role.error.existedName' },
    // 错误的角色id
    errorid: { errorCode: 401102, langKeyword: 'role.error.errorid' },
    // 角色不存在
    notExisted: { errorCode: 401103, langKeyword: 'role.error.notExisted' },
    // 删除失败
    deleteFailed: { errorCode: 401104, langKeyword: 'role.error.deleteFailed' },
    // 不能删除默认角色
    unDeleteDefault: { errorCode: 401105, langKeyword: 'role.error.unDeleteDefault' },
    // 不能删除当前登录用户所属于的角色
    unContainLoginUserRole: { errorCode: 401106, langKeyword: 'role.error.unContainLoginUserRole' },
    // 添加角色失败
    addFailed: { errorCode: 401107, langKeyword: 'role.error.addFailed' },
    // 修改角色失败
    updateFailed: { errorCode: 401108, langKeyword: 'role.error.updateFailed' },
    // 不能修改默认角色的角色组、业务权限、菜单权限
    unModifyDefaultRoleNameMenuBusiness: {
        errorCode: 401109,
        langKeyword: 'role.error.unModifyDefaultRoleNameMenuBusiness',
    },
    // 权限不存在
    permissionNotExisted: { errorCode: 401110, langKeyword: 'role.error.permissionNotExisted' },
    // 包含角色组不存在的权限
    containNonePermission: { errorCode: 401111, langKeyword: 'role.error.containNonePermission' },
    // 默认角色才能设置默认管理员
    mustDefaultRole: { errorCode: 401112, langKeyword: 'role.error.mustDefaultRole' },
    // 用户不在角色中
    notContainUser: { errorCode: 401113, langKeyword: 'role.error.notContainUser' },
};
// 角色组管理 401200+
export const RoleGroupError = {
    // 角色组名已经存在
    existedName: { errorCode: 401201, langKeyword: 'roleGroup.error.existedName' },
    // 角色组不存在
    notExisted: { errorCode: 401202, langKeyword: 'roleGroup.error.notExisted' },
};
// 注意菜单和路由在页面体现上是一起的
// 菜单 401300+
export const MenuError = {
    // 菜单权限不存在
    notExisted: { errorCode: 401301, langKeyword: 'menu.error.notExisted' },
    // 必须包含菜单权限
    mustContainMenu: { errorCode: 401302, langKeyword: 'menu.error.mustContainMenu' },
    // 包含不存在的菜单权限
    containNoneMenu: { errorCode: 401303, langKeyword: 'menu.error.containNoneMenu' },
};
// 路由 401400+
export const AdminRouteError = {
    // 菜单权限不存在
    notExisted: { errorCode: 401401, langKeyword: 'route.error.notExisted' },
    // 必须包含菜单权限
    mustContainRoute: { errorCode: 401402, langKeyword: 'route.error.mustContainRoute' },
    // 包含不存在的菜单权限
    containNoneRoute: { errorCode: 401403, langKeyword: 'route.error.containNoneRoute' },
};

// 操作日志 401500+
export const OperateLogError = {
    // 添加操作日志失败
    addFailed: { errorCode: 401501, langKeyword: 'log.error.addFailed' },
    // 文件不存在
    fileNotExisted: { errorCode: 401502, langKeyword: 'log.error.fileNotExisted' },
    // 查询日志信息失败
    queryFailed: { errorCode: 401503, langKeyword: 'log.error.queryFailed' },
};

// 系统配置 401600+
export const SystemConfigureError = {
    // 配置不存在
    notExisted: { errorCode: 401601, langKeyword: 'configure.error.notExisted' },
    // 添加配置失败
    addFailed: { errorCode: 401602, langKeyword: 'configure.error.addFailed' },
    // 修改配置失败
    updateFailed: { errorCode: 401603, langKeyword: 'configure.error.updateFailed' },
    // 获取配置失败
    getConfigureFailed: {
        errorCode: 401604,
        langKeyword: 'configure.error.getConfigureFailed',
    },
    // 配置保存成功，同步时间失败
    updateTimeFailed: { errorCode: 401605, langKeyword: 'configure.error.updateTimeFailed' },
    // 服务不存在
    serverNotExisted: { errorCode: 401606, langKeyword: 'configure.error.serverNotExisted' },
    // 端口不存在
    portNotExisted: { errorCode: 401607, langKeyword: 'configure.error.portNotExisted' },
};
// 静态路由 401700+
export const StaticRouteError = {
    // 静态路由不存在
    notExisted: { errorCode: 401701, langKeyword: 'staticRoute.error.notExisted' },
    // 添加静态路由失败
    addFailed: { errorCode: 401702, langKeyword: 'staticRoute.error.addFailed' },
    // 修改静态路由失败
    updateFailed: { errorCode: 401703, langKeyword: 'staticRoute.error.updateFailed' },
    // 删除静态路由失败
    deleteFailed: { errorCode: 401704, langKeyword: 'staticRoute.error.deleteFailed' },
    // 获取网卡名列表失败
    getDeviceFailed: { errorCode: 401705, langKeyword: 'staticRoute.error.getDeviceFailed' },
    // 网卡不存在
    deviceNotExisted: { errorCode: 401706, langKeyword: 'staticRoute.error.deviceNotExisted' },
    // 目标网络已存在
    existedAddress: { errorCode: 401707, langKeyword: 'staticRoute.error.existedAddress' },
    // 至少填写一组 IP 地址
    mustOneAddress: { errorCode: 401708, langKeyword: 'staticRoute.error.mustOneAddress' },
};
// 网卡配置 401800+
export const NetworkError = {
    // 网卡不存在
    notExisted: { errorCode: 401801, langKeyword: 'network.error.notExisted' },
    // 配置 IP 失败
    setIpFailed: { errorCode: 401802, langKeyword: 'network.error.setIpFailed' },
    // 删除 IP 失败
    deleteFailed: { errorCode: 401803, langKeyword: 'network.error.deleteFailed' },
    // 获取网卡失败
    getFailed: { errorCode: 401804, langKeyword: 'network.error.getFailed' },
    // 默认检修口不允许设置 IP
    notAllowedSetMaintainPort: {
        errorCode: 401805,
        langKeyword: 'network.error.notAllowedSetMaintainPort',
    },
    // 至少填写一组 IP 地址
    mustOneAddress: { errorCode: 401806, langKeyword: 'network.error.mustOneAddress' },
    // 默认管理口/检修口不允许删除 IP
    notAllowDel: { errorCode: 401807, langKeyword: 'network.error.notAllowDel' },
    // 监听口不允许设置IP
    notAllowedSetListenPort: {
        errorCode: 401808,
        langKeyword: 'network.error.notAllowedSetListenPort',
    },
    // 不能监听管理口和检修口
    notAllowedListenPort: {
        errorCode: 401809,
        langKeyword: 'network.error.notAllowedListenPort',
    },
    // 监听网卡失败
    listenFailed: { errorCode: 401810, langKeyword: 'network.error.listenFailed' },
    // 取消监听网卡失败
    unListenFailed: { errorCode: 401811, langKeyword: 'network.error.unListenFailed' },
    // 启用网卡失败
    upFailed: { errorCode: 401812, langKeyword: 'network.error.upFailed' },
    // 停用网卡失败
    downFailed: { errorCode: 401813, langKeyword: 'network.error.downFailed' },
    // 不能监听有 IP 地址的网卡
    notAllowedListenIp: {
        errorCode: 401814,
        langKeyword: 'network.error.notAllowedListenIp',
    },
    // 已经是监听状态
    isListened: {
        errorCode: 401815,
        langKeyword: 'network.error.isListened',
    },
};

// 管理主机 401900+
export const AdminHostError = {
    // 管理主机不存在
    notExisted: { errorCode: 401901, langKeyword: 'adminHost.error.notExisted' },
    // 添加管理主机失败
    addFailed: { errorCode: 401902, langKeyword: 'adminHost.error.addFailed' },
    // 修改管理主机失败
    updateFailed: { errorCode: 401903, langKeyword: 'adminHost.error.updateFailed' },
    // 删除管理主机失败
    deleteFailed: { errorCode: 401904, langKeyword: 'adminHost.error.deleteFailed' },
    // 目标网络已存在
    existedAddress: { errorCode: 401905, langKeyword: 'adminHost.error.existedAddress' },
    // 包含不存在的管理主机
    containNotExist: { errorCode: 401906, langKeyword: 'adminHost.error.containNotExist' },
    // 启用管理主机失败
    upFailed: { errorCode: 401907, langKeyword: 'adminHost.error.upFailed' },
    // 停用管理主机失败
    downFailed: { errorCode: 401908, langKeyword: 'adminHost.error.downFailed' },
    // 请输入 IPv4/IPv6 地址
    mustLeastOne: { errorCode: 401909, langKeyword: 'adminHost.error.mustLeastOne' },
    // 管理主机规则应用失败
    enableFailed: { errorCode: 401910, langKeyword: 'adminHost.error.enableFailed' },
};

// 锁定客户端配置 402000+
export const LockerError = {
    // 客户端不存在
    notExisted: { errorCode: 402001, langKeyword: 'locker.error.notExisted' },
    // 解锁客户端失败
    unLockFailed: { errorCode: 402002, langKeyword: 'locker.error.unLockFailed' },
    // 包含不存在的客户端
    containNotExist: { errorCode: 402003, langKeyword: 'locker.error.containNotExist' },
    // 添加锁定客户端失败
    addFailed: { errorCode: 402004, langKeyword: 'locker.error.addFailed' },
};

// 文件上传 402100+
// 402101 token 不正确
// 402102 文件hash错误
// 402103 文件太大
// 402104 文件类型错误
// 402105 文件写入失败
export const UploadError = {
    // 文件上传失败
    uploadFailed: { errorCode: 402100, langKeyword: 'upload.error.uploadFailed' },
    // 请上传正确的文件，后缀名为
    extensionsError: { errorCode: 402106, langKeyword: 'upload.error.extensionsError' },
};

// 租户管理 402200+
export const TenantError = {
    // 租户不存在
    notExisted: { errorCode: 402201, langKeyword: 'tenant.error.notExisted' },
    // 添加租户失败
    addFailed: { errorCode: 402202, langKeyword: 'tenant.error.addFailed' },
    // 修改租户失败
    updateFailed: { errorCode: 402203, langKeyword: 'tenant.error.updateFailed' },
    // 删除租户失败
    deleteFailed: { errorCode: 402204, langKeyword: 'tenant.error.deleteFailed' },
    // 租户已存在
    existed: { errorCode: 402205, langKeyword: 'tenant.error.existed' },
};
