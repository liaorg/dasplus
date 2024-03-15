import { SystemConfigureError } from '@/common/constants';
import { genCacheKey } from '@/common/helps';
import { InjectMongooseRepository, MongooseRepository } from '@/common/repository';
import { BaseService } from '@/common/services';
import { ServerPortDto } from '@/modules/admin/security-configure/dto';
import { Injectable } from '@nestjs/common';
import {
    defaultLoginSafety,
    defaultPasswordSafety,
    defaultRemoteDebug,
    defaultTcpPort,
} from './constants';
import { defaultTimeConfigure } from './constants/default-security-configure';
import { CreateSystemConfigureDto, UpdateeSystemConfigureDto } from './dto';
import { ConfigTypeEnum } from './enum';
import { SystemConfigure, SystemConfigureDocument } from './schemas';
import { SystemConfigureException } from './system-configure.exception';

@Injectable()
export class SystemConfigureService extends BaseService<SystemConfigure> {
    constructor(
        @InjectMongooseRepository(SystemConfigure.name)
        protected readonly repository: MongooseRepository<SystemConfigure>,
    ) {
        const cacheKey: string = genCacheKey('SystemConfigure');
        super(repository, cacheKey);
        // 缓存配置
        this.initCache();
    }

    // 获取缓存
    async getCacheData(type?: ConfigTypeEnum[]) {
        const data = await this.getCache();
        return type.length ? data.filter((item) => type.includes(item.type)) : data;
    }

    /**
     * 创建数据
     * @param create
     * @returns Promise<any>
     */
    async create(create: CreateSystemConfigureDto): Promise<SystemConfigureDocument> {
        // 添加
        const data = await this.insert({ doc: create });
        // 更新缓存配置
        await this.initCache();
        return data;
    }

    /**
     * 修改配置
     */
    async updateConfigure(type: ConfigTypeEnum, update: any) {
        let updateData: UpdateeSystemConfigureDto;
        if (type === ConfigTypeEnum.serverPort) {
            // 端口配置单独处理
            updateData = { update_date: Date.now(), content: [...update] };
        } else {
            updateData = { update_date: Date.now(), content: { ...update } };
        }
        const filter = { type };
        const newData = {
            ...updateData,
        };
        const updated = await this.updateOne({ filter, doc: newData });
        if (updated.acknowledged) {
            // 更新缓存配置
            await this.initCache();
            return true;
        }
        // 失败返回 false
        const error = {
            ...SystemConfigureError.updateFailed,
        };
        throw new SystemConfigureException(error);
    }

    /**
     * 获取服务端口和远程调试配置
     * @returns
     */
    async getServerPortAndRemoteDebug() {
        const config = {
            serverPort: {
                tcpPort: [],
                udpPort: [],
            },
            remoteDebug: { ...defaultRemoteDebug },
        };
        try {
            const data = await this.getCacheData([
                ConfigTypeEnum.serverPort,
                ConfigTypeEnum.remoteDebug,
            ]);
            if (data?.length) {
                data.forEach((value) => {
                    if (value.type === ConfigTypeEnum.serverPort) {
                        // 服务端口
                        (value?.content as ServerPortDto[])?.forEach((server) => {
                            if (server.port?.length) {
                                server.port.forEach((p) => {
                                    if (p.status === true) {
                                        config.serverPort[`${server.protocol}Port`]?.push(p.value);
                                    }
                                });
                            }
                        });
                    }
                    if (value.type === ConfigTypeEnum.remoteDebug) {
                        // 远程调试
                        config.remoteDebug = value?.content;
                    }
                });
            }
        } catch (error) {
            //
        }
        if (!config.serverPort.tcpPort?.length) {
            config.serverPort.tcpPort = defaultTcpPort;
        }
        if (!config.remoteDebug?.port?.length) {
            config.remoteDebug.port = defaultRemoteDebug.port;
        }
        return config;
    }

    /**
     * 获取时区，时间配置
     * @returns
     */
    async getTimeConfig() {
        const config = { ...defaultTimeConfigure };
        try {
            const data = await this.getCacheData([ConfigTypeEnum.time]);
            if (data?.length) {
                data.forEach((value) => {
                    if (value.type === ConfigTypeEnum.time) {
                        Object.assign(config, value.content);
                    }
                });
            }
        } catch (error) {
            //
        }
        return config;
    }

    /**
     * 获取登录安全配置
     * @returns
     */
    async getLoginSafety() {
        const config = {
            ...defaultLoginSafety,
        };
        try {
            const data = await this.getCacheData([ConfigTypeEnum.loginSafety]);
            if (data?.length) {
                data.forEach((value) => {
                    if (value.type === ConfigTypeEnum.loginSafety) {
                        Object.assign(config, value.content);
                    }
                });
            }
        } catch (error) {
            //
        }
        return config;
    }
    /**
     * 获取密码安全配置
     * @returns
     */
    async getPasswordSafety() {
        const config = {
            ...defaultPasswordSafety,
        };
        try {
            const data = await this.getCacheData([ConfigTypeEnum.passwordSafety]);
            if (data?.length) {
                data.forEach((value) => {
                    if (value.type === ConfigTypeEnum.passwordSafety) {
                        Object.assign(config, value.content);
                    }
                });
            }
        } catch (error) {
            //
        }
        return config;
    }
}
