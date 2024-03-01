import dayjs from 'dayjs';
// dayjs 语言包 [https://dayjs.fenxianglu.cn/]
import 'dayjs/locale/en';
import 'dayjs/locale/zh-cn';
// dayjs 插件
import advancedFormat from 'dayjs/plugin/advancedFormat';
// import customParseFormat from 'dayjs/plugin/customParseFormat';
// import dayOfYear from 'dayjs/plugin/dayOfYear';
import localeData from 'dayjs/plugin/localeData';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { appConfig } from '@/config';

dayjs.extend(localeData);
dayjs.extend(utc);
dayjs.extend(timezone);
// 提供更多的格式选项
dayjs.extend(advancedFormat);
// 展示相对的时间
dayjs.extend(relativeTime);
// dayjs.extend(customParseFormat);
// dayjs.extend(dayOfYear);

/** ms为单位的时间 */
export enum TimeMs {
    /** 毫秒 */
    one = 1,
    /** 秒 */
    second = 1000,
    /** 分 */
    minute = second * 60,
    /** 时 */
    hour = minute * 60,
    /** 天 */
    day = hour * 24,
}

export interface TimeOptions {
    // 符合时间格式的时间
    date?: dayjs.ConfigType;
    // 默认语言 zh-cn en
    locale?: string;
    // 时区 Asia/Shanghai Europe/London
    timezone?: string;
    // 严格模式
    strict?: boolean;
}

/**
 * 用于展示时间的对象
 * 用户所在时区或设置的时区 timezone|config.timezone
 * @param options
 * @returns
 */
export const getTime = (options?: TimeOptions) => {
    const config = appConfig();
    if (!options) return dayjs().tz(config.timezone).locale(config.locale);
    const { date, locale, strict, timezone } = options;
    // 每次创建一个新的时间对象
    // 如果没有传入 locale 或 timezone 则使用应用配置
    const now = dayjs(date, undefined, strict).clone();
    return now.tz(timezone ?? config.timezone).locale(locale ?? config.locale);
};

/**
 * 用于存储时间的对象
 * 获取 0 时区的时间，秒
 * @param options
 * @returns
 */
export const getUTCTime = (options?: TimeOptions) => {
    return getTime(options).utc();
};

/**
 * 转换为 Unix时间戳(毫秒)
 */
export const strToMillisecond = (date: dayjs.ConfigType) => {
    return getUTCTime({ date }).valueOf();
};

/**
 * 转换为 Unix时间戳，秒
 */
export const strToTimestamp = (date: dayjs.ConfigType) => {
    return getUTCTime({ date }).unix();
};

/**
 * 获取日期时间
 * @param options date, locale, timezone
 * @param format 'YYYY-MM-DD HH:mm:ss'
 * @returns
 */
export const formatDateTime = (options: TimeOptions, format = 'YYYY-MM-DD HH:mm:ss') => {
    return getTime(options).format(format);
};

/**
 * JS格式化现在距${endTime}的剩余时间
 * @param  {Date} endTime
 * @return {String}
 */

/**
 * 格式化现在距 end 的剩余时间
 * @param end 结束时间
 */
function leftTime(end: number) {
    // 开始时间
    const start = getTime().utc().valueOf();
    // 时间差
    const t = end - start;
    let d = 0,
        h = 0,
        m = 0,
        s = 0;
    if (t <= 0) {
        return '0 秒';
    }
    d = Math.floor(t / TimeMs.day / 1000);
    h = Math.floor((t / TimeMs.hour / 1000) % 24);
    m = Math.floor((t / TimeMs.minute / 1000) % 60);
    s = Math.floor((t / TimeMs.second / 1000) % 60);
    return d + '天 ' + h + '小时 ' + m + '分钟 ' + s + '秒';
}

/**
 * 统一处理开始结束时间，返回字符串时间
 * @param fromTime
 * @param toTime
 * @returns
 */
function handleFromToTime(fromTime: string, toTime: string) {
    let fromtime: string;
    let totime: string;
    if (fromTime && toTime) {
        fromtime = fromTime;
        totime = toTime;
    } else {
        fromtime = dayjs().startOf('d').format('YYYY-MM-DD HH:mm:ss');
        totime = dayjs().endOf('d').format('YYYY-MM-DD HH:mm:ss');
    }
    return { fromtime, totime };
}
/**
 * 统一处理时间范围，返回时间戳秒
 * @param dateTime
 * @returns
 */
function handleDateTime(dateTime: string[]) {
    if (dateTime?.length === 2) {
        const [fromTime, toTime] = dateTime;
        const fromtime = strToTimestamp(fromTime);
        const totime = strToTimestamp(toTime);
        if (fromtime && totime) {
            return { fromtime, totime };
        }
    }
    const fromtime = dayjs().startOf('d').unix();
    const totime = dayjs().endOf('d').unix();
    return { fromtime, totime };
}

/**
 * 格式化时长
 * @param ms 毫秒
 */
export const formatDuration = (ms: number) => {
    if (ms < 0) ms = -ms;
    return {
        day: Math.floor(ms / 86400000),
        hour: Math.floor(ms / 3600000) % 24,
        minute: Math.floor(ms / 60000) % 60,
        second: Math.floor(ms / 1000) % 60,
        millisecond: Math.floor(ms) % 1000,
    };
};

export { dayjs, handleDateTime, handleFromToTime, leftTime };
