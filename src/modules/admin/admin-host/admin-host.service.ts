import { AdminHostError } from '@/common/constants';
import { InjectMongooseRepository, MongooseRepository } from '@/common/repository';
import { BaseService } from '@/common/services';
import { catchAwait, execSh, isEmpty, writeFile } from '@/common/utils';
import { CONF_PATH, appConfig } from '@/config';
import { defaultTcpPort } from '@/modules/core/system-configure/constants';
import { SystemConfigureService } from '@/modules/core/system-configure/system-configure.service';
import { Injectable } from '@nestjs/common';
import { AnyObject } from 'mongoose';
import { IpTypeEnum } from '../network/enums';
import { AdminHostException } from './admin-host.exception';
import { CreateAdminHostDto, UpdateAdminHostDto } from './dto';
import { QueryAdminHostDto } from './dto/query-admin-host.dto';
import { AdminHost } from './schemas';

@Injectable()
export class AdminHostService extends BaseService<AdminHost> {
    private confDir = CONF_PATH;
    constructor(
        @InjectMongooseRepository(AdminHost.name)
        protected readonly repository: MongooseRepository<AdminHost>,
        private readonly systemConfigureService: SystemConfigureService,
    ) {
        super(repository);
        // 如果是 docker 容器里
        // readFile('/run/systemd/container')
        //     .then((value) => {
        //         if (value.trim() === 'docker') {
        //             // 使用挂载的路径
        //             this.confDir = '/var/www/server/conf';
        //         }
        //     })
        //     .catch(emptyCallback);
    }

    /**
     * 创建数据
     * @param create
     * @returns
     */
    async create(create: CreateAdminHostDto) {
        const createData = [];
        if (create.ipv4?.address) {
            // 判断是否已经存在
            await this.hasAddress(create.ipv4.address);
            const temp = new AdminHost();
            temp.type = IpTypeEnum.ipv4;
            temp.address = create.ipv4.address;
            temp.netmask = create.ipv4.netmask;
            temp.mac = create.ipv4.mac;
            temp.status = create.status;
            temp.description = create.description;
            createData.push(temp);
        }
        if (create.ipv6?.address) {
            // 判断是否已经存在
            await this.hasAddress(create.ipv6.address);
            const temp = new AdminHost();
            temp.type = IpTypeEnum.ipv6;
            temp.address = create.ipv6.address;
            temp.prefixlen = create.ipv6.prefixlen;
            temp.mac = create.ipv6.mac;
            temp.status = create.status;
            temp.description = create.description;
            createData.push(temp);
        }
        // 写入数据库
        return this.insertMany({ doc: createData });
    }

    // 获取指定信息
    async findInfo(id: string) {
        const data = await this.findById(id);
        if (isEmpty(data)) {
            const error = {
                ...AdminHostError.notExisted,
                args: { id },
            };
            throw new AdminHostException(error);
        }
        return data;
    }

    // 获取指定信息
    async hasAddress(address: string) {
        const filter = { address };
        const data = await this.findOne({ filter });
        if (!isEmpty(data)) {
            const error = {
                ...AdminHostError.existedAddress,
                args: { address },
            };
            throw new AdminHostException(error);
        }
        return data;
    }
    // 更新数据
    async updateById(id: string, update: UpdateAdminHostDto) {
        if (update.type === 6) {
            update.netmask = null;
        } else if (update.type === 4) {
            update.prefixlen = null;
        }
        if (!update?.mac) {
            update.mac = '';
        }
        update.update_date = Date.now();
        // 更新数据库
        return this.findByIdAndUpdate(id, { doc: update });
    }

    // 删除/批量删除
    async removeByAddress(address: string[]): Promise<any> {
        // 所有必须存在
        await this.mustHasByAddress(address);
        const filter = {
            address: { $in: address },
        };
        const deleted = await this.deleteMany({ filter });
        // 影响行数是否等于传入的 id 数量
        // 有可能只删除少数几条
        if (deleted.deletedCount === address.length) {
            return true;
        }
        // 失败返回 false
        return false;
    }
    // 所有必须存在
    async mustHasByAddress(address: string[]) {
        address = address?.length ? address : [];
        const filter = {
            address: { $in: address },
        };
        const count = await this.countDocuments({ filter });
        if (!count) {
            const error = {
                ...AdminHostError.notExisted,
                args: { id: address?.join() },
            };
            throw new AdminHostException(error);
        } else if (count !== address?.length) {
            const error = {
                ...AdminHostError.containNotExist,
                args: { address: address?.join() },
            };
            throw new AdminHostException(error);
        }
        return count;
    }

    // 更新 iptables
    async refreshIptables() {
        const filter = { status: 1 };
        const [adminHostData, serverPortAndRemoteDebugData] = await Promise.all([
            // 获取启用的管理主机数据
            this.find({ filter }),
            // 获取服务端口和远程调试配置
            this.systemConfigureService.getServerPortAndRemoteDebug(),
        ]);
        const ipv4 = [];
        const ipv6 = [];
        if (adminHostData?.length) {
            adminHostData.forEach((value) => {
                if (value.address) {
                    if (value.type === IpTypeEnum.ipv4) {
                        // ipv4 规则
                        const rule = [`${value.address}/${value.netmask}`];
                        if (value.mac) {
                            rule.push(`-m mac --mac-source ${value.mac}`);
                        }
                        ipv4.push(rule.join(' '));
                    }
                    // ipv6 规则
                    if (value.type === IpTypeEnum.ipv6) {
                        const rule = [`${value.address}/${value.prefixlen}`];
                        if (value.mac) {
                            rule.push(`-m mac --mac-source ${value.mac}`);
                        }
                        ipv6.push(rule.join(' '));
                    }
                }
            });
        }
        // 多加一个，使最后以|结尾
        ipv4.length && ipv4.push('');
        ipv6.length && ipv6.push('');
        const remoteDebug = serverPortAndRemoteDebugData.remoteDebug.status;
        const debugPort = serverPortAndRemoteDebugData.remoteDebug.port;
        let tcpPort = serverPortAndRemoteDebugData.serverPort.tcpPort;
        if (!!remoteDebug === false) {
            // 远程调试关闭时，要去除 ssh 端口
            tcpPort = tcpPort.filter((item) => item !== appConfig().sshPort);
        }
        if (!tcpPort?.length) {
            tcpPort = defaultTcpPort;
        }
        const udpPort = serverPortAndRemoteDebugData.serverPort.udpPort;
        const iptables = `ipv4="${ipv4.join('|')}"\nipv6="${ipv6.join(
            '|',
        )}"\nremoteDebug="${remoteDebug}"\ndebugPort="${debugPort.join()}"\ntcpPort="${tcpPort.join()}"\nudpPort="${udpPort.join()}"`;
        // 写入文件
        const file = `${this.confDir}/iptables.conf`;
        const [err] = await catchAwait(writeFile(file, iptables));
        if (err) {
            const error = {
                ...AdminHostError.enableFailed,
            };
            throw new AdminHostException(error);
        }
        // 执行文件
        const [errSh] = await catchAwait(execSh('iptables.sh'));
        if (errSh) {
            const error = {
                ...AdminHostError.enableFailed,
            };
            throw new AdminHostException(error);
        }
        // spawnPromise('sh', [`${BIN_PATH}/iptables.sh`]);
    }

    // 生成查询条件
    createQueryWhere(post: QueryAdminHostDto) {
        const { address, status, mac, description } = post;
        const where: AnyObject = {};
        // IP地址
        if (address) {
            where.address = { $regex: address, $options: 'i' };
        }
        // 状态
        if (status !== -1) {
            where.status = status;
        }
        // MAC地址
        if (mac) {
            where.mac = { $regex: mac, $options: 'i' };
        }
        // 描述
        if (description) {
            where.description = { $regex: description, $options: 'i' };
        }
        return where;
    }
}
