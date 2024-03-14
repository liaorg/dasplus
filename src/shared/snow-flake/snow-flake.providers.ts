import { SnowFlakeConfigInterface, SnowFlakeService } from './snow-flake.service';

export const SNOW_FLAKE_DEFAULT_SERVICE = 'SNOW_FLAKE_DEFAULT_SERVICE';
const config: SnowFlakeConfigInterface = {
    // 是否用秒级, QPS是否很高，分库分表时QPS不高可以用秒级
    // true timebits 32, false timebits 41
    isUseSecond: false,
    // 是否要web计算，要web计算时，最大位数53位，否则最大位数为1+63
    // true allbits 53, false allbits 64
    isWebCompute: true,
    // 机器标识工作节点位数
    workerBits: 3n,
    // 工作节点 ID
    workerId: 0n,
    // 数据中心节点位数
    datacenterBits: 0n,
    // 数据中心节点 ID
    datacenterId: 0n,
};
export const snowFlakeProviders = [
    {
        provide: SNOW_FLAKE_DEFAULT_SERVICE,
        useValue: SnowFlakeService.getInstance(config),
    },
];
