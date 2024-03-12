import { SystemConfigureError } from '@/common/constants';
import { InjectMongooseRepository, MongooseRepository } from '@/common/repository';
import { BaseService } from '@/common/services';
import { appConfig } from '@/config';
import { ServerPortDto } from '@/modules/admin/security-configure/dto';
import { Injectable } from '@nestjs/common';
import {
    defaultLoginSafety,
    defaultPasswordSafety,
    defaultRemoteDebug,
    defaultTcpPort,
} from './constants';
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
        super(repository);
    }

    /**
     * 创建数据
     * @param create
     * @returns Promise<any>
     */
    async create(create: CreateSystemConfigureDto): Promise<SystemConfigureDocument> {
        // 添加
        return await this.insert({ doc: create });
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
            const filter = {
                type: {
                    $in: [ConfigTypeEnum.serverPort, ConfigTypeEnum.remoteDebug],
                },
            };
            const data = await this.find({ filter });
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
        const config = { tiemzone: appConfig().timezone };
        try {
            const data = await this.findOne({ filter: { type: ConfigTypeEnum.time } });
            config.tiemzone = data?.content?.timezone;
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
        const filter = { type: ConfigTypeEnum.loginSafety };
        try {
            const data = await this.find({ filter });
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
            const filter = { type: ConfigTypeEnum.passwordSafety };
            const data = await this.find({ filter });
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
