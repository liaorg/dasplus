// 登录安全配置
export class LoginSafetyDto {
    /**
     * 登录失败次数锁定次数
     * @example 5
     */
    numOfLoginFailedToLocked: number;
    /**
     * 登录失败锁定时间/分钟
     * @example 30
     */
    timeOfLoginFailedToLocked: number;
    /**
     * 无操作自动注销时间/分钟
     * @example 10
     */
    timeOfLogout: number;
    /**
     * 口令使用期限/天
     * @example 7
     */
    timeLimitOfPassword: number;
    /**
     * 维护提醒周期/天
     * @example 7
     */
    timeOfMaintain: number;
    /**
     * 验证码开关
     * @example false
     */
    statusOfcaptcha: boolean;
    /**
     * 强制重置密码/账号密码口令过期时是否强制重置
     * @example false
     */
    forceReset: boolean;
}
// 密码安全配置
export class PasswordSafetyDto {
    /**
     * 最短密码长度 8
     * @example 8
     */
    minLength: number;
    /**
     * 密码中允许同一字符连续出现的最大次数
     * @example 3
     */
    maxSameLetter: number;
    /**
     * 小写字母/至少包括一个小写字母
     * @example true
     */
    lowercase: boolean;
    /**
     * 大写字母/至少包括一个大写字母
     * @example false
     */
    uppercase: boolean;
    /**
     * 数字/至少包括一个数字
     * @example true
     */
    number: boolean;
    /**
     * 非数字非字母字符/至少包括一个非数字和非字母的字符
     * @example false
     */
    specialLetter: boolean;
    /**
     * 弱密码检测
     * @example false
     */
    weakCheck: boolean;
    /**
     * 不能包含的字符
     * @example ['das', 'sas']
     */
    excludeWord: string[];
}

export class PortStatusDto {
    /**
     * 端口号
     * @example 22
     */
    value: number;
    /**
     * 启停状态 true/false
     * @example true
     */
    status: boolean;
    /**
     * 是否允许修改，只用于显示判断 true/false
     * @example true
     */
    allowChange?: boolean;
}

// 端口安全配置
export class ServerPortDto {
    /**
     * 服务名
     * @example SSH
     */
    name: string;
    /**
     * 协议类型
     * @example tcp
     */
    protocol: string;
    /**
     * 端口号
     */
    port: PortStatusDto[];
}

export class RemoteDebugDto {
    /**
     * 是否允许远程调试
     */
    status: boolean;
    /**
     * 远程调试端口
     */
    port?: number[];
}

export class SecurityConfigureDto {
    /**
     * 登录安全配置
     */
    loginSafety: LoginSafetyDto;
    /**
     * 密码安全配置
     */
    passwordSafety: PasswordSafetyDto;
    /**
     * 端口安全配置
     */
    serverPort: ServerPortDto[];
    /**
     * 远程调试配置
     */
    remoteDebug: RemoteDebugDto;
}
