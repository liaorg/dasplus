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
