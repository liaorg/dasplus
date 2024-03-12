import { SystemConfigureError } from '@/common/constants';
import { emptyCallback, execSh, formatDateTime, sm4Decrypt } from '@/common/utils';
import { appConfig } from '@/config';
import { defaultTimeConfigure } from '@/modules/core/system-configure/constants';
import { ConfigTypeEnum } from '@/modules/core/system-configure/enum';
import { SystemConfigureException } from '@/modules/core/system-configure/system-configure.exception';
import { SystemConfigureService } from '@/modules/core/system-configure/system-configure.service';
import { Injectable } from '@nestjs/common';
import { Connection, getConnection } from 'oracledb';
import { TimeConfigureDto, TimezoneEnum } from './dto';

@Injectable()
export class TimeConfigureService {
    // 配置类型为 1 时间类型
    private configType = ConfigTypeEnum.time;
    constructor(private readonly systemConfigureService: SystemConfigureService) {}
    // 根据同步方式更新时间
    async syncDateTime(oldData: TimeConfigureDto, dateTime: string) {
        if (oldData.asyncType === 1) {
            // 从网络同步
            try {
                const syncRes = await execSh('sync-datetime.sh', ['net', oldData.ntpIpOrDomain]);
                if (syncRes.stderr) {
                    const failedMsg = syncRes?.stderr.trim();
                    const error = {
                        ...SystemConfigureError.updateTimeFailed,
                        args: { failedMsg: `\n${failedMsg}` },
                    };
                    throw new SystemConfigureException(error);
                }
                // await spawnPromise('sudo', ['ntpdate', oldData.ntpIpOrDomain]);
                // // 同步到硬件时钟
                // await spawnPromise('sudo', ['hwclock', '-w']);
                // 服务器当前时间
                oldData.dateTime = this.getNow(oldData.timezone);
                return oldData;
            } catch (e) {
                if (e['stderr']) {
                    const error = {
                        ...SystemConfigureError.updateTimeFailed,
                    };
                    throw new SystemConfigureException(error, e);
                } else {
                    throw e;
                }
            }
        } else if (oldData.asyncType === 2) {
            // 从数据库同步
            let connection: Connection;
            try {
                connection = await getConnection({
                    user: oldData.orcleUsername,
                    // 解密存储密码
                    password: await sm4Decrypt(
                        oldData.orclePassword,
                        appConfig().sm4.key,
                        appConfig().sm4.iv,
                    ),
                    connectionString: `${oldData.orcleIp}:${oldData.orclePort}/${oldData.orcleInstanceName}`,
                });
                const sql = "SELECT TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD HH24:MI:SS') FROM DUAL";
                const result = await connection.execute(sql);
                // 设置时间
                return await this.setLocaleDateTime(oldData, result?.rows[0] as string);
            } catch (error) {
                throw error;
            } finally {
                if (connection) {
                    connection.close().catch(emptyCallback);
                }
            }
        } else if (oldData.asyncType === 0) {
            // 不自动同步
            // 设置本地时间
            return await this.setLocaleDateTime(oldData, dateTime);
        }
        return oldData;
    }

    // 设置本地时间
    async setLocaleDateTime(oldData: TimeConfigureDto, dateTime: string) {
        try {
            const date = await this.toLinuxTime(dateTime);
            await execSh('sync-datetime.sh', ['localtime', date]);
            // await spawnPromise('sudo', ['date', '-s', date]);
            // // 同步到硬件时钟
            // spawnPromise('sudo', ['hwclock', '-w']);
            // 服务器当前时间
            oldData.dateTime = this.getNow(oldData.timezone);
            return oldData;
        } catch (e) {
            if (e['stderr']) {
                const error = {
                    ...SystemConfigureError.updateTimeFailed,
                };
                throw new SystemConfigureException(error, e);
            } else {
                throw e;
            }
        }
    }
    // 获取时间配置信息
    async getTimeConfigure(): Promise<TimeConfigureDto> {
        const data = await this.systemConfigureService.findOne({ filter: { type: this.configType } });
        // 服务器当前时间
        if (data?.content) {
            data.content.dateTime = this.getNow(data.content.timezone);
            return data.content;
        } else {
            const dateTime = this.getNow(defaultTimeConfigure.timezone);
            return { ...defaultTimeConfigure, dateTime };
        }
    }
    // 获取服务器当前时间
    getNow(timezone: string) {
        const timeOpt = { timezone };
        // 服务器当前时间
        return formatDateTime(timeOpt);
    }
    // 获取 linux 系统时区
    async getLinuxTimezone() {
        // centos8
        const data = await execSh('sync-datetime.sh', ['timezone']);
        // const data = await execPromise('timedatectl | grep "Time zone"|awk \'{print $3}\'');
        // ubuntu
        // const data = await execPromise('cat /etc/timezone');
        return data.stdout;
    }
    // 转换成 linux 系统时间
    async toLinuxTime(date: string) {
        const timezone = await this.getLinuxTimezone();
        const timeOpt = { date, timezone: timezone ? timezone.trim() : TimezoneEnum.china };
        return formatDateTime(timeOpt);
    }
}
