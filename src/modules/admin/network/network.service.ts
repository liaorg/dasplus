import { NetworkError } from '@/common/constants';
import { InjectMongooseRepository, MongooseRepository } from '@/common/repository';
import { BaseService, ObjectIdType } from '@/common/services';
import {
    catchAwait,
    copyFile,
    createTempDir,
    eachLine,
    emptyCallback,
    execSh,
    formatBytes,
    netSortByEth,
    netSortByEthMain,
    // readFile,
    toNumber,
    writeFile,
} from '@/common/utils';
import { defaultNetwork } from '@/oem/network';
import { Injectable } from '@nestjs/common';
import { rm } from 'fs/promises';
import { FilterQuery } from 'mongoose';
import { nanoid } from 'nanoid';
import { I18nContext } from 'nestjs-i18n';
import { IFCFG, NetMaskArr, NetMaskObj } from './consts';
import { ElectricPort, FibreOpticalPort } from './consts/network.const';
import {
    BytesDto,
    CreateNetworkDto,
    IfcfgDto,
    IpAddressDto,
    Ipv6AddressDto,
    NetworkDto,
    UpdateNetworkDto,
} from './dto';
import { DeleteIpTypeEnum } from './enums';
import { NetworkException } from './network.exception';
import { Network, NetworkDocument } from './schemas';

@Injectable()
export class NetworkService extends BaseService<Network> {
    private networkPath = '/etc/sysconfig/network-scripts';
    constructor(
        @InjectMongooseRepository(Network.name)
        protected readonly repository: MongooseRepository<Network>,
    ) {
        super(repository);
        // 如果是 docker 容器里
        // readFile('/run/systemd/container')
        //     .then((value) => {
        //         if (value.trim() === 'docker') {
        //             // 使用挂载的路径
        //             this.networkPath = '/var/www/network-scripts';
        //         }
        //     })
        //     .catch(emptyCallback);
    }

    // 获取所有数据
    async findAll(filter?: FilterQuery<NetworkDocument>) {
        const data = await this.find({ filter });
        if (data?.length) {
            return data;
        }
        // 把默认数据写入数据库中
        return await this.insertMany({ doc: defaultNetwork });
    }

    /**
     * 修改监听网卡
     * @param post
     * @returns
     */
    async updateListening(id: ObjectIdType, post: UpdateNetworkDto) {
        const { listening, device } = post;
        const filter = { _id: id };
        if (listening === 1) {
            // 添加监听
            const $addToSet = { listening: { device } };
            return this.updateOne({ filter, doc: { $addToSet } });
        } else {
            // 删除监听
            const $pull = { listening: { device } };
            return this.updateOne({ filter, doc: { $pull } });
        }
    }

    // cat /proc/net/dev 返回结果解释：
    // 从第一行中可以看出这个文件大致分为三部分，分别是：
    // 第一个字段表示接口名称
    // 第二个字段Recevice表示收包
    // 第三个字段Transmit表示发包
    // 下边几行内容相同：
    // 第一个字段(face)：表示接口名称
    // 第二个字段和第十个字段(bytes)：分别表示收到、发送的字节数
    // 第三个字段和第十一个字段(packets)：分别表示收到、发送的正确数据包的数量
    // 第四个字段和第十二个字段(errs)：分别表示收到、发送的错误数据包量
    // 第五个字段和第十三个字段（drop）：分别表示收到、发送丢弃的数据包量
    // 获取网卡信息
    async findInterfaces(i18n: I18nContext) {
        try {
            const [netdev, netinfo] = await Promise.all([
                // 获取网卡流量信息
                execSh('net.sh', ['netflow']),
                // spawnPromise('cat', [this.netdevFile]),
                // 获取网卡设备信息
                execSh('net.sh'),
                // spawnPromise('sh', [`${BIN_PATH}/net.sh`]),
            ]);
            // 解析网卡流量信息
            const flowData = {};
            netdev &&
                netdev.stdout.split('\n').forEach((line) => {
                    const data = line.split(/:\s+/);
                    const device = data[0] ? data[0].trim() : '';
                    if (device && data[1]) {
                        const flow = data[1].split(/\s+/);
                        if (flowData[device]) {
                            flowData[device].push(flow);
                        } else {
                            flowData[device] = [flow];
                        }
                    }
                });
            // 获取网卡信息
            const netData = netinfo.stdout.split(/\n/);
            const networkInfo: NetworkDto[] = [];
            netData.forEach((net) => {
                const netarr = net ? net.trim() : '';
                if (netarr) {
                    const data = net.split('|');
                    const device = data[0] ? data[0].trim() : '';
                    if (device) {
                        const flow = flowData[device] ?? [];
                        networkInfo.push(this.padData(device, data, flow, i18n));
                    }
                }
            });
            // 排序
            // 先按整体排序
            networkInfo.sort(netSortByEth());
            // 再按主网卡排序
            networkInfo.sort(netSortByEthMain());
            return networkInfo;
        } catch (e) {
            const error = {
                ...NetworkError.getFailed,
            };
            throw new NetworkException(error, e);
        }
    }

    // 获取单张网卡信息
    async findInterface(device: string, i18n: I18nContext) {
        try {
            const [netdev, netinfo] = await Promise.all([
                // 获取网卡流量信息
                execSh('net.sh', [device, 'netflow']),
                // execPromise(`cat ${this.netdevFile}|grep ${device}`),
                // 获取网卡设备信息
                execSh('net.sh', [device]),
                // spawnPromise('sh', [`${BIN_PATH}/net.sh`, device]),
            ]);
            const data = netinfo.stdout.split('|');
            // 解析网卡流量信息
            const flowData = {};
            netdev &&
                netdev.stdout.split('\n').forEach((line) => {
                    const data = line.split(/:\s+/);
                    const device = data[0] ? data[0].trim() : '';
                    if (device && data[1]) {
                        const flow = data[1].split(/\s+/);
                        if (flowData[device]) {
                            flowData[device].push(flow);
                        } else {
                            flowData[device] = [flow];
                        }
                    }
                });
            const networkInfo = this.padData(device, data, flowData[device], i18n);
            return networkInfo;
        } catch (e) {
            const error = {
                ...NetworkError.notExisted,
                args: { device },
            };
            throw new NetworkException(error, e);
        }
    }
    // 重组数据
    padData(device: string, data: any[] = [], flow: any[] = [], i18n: I18nContext) {
        const networkInfo: NetworkDto = {
            device,
            name: device,
            mac: '',
            ipv4: new IpAddressDto(),
            ipv6: new Ipv6AddressDto(),
            // 启用状态
            up: false,
            // 连接状态
            running: '',
            // 网口类型
            portType: '',
            // 速率类型
            speedType: '',
            // 网卡负载
            cardLoad: 0,
            // 接收总量
            receviceBytes: new BytesDto(),
            // recevicePackets: new BytesDto(),
            // receviceErrs: new BytesDto(),
            // receviceDrop: new BytesDto(),
            // 发送总量
            transmitBytes: new BytesDto(),
            // transmitPackets: new BytesDto(),
            // transmitErrs: new BytesDto(),
            // transmitDrop: new BytesDto(),
            listening: 0,
            isAdminPort: false,
            isMaintainPort: false,
        };
        let speed = 0;
        if (data.length) {
            let prefix = 0;
            let netmask = '';
            const prefixNum = toNumber(data[2]);
            if (prefixNum) {
                prefix = prefixNum;
                netmask = NetMaskArr[prefixNum];
            } else {
                netmask = data[2];
                prefix = NetMaskArr.indexOf(data[2]);
                prefix = prefix === -1 ? 16 : prefix;
            }
            networkInfo.ipv4 = {
                address: data[1],
                netmask: netmask,
                netmaskInt: prefix,
            };
            networkInfo.ipv6 = {
                address: data[3],
                prefixlen: toNumber(data[4], 64),
            };
            // 网关
            networkInfo.ipv4.gateway = data[5];
            networkInfo.ipv6.gateway = data[6];

            networkInfo.mac = data[7];
            // 启用状态
            networkInfo.up = data[8]?.includes('UP') ? true : false;
            // 连接状态
            networkInfo.running = data[8]?.includes('RUNNING')
                ? i18n.t('network.running.yes')
                : i18n.t('network.running.no');
            // 速率类型
            speed = parseInt(data[9]);
            if (speed === 10000) {
                networkInfo.speedType = i18n.t('network.speed.tenThousand');
            } else if (speed === 100) {
                networkInfo.speedType = i18n.t('network.speed.hundred');
            } else {
                networkInfo.speedType = i18n.t('network.speed.thousand');
            }
            // 网口类型 Twisted 电口；FIBRE 光口；Other 光口；mii 电口
            const portType = data[10].toLocaleLowerCase();
            if (ElectricPort.includes(portType)) {
                networkInfo.portType = i18n.t('network.electricPort');
            } else if (FibreOpticalPort.includes(portType)) {
                networkInfo.portType = i18n.t('network.fibreOpticalPort');
            }
        }
        if (flow.length) {
            // 接收总量
            const receviceBytes = flow[1][0] - flow[0][0];
            networkInfo.receviceBytes.bytes = toNumber(flow[1][0]);
            networkInfo.receviceBytes.format = formatBytes(flow[1][0], true);
            // networkInfo.recevicePackets.bytes = toNumber(flow[1]);
            // networkInfo.recevicePackets.format = formatBytes(flow[1]);
            // networkInfo.receviceErrs.bytes = toNumber(flow[2]);
            // networkInfo.receviceErrs.format = formatBytes(flow[2]);
            // networkInfo.receviceDrop.bytes = toNumber(flow[3]);
            // networkInfo.receviceDrop.format = formatBytes(flow[3]);
            // 发送总量
            const transmitBytes = flow[1][8] - flow[0][8];
            networkInfo.transmitBytes.bytes = toNumber(flow[1][8]);
            networkInfo.transmitBytes.format = formatBytes(flow[1][8], true);
            // networkInfo.transmitPackets.bytes = toNumber(flow[9]);
            // networkInfo.transmitPackets.format = formatBytes(flow[9]);
            // networkInfo.transmitErrs.bytes = toNumber(flow[10]);
            // networkInfo.transmitErrs.format = formatBytes(flow[10]);
            // networkInfo.transmitDrop.bytes = toNumber(flow[11]);
            // networkInfo.transmitDrop.format = formatBytes(flow[11]);
            // 负载 = 流率/带宽(流率=输入流率+输出流率)
            // 流量单位 Gbps Mbps等
            // 1Gbps=1Gb/s 1GBps=8Gb/s
            const bytes = (receviceBytes + transmitBytes) * 8;
            let load = 0;
            if (speed === 10000) {
                load = bytes / (1000 * 1000 * 1000 * 10);
            } else if (speed === 100) {
                load = bytes / (1000 * 1000 * 100);
            } else {
                load = bytes / (1000 * 1000 * 1000);
            }
            load *= 100;
            networkInfo.cardLoad = Number(load.toFixed(2));
        }
        return networkInfo;
    }

    // 获取网卡IP信息
    async findIpInfo(device: string) {
        try {
            const netinfo = await execSh('net.sh', [device, 'ip']);
            // const netinfo = await spawnPromise('sh', [`${BIN_PATH}/net.sh`, device, 'ip']);
            const data = netinfo.stdout.split('|');
            const networkInfo = {
                device,
                mac: data[7],
                ipv4: new IpAddressDto(),
                ipv6: new Ipv6AddressDto(),
                up: 'down',
                running: 'no',
            };
            let prefix = 0;
            let netmask = '';
            const prefixNum = toNumber(data[2]);
            if (prefixNum) {
                prefix = prefixNum;
                netmask = NetMaskArr[prefixNum];
            } else {
                netmask = data[2];
                prefix = NetMaskArr.indexOf(data[2]);
                prefix = prefix === -1 ? 16 : prefix;
            }
            networkInfo.ipv4 = {
                address: data[1],
                netmask: netmask,
                netmaskInt: prefix,
            };
            networkInfo.ipv6 = {
                address: data[3],
                prefixlen: toNumber(data[4], 64),
            };
            networkInfo.ipv4.gateway = data[5];
            networkInfo.ipv6.gateway = data[6];
            if (data[8]?.includes('UP')) {
                networkInfo.up = 'up';
            }
            if (data[8]?.includes('RUNNING')) {
                networkInfo.running = 'yes';
            }
            return networkInfo;
        } catch (e) {
            const error = {
                ...NetworkError.notExisted,
                args: { device },
            };
            throw new NetworkException(error, e);
        }
    }

    // 添加ip生效
    async applyAdd(device: string, post: CreateNetworkDto) {
        return this.apply(device, post, 'add');
    }
    // 删除ip生效
    async applyDelete(device: string, type: DeleteIpTypeEnum) {
        return this.apply(device, undefined, 'delete', type);
    }
    // 使配置生效
    private async apply(device: string, post?: CreateNetworkDto, action = 'add', type = '') {
        // 构造网卡数据
        const data = new IfcfgDto();
        data.DEVICE = device;
        // data.NAME = network?.name;
        // data.HWADDR = ipinfo?.mac;
        data.TYPE = IFCFG.TYPE;
        data.BOOTPROTO = IFCFG.BOOTPROTO;
        data.ONBOOT = IFCFG.ONBOOT;
        data.USERCTL = IFCFG.USERCTL;
        data.PEERDNS = IFCFG.PEERDNS;
        data.IPV6INIT = IFCFG.IPV6INIT;
        data.IPV6_AUTOCONF = IFCFG.IPV6_AUTOCONF;
        data.IPV6_FAILURE_FATAL = IFCFG.IPV6_FAILURE_FATAL;
        // 获取旧网卡文件信息
        const ifcfgFile = `${this.networkPath}/ifcfg-${device}`;
        try {
            await eachLine(ifcfgFile, (line) => {
                const value = line.replace('"', '').split('=');
                data[value[0]] = value[1];
            });
        } catch (error) {}

        if (action === 'add') {
            if (post?.ipv4?.address) {
                data.IPADDR = post.ipv4.address;
                data.NETMASK = post.ipv4.netmask;
                if (!data.NETMASK) {
                    data.NETMASK = IFCFG.NETMASK;
                }
                data.PREFIX = NetMaskObj[data.NETMASK];
                if (post.ipv4.gateway) {
                    data.GATEWAY = post.ipv4.gateway;
                }
            }

            if (post?.ipv6?.address) {
                data.IPV6ADDR = post.ipv6.address;
                data.PREFIXLEN = String(post.ipv6.prefixlen);
                if (data.IPV6ADDR) {
                    data.IPV6INIT = 'yes';
                    data.IPV6_AUTOCONF = 'yes';
                    if (!data.PREFIXLEN) {
                        data.PREFIXLEN = IFCFG.PREFIXLEN;
                    }
                }
                if (data.PREFIXLEN) {
                    data.IPV6ADDR = data.IPV6ADDR + '/' + data.PREFIXLEN;
                }
                if (post.ipv6.gateway) {
                    data.IPV6_DEFAULTGW = post.ipv6.gateway;
                }
            }
        }
        if (action === 'delete') {
            // 删除 ipv4
            if (type === 'ipv4') {
                data.IPADDR = '';
                data.NETMASK = '';
                data.PREFIX = '';
                data.GATEWAY = '';
            }
            // 删除 ipv6
            if (type === 'ipv6') {
                data.IPV6ADDR = '';
                data.PREFIXLEN = '';
                data.IPV6_DEFAULTGW = '';
            }
            // 全部删除
            if (type === 'all') {
                data.IPADDR = '';
                data.NETMASK = '';
                data.PREFIX = '';
                data.GATEWAY = '';
                data.IPV6ADDR = '';
                data.PREFIXLEN = '';
                data.IPV6_DEFAULTGW = '';
            }
        }
        // 拼接成 ifcfg 字符串
        let ifcfgStr = '';
        for (const key in data) {
            const value = data[key] ?? '';
            ifcfgStr += `${key}=${value}\n`;
        }
        const [createErr, dir] = await catchAwait(createTempDir('/network-scripts'));
        if (createErr) {
            throw createErr;
        }
        const tempFile = `${dir}/ifcfg-${device}` + nanoid();
        try {
            // 判断文件夹是否存在，不存在就创建
            // 创建文件
            const [writeErr] = await catchAwait(writeFile(tempFile, ifcfgStr));
            if (writeErr) {
                throw writeErr;
            }
            // 复制文件
            const [copyErr] = await catchAwait(copyFile(tempFile, ifcfgFile));
            if (copyErr) {
                throw copyErr;
            }
            if (action === 'add') {
                // 重启网卡使 IP 生效
                const [addErr] = await catchAwait(
                    execSh('reload-network.sh', [device]),
                    // spawnPromise('sh', [`${BIN_PATH}/reload-network.sh`, device]),
                );
                if (addErr) {
                    throw addErr;
                }
            } else if (action === 'delete') {
                // 删除IP
                const [delErr] = await catchAwait(
                    execSh('delete-ip.sh', [device, type]),
                    // spawnPromise('sh', [`${BIN_PATH}/delete-ip.sh`, device, type]),
                );
                if (delErr) {
                    throw delErr;
                }
            }
            return true;
        } catch (e) {
            if (action === 'add') {
                const error = {
                    ...NetworkError.setIpFailed,
                };
                throw new NetworkException(error, e);
            } else if (action === 'delete') {
                const error = {
                    ...NetworkError.deleteFailed,
                };
                throw new NetworkException(error, e);
            }
        } finally {
            // 删除临时文件
            rm(tempFile, { recursive: true, force: true }).catch(emptyCallback);
        }
    }

    // 获取网卡状态信息
    async getStatus(device: string) {
        try {
            const status = { up: 'down', running: 'no' };
            const netinfo = await execSh('net.sh', [device, 'status']);
            // const netinfo = await execPromise(`sudo ifconfig ${device}|grep flags=|awk '{print $2}'`);
            if (netinfo.stderr) {
                throw netinfo.stderr;
            }
            if (netinfo.stdout?.includes('UP')) {
                status.up = 'up';
            }
            if (netinfo.stdout?.includes('RUNNING')) {
                status.running = 'yes';
            }
            return status;
        } catch (e) {
            const error = {
                ...NetworkError.notExisted,
                args: { device },
            };
            throw new NetworkException(error, e);
        }
    }
}
