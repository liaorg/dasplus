import { ApiResult, ApiSecurityAuth } from '@/common/decorators';
import { OperateLogEnum } from '@/common/enum';
import { DecryptPasswordInterceptor } from '@/common/interceptors/decrypt-password.interceptor';
import { hasChangeWith, sm4Encrypt, success, toNumber } from '@/common/utils';
import { appConfig } from '@/config';
import { ConfigTypeEnum } from '@/modules/core/system-configure/enum';
import { SystemConfigureService } from '@/modules/core/system-configure/system-configure.service';
import { Body, Controller, Get, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AsyncTypeEnum, TimeConfigureDto, TimezoneEnum, UpdateTimeConfigureDto } from './dto';
import { UpdateTimeDto } from './dto/update-time.dto';
import { TimeConfigureService } from './time-configure.service';

@ApiTags('系统配置-时间配置')
@ApiSecurityAuth()
@Controller('time-configure')
export class TimeConfigureController {
    // 配置类型为 1 时间类型
    private configType = ConfigTypeEnum.time;
    private logMoudle = 'configure.time.module';
    private logType = OperateLogEnum.systemAdmin;
    constructor(
        private readonly service: TimeConfigureService,
        private readonly systemConfigureService: SystemConfigureService,
    ) {}

    @ApiOperation({ summary: '获取时间配置信息' })
    @ApiResult({ type: TimeConfigureDto })
    @Get()
    async findOne() {
        const timeConfigure = await this.service.getTimeConfigure();
        timeConfigure.orclePassword = undefined;
        return timeConfigure;
    }

    @ApiOperation({ summary: '保存时间配置' })
    @ApiResult({ type: TimeConfigureDto })
    // 密码解密
    @UseInterceptors(DecryptPasswordInterceptor)
    @Patch()
    async updateTimeConfigure(@Body() update: UpdateTimeConfigureDto, @I18n() i18n: I18nContext) {
        update.asyncType = toNumber(update.asyncType);
        const { timezone, dateTime } = update;
        if (!timezone) {
            update.timezone = TimezoneEnum.china;
        }
        if (update.orclePassword) {
            // 加密存储密码
            update.orclePassword = await sm4Encrypt(
                update.orclePassword,
                appConfig().sm4.key,
                appConfig().sm4.iv,
            );
        }
        const withKey = [
            'timezone',
            'asyncType',
            'ntpIpOrDomain',
            'orcleIp',
            'orclePort',
            'orcleUsername',
            'orclePassword',
            'orcleInstanceName',
        ];
        let change = [];
        let target: any = {};
        // 检查时间配置是否存在
        const oldData = await this.systemConfigureService.findOne({ filter: { type: this.configType } });
        if (oldData) {
            oldData.content.asyncType = toNumber(oldData.content.asyncType);
            // 把旧数据中的 null => undefined
            for (const key in oldData.content) {
                if (Object.prototype.hasOwnProperty.call(oldData.content, key)) {
                    if (oldData.content[key] === null) {
                        oldData.content[key] = undefined;
                    }
                }
            }
            // 提取修改内容
            const hasChange = hasChangeWith(withKey, oldData.content, update);
            change = [...hasChange.change];
            target = { ...hasChange.target };
        } else {
            // 添加
            change = [...withKey];
            target = { ...update };
        }
        if (change.length) {
            // 合并提交数据与默认数据
            const data = new TimeConfigureDto();
            data.timezone = TimezoneEnum.china;
            data.asyncType = AsyncTypeEnum.unasync;
            if (oldData) {
                // 更新配置信息
                Object.assign(data, oldData.content, target);
                await this.systemConfigureService.updateConfigure(this.configType, data);
            } else {
                // 添加
                Object.assign(data, target);
                await this.systemConfigureService.create({
                    type: this.configType,
                    content: data,
                });
            }
        }
        // 获取最新配置
        const timeConfigure = await this.service.getTimeConfigure();
        timeConfigure.orclePassword = undefined;
        // 日志
        const log: any = {
            module: this.logMoudle,
            type: this.logType,
            operateDate: Date.now(),
            lanArgs: {},
        };
        if (change.length) {
            log.content = 'configure.time.modify';
            log.lanArgs.content = change.map((value) => i18n.t(`configure.time.log.${value}`)).join();
            const otherContent = [];
            if (change.includes('asyncType') && [0, 1, 2].includes(target.asyncType)) {
                otherContent.push(
                    i18n.t('configure.time.log.changeAsyncType', {
                        args: { content: i18n.t(`configure.time.log.asyncType${target.asyncType}`) },
                    }),
                );
            }
            otherContent.push(
                i18n.t('configure.time.log.changeTime', {
                    args: { content: dateTime || timeConfigure.dateTime },
                }),
            );
            if (otherContent.length) {
                log.lanArgs.other = i18n.t('configure.other', {
                    args: { other: otherContent.join() },
                });
            }
        } else {
            log.content = 'configure.time.update';
            log.lanArgs.content = dateTime || timeConfigure.dateTime;
        }
        // 创建带操作日志信息的返回数据
        return success<TimeConfigureDto>(timeConfigure, log);
    }

    @ApiOperation({ summary: '立即更新/手动同步' })
    @ApiResult({ type: TimeConfigureDto })
    @Post()
    async updateTime(@Body() update: UpdateTimeDto) {
        const { dateTime } = update;
        // 获取最新配置
        const timeConfigure = await this.service.getTimeConfigure();
        // 根据同步方式更新时间
        await this.service.syncDateTime(timeConfigure, dateTime);
        timeConfigure.orclePassword = undefined;
        // 日志
        const log = {
            module: this.logMoudle,
            type: this.logType,
            operateDate: Date.now(),
            content: 'configure.time.update',
            lanArgs: { content: dateTime },
        };
        // 创建带操作日志信息的返回数据
        return success<TimeConfigureDto>(timeConfigure, log);
    }
}
