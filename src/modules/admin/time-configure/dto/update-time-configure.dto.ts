import { RequestValidationSchema } from '@/common/decorators';
import { updateTimeConfigureSchema } from '../schemas';
import { TimezoneEnum } from './time-configure.dto';

// 参数验证
@RequestValidationSchema(updateTimeConfigureSchema)
export class UpdateTimeConfigureDto {
    /**
     * 日期时间 - 本机时间 - 手动同步
     * @example '2023-02-13 11:45:48'
     */
    dateTime?: string;
    /**
     * 时区设置
     * @example Asia/Shanghai
     */
    timezone?: TimezoneEnum;
    /**
     * 同步时间源 0不同步，1从网络同步，2从数据库同步
     * @example 0
     */
    asyncType?: number;
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
