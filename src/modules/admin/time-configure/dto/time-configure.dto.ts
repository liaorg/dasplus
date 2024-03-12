// https://www.tw.3822808.com/baike-%E6%97%B6%E5%8C%BA%E5%88%97%E8%A1%A8

/**
 * 时区
 */
export enum TimezoneEnum {
    // UTC+8中国时间
    china = 'Asia/Shanghai',
    // UTC+0世界标准时间
    worldStandard = 'Europe/London',
}

export const Timezone = {
    'Asia/Shanghai': 'UTC +08:00 中国时间',
    'Europe/London': 'UTC +00:00 世界标准时间',
};

export const TimezoneArr: string[] = ['Asia/Shanghai', 'Europe/London'];

/**
 * 同步时间源
 * 0不同步，1从网络同步，2从数据库同步
 */
export enum AsyncTypeEnum {
    unasync = 0,
    asyncNet = 1,
    asyncOracle = 2,
}

export class TimeConfigureDto {
    /**
     * 时区设置
     * @example Asia/Shanghai
     */
    timezone?: TimezoneEnum;
    /**
     * 同步方式 0不同步，1从网络同步，2从数据库同步
     * @example 0
     */
    asyncType?: number;
    /**
     * 服务器当前时间
     * @example 2022-12-12 11:45:48
     */
    dateTime?: string;
    /**
     * NTP服务地址 - IP或域名
     * @example time.edu.cn
     */
    ntpIpOrDomain?: string;
    /**
     * Oracle服务器IP
     * @example 10.5.88.99
     */
    orcleIp?: string;
    /**
     * NOracle端口
     * @example 1521
     */
    orclePort?: number;
    /**
     * Oracle用户名
     * @example test
     */
    orcleUsername?: string;
    /**
     * Oracle密码
     * @example test
     */
    orclePassword?: string;
    /**
     * Oracle实例名
     * @example test
     */
    orcleInstanceName?: string;
}
