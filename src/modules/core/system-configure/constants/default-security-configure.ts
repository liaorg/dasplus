import { appConfig } from '@/config';
import {
    LoginSafetyDto,
    PasswordSafetyDto,
    RemoteDebugDto,
    ServerPortDto,
} from '@/modules/admin/security-configure/dto';
import { AsyncTypeEnum, TimeConfigureDto, TimezoneEnum } from '@/modules/admin/time-configure/dto';

// 默认时间配置
export const defaultTimeConfigure: TimeConfigureDto = {
    // 时区设置
    timezone: TimezoneEnum.china,
    // 同步方式 0不同步，1从网络同步，2从数据库同步
    asyncType: AsyncTypeEnum.unasync,
};

// 默认登录安全配置
export const defaultLoginSafety: LoginSafetyDto = {
    /**
     * 登录失败次数
     */
    numOfLoginFailedToLocked: 5,
    /**
     * 登录失败锁定时间/分钟
     */
    timeOfLoginFailedToLocked: 30,
    /**
     * 无操作自动注销时间/分钟
     */
    timeOfLogout: 10,
    /**
     * 口令使用期限/天
     */
    timeLimitOfPassword: 7,
    /**
     * 维护提醒周期/天
     */
    timeOfMaintain: 7,
    /**
     * 验证码开关
     */
    statusOfcaptcha: false,
    /**
     * 强制重置密码/账号密码口令过期时是否强制重置
     */
    forceReset: false,
};
// 默认密码安全配置
export const defaultPasswordSafety: PasswordSafetyDto = {
    /**
     * 最短密码长度 8
     */
    minLength: 8,
    /**
     * 密码中允许同一字符连续出现的最大次数
     */
    maxSameLetter: 3,
    /**
     * 小写字母/至少包括一个小写字母
     */
    lowercase: true,
    /**
     * 大写字母/至少包括一个大写字母
     */
    uppercase: false,
    /**
     * 数字/至少包括一个数字
     */
    number: true,
    /**
     * 非数字非字母字符/至少包括一个非数字和非字母的字符
     */
    specialLetter: true,
    /**
     * 弱密码检测
     */
    weakCheck: false,
    /**
     * 不能包含的字符
     */
    excludeWord: [],
};
// 默认端口安全配置
export const defaultTcpPort = [443, 7765, 7766];
export const defaultUdpPort = [161];
export const defaultServerPort: ServerPortDto[] = [
    {
        name: 'WEB',
        protocol: 'tcp',
        port: [
            // { value: 80, status: true, allowChange: false },
            { value: 443, status: true, allowChange: false },
        ],
    },
    {
        name: '流量探针',
        protocol: 'tcp',
        port: [
            { value: 7765, status: true, allowChange: false },
            { value: 7766, status: true, allowChange: false },
        ],
    },
    // {
    //     name: 'ELASTIC',
    //     protocol: 'tcp',
    //     port: [
    //         { value: 9200, status: true, allowChange: false },
    //         { value: 9300, status: true, allowChange: false },
    //     ],
    // },
    {
        name: 'SNMP',
        protocol: 'udp',
        port: [{ value: 161, status: true, allowChange: true }],
    },
    {
        name: 'SSH',
        protocol: 'tcp',
        port: [{ value: appConfig().sshPort, status: true, allowChange: true }],
    },
];
// 默认远程调试配置
export const defaultRemoteDebug: RemoteDebugDto = {
    /**
     * 是否允许远程调试
     */
    status: true,
    /**
     * 远程调试端口
     */
    port: [appConfig().sshPort, 9200, 9300, 12301, 12302, 12310],
};
