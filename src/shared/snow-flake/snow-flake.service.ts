/**
 * 根据 Twitter 的 snowflake 在分布式生成唯一 UUID 算法改变
 * Twitter 的 snowflake
 *  生成的数值是 64 位，分成 4 个部分：
 *  0           41     51     64
 *  A-|--------------------B--------------------------|-------C-------|------D------|
 *  +-----------+------+------+
 *  |time       |pc    |inc   |
 *  +-----------+------+------+
 * A区：1位标识，由于long基本类型在Java中是带符号的，最高位是符号位，正数是0，负数是1，所以id一般是正数，最高位是0
 * B区：41位时间截(毫秒级)，注意，41位时间截不是存储当前时间的时间截，而是存储时间截的差值（当前时间截 - 开始时间截)得到的值，
 *      这里的的开始时间截，一般是我们的id生成器开始使用的时间，由我们程序来指定的（如下下面程序IdWorker类的startTime属性）。41位的时间截，可以使用69年，
 *      年T = (1n << 41n) / (1000n * 60n * 60n * 24n * 365n) = 69n
 * C区：10位的数据机器位，可以部署在1024个节点，包括5位datacenterId和5位workerId（2^5 * 2^5 = 1024）
 * D区：12位序列，毫秒内的计数，12位 的计数顺序号支持每个节点每毫秒(同一机器，同一时间截)产生4096个ID序号（2^12=4096）
 * 加起来刚好64位，为一个Long型。
 *  
 *  算法采用最高位为 0 表示正数加上 41bit毫秒时间戳
 *  加上10bit机器ID，加上12bit序列号，理论上最多支持1024台机器每秒生成4096000个序列号
 * 
 *  算法改变:
 *  53bitID由32bit秒级时间戳+5bit机器标识组成+16bit自增，累积32台机器，每秒可以生成6.5万个序列号
 *  53bit：由于JavaScript支持的最大整型就是53位，超过这个位数，JavaScript将丢失精度
 *  QPS不高时可以用秒级：避免出现分库分表时数据分配不均
 *  随机自增：生成的序列号的起始号可以做一下随机，这样就会尽量的均衡了
 *  对于时间回拨的问题可以在启动服务的时候判断一下时间是否正确
 *  生成的数值是 53 位，分成 3 个部分：
 * |--------|--------|--------|--------|--------|--------|--------|--------|
 * |00000000|00011111|11111111|11111111|11111111|11111111|11111111|11111111|
 * |--------|---xxxxx|xxxxxxxx|xxxxxxxx|xxxxxxxx|xxx-----|--------|--------|
 * |--------|--------|--------|--------|--------|---xxxxx|--------|--------|
 * |--------|--------|--------|--------|--------|--------|xxxxxxxx|xxxxxxxx|
 *
 *  ● 第一部分 32 个 bit 用于记录生成 ID 时候的时间戳，单位为秒，
 *           所以该部分表示的数值范围为 2^32 - 1 = 4294967295 ，它是相对于某一时间的偏移量
 *  ● 第二部分的 5(WorkerId 机器标识) 个 bit 表示工作节点的 ID
 *            表示数值范围为 2^5 - 1 = 31，相当于支持 31 个节点
 *  ● 第三部分 16 个 bit 表示每个工作节点每秒生成的循环自增 id，最多可以生成 2^16 - 1 = 65535 个 id，
 *           超出归零等待下一秒重新自增
 *
 * 9007199254740991
 * Maximum ID = 11111_11111111_11111111_11111111_11111111_11111111_11111111
 *
 * Maximum TS = 11111_11111111_11111111_11111111_111 32bit秒级时间戳
 * Maximum TS = 11111_11111111_11111111_11111111_11111111_1111 41bit豪秒级时间戳
 * 
 * Maximum SH = ----- -------- -------- -------- -------- -------- -------- = 0 1bit机器标识
 *
 * Maximum NT = ----- -------- -------- -------- -------- ----1111 11111111 = 4095 12bit自增
 * Maximum NT = ----- -------- -------- -------- -------- 11111111 11111111 = 65535 16bit自增
 *
 * It can generate 64k unique id per IP and up to 2155-09-28 23:15:35.
 * 使用年限 = 最大时间4294967295 + 起始时间1566463640
 * 
 * // 可配置
 * epochStr-起始时间2023-06-02 00:00:00
 * isUseSecond-是否用秒级 false
 * isWebCompute-是否要web计算 false
 * datacenterId-数据中心节点部分ID 0
 * workerId-工作节点ID 0
 *  try {
        const config = {
            'epochStr': '2023-06-02 00:00:00',
            'isUseSecond': false, // true timebits 32,  false allbits 41
            'isWebCompute': true, // true allbits 53, false allbits 64
            'datacenterId': 0,
            'workerId': 1,
        };
        const uidTool = new SnowFlakeService(config);
        const id = uidTool->nextId();
        const idInfo = uidTool->decode(id);
    } catch(e) {
    }

 * 注入服务 @Inject(SNOW_FLAKE_DEFAULT_SERVICE) private readonly snowFlakeService: SnowFlakeService,
 * 使用： const id = this.snowFlakeService->nextId();
 */

import { Logger, Injectable } from '@nestjs/common';

//  已经使用到 workerId: 2n,
// 参数
export interface SnowFlakeConfigInterface {
    // 是否用秒级, QPS是否很高，分库分表时QPS不高可以用秒级
    // true timebits 32, false timebits 41
    isUseSecond?: boolean;
    // 是否要web计算，要web计算时，最大位数53位，否则最大位数为1+63
    // true allbits 53, false allbits 64
    isWebCompute?: boolean;
    // 机器标识工作节点位数
    workerBits?: number | bigint;
    // 工作节点 ID
    workerId?: number | bigint;
    // 数据中心节点位数
    datacenterBits?: number | bigint;
    // 数据中心节点 ID
    datacenterId?: number | bigint;
}

@Injectable()
export class SnowFlakeService {
    // 1. 本类内部创建对象实例化
    private static instance: SnowFlakeService = null;
    private readonly logger = new Logger('SnowFlakeService');
    /**
     * @desc 是否分库分表
     * @var bool
     */
    protected isSubData = false;
    /**
     * @desc 是否用秒级 true timebits 32,  false timebits 41
     *       QPS是否很高，分库分表时QPS不高可以用秒级
     * @var bool
     */
    protected isUseSecond = false;
    /**
     * @desc 是否要web计算，要web计算时，最大位数53位，否则最大位数为1+63
     *       true allbits 53, false allbits 64
     * @var bool
     */
    protected isWebCompute = false;
    /**
     * @desc 符号位数 1
     * @var integer
     */
    protected signBits = 1n;
    /**
     * @desc 最大位数 64
     * @var integer
     */
    protected totalBits = 64n;
    /**
     * @desc 起始时间戳，秒/毫秒，默认为秒
     *       1685710624.534 2023-06-02 20:57:04.534
     *       这个时间距离现在时间越久，产生的 ID 越大
     *       一旦投入使用就不能再更改
     * @var integer
     */
    protected timestamp = 1685710624534n;
    protected secondTimestamp = 1685710624n;

    /**
     * @desc 时间位数
     * @var integer
     */
    protected timestampBits = 41n;
    /**
     * @desc 时间最大数
     * @var integer
     */
    protected timestampMax: bigint;

    /**
     * @desc 时间戳部分左偏移量
     *       datacenterBits + workerBits + sequenceBits
     * @var integer
     */
    protected timeShift: bigint;

    /**
     * @desc 数据中心节点部分 0 位
     * @var integer
     */
    protected datacenterBits = 0n;
    /**
     * @desc 节点最大数值 -1n ^ (-1n << this.datacenterBits)
     * @var integer
     */
    protected datacenterMax: bigint;
    /**
     * @desc 节点部分左偏移量
     *        workerBits + sequenceBits
     * @var integer
     */
    protected datacenterShift = 0n;

    /**
     * @desc 机器标识工作节点部分 5 位
     * @var integer
     */
    protected workerBits = 5n;
    /**
     * @desc 节点最大数值 -1n ^ (-1n << this.workerBits)
     * @var integer
     */
    protected workerMax = 31n;
    /**
     * @desc 节点部分左偏移量
     * @var integer
     */
    protected workerShift: bigint;

    /**
     * @desc 序号部分 17 位
     * @var integer
     */
    protected sequenceBits = 17n;
    /**
     * @desc 序号最大值 -1n ^ (-1n << this.sequenceBits)
     *      -1 的二进制表示为 1 的补码,其实等同于: 2 的 n 次方 - 1
     * @var integer
     */
    protected sequenceMax = 131071n;

    /**
     * @desc 上次 ID 生成时间戳
     * @var integer
     */
    protected lastTimestamp = 0n;
    /**
     * @desc 序号
     * @var integer
     */
    protected sequence = 0n;

    /**
     * @desc 数据中心节点 ID
     * @var integer
     */
    protected datacenterId = 0n;
    /**
     * @desc 工作节点 ID
     * @var integer
     */
    protected workerId = 0n;

    // 2. 构造器私有化，外部不能 new
    private constructor(config?: SnowFlakeConfigInterface) {
        // 设置是否用秒级
        if (!this.isUndefined(config?.isUseSecond)) {
            this.setIsUseSecond(config.isUseSecond);
        }
        // 分库分表时QPS不高可以用秒级
        if (this.isUseSecond) {
            this.timestampBits = 32n;
            this.timestamp = this.secondTimestamp;
        }
        if (!this.isUndefined(config?.isWebCompute)) {
            this.setIsWebCompute(config.isWebCompute);
        }
        // 要web计算时，最大位数53位
        if (this.isWebCompute) {
            this.signBits = 0n;
            this.totalBits = 53n;
        }

        // 数据中心节点位数
        this.datacenterBits = (config?.datacenterBits as bigint) ?? this.datacenterBits;
        if (typeof this.datacenterBits !== 'bigint') {
            this.datacenterBits = BigInt(this.datacenterBits);
        }

        // 工作节点位数
        this.workerBits = (config?.workerBits as bigint) ?? this.workerBits;
        if (typeof this.workerBits !== 'bigint') {
            this.workerBits = BigInt(this.workerBits);
        }

        // 设置序号位数
        this.sequenceBits =
            this.totalBits - this.signBits - this.timestampBits - this.datacenterBits - this.workerBits;

        // 所有位数
        const allBits =
            this.signBits +
            this.timestampBits +
            this.datacenterBits +
            this.workerBits +
            this.sequenceBits;
        if (allBits > this.totalBits) {
            const msg = `allocation exceeds ${this.totalBits} bits`;
            this.logger.error(msg);
            throw new Error(msg);
        }

        if (allBits < this.totalBits) {
            const msg = `allocation not enough ${this.totalBits} bits`;
            this.logger.error(msg);
            throw new Error(msg);
        }

        // initialize max value
        // 序号最大值
        this.timestampMax = -1n ^ (-1n << this.timestampBits);
        // 数据中心最大数值
        this.datacenterMax = -1n ^ (-1n << this.datacenterBits);
        // 节点最大数值
        this.workerMax = -1n ^ (-1n << this.workerBits);
        // 序号最大值
        this.sequenceMax = -1n ^ (-1n << this.sequenceBits);

        // 设置数据中心节点
        if (!this.isUndefined(config?.datacenterId)) {
            this.setDatacenterId(config.datacenterId);
        }
        // 设置工作节点
        if (!this.isUndefined(config?.workerId)) {
            this.setWorkerId(config.workerId);
        }

        // initialize shift
        // 时间戳部分左偏移量
        this.timeShift = this.datacenterBits + this.workerBits + this.sequenceBits;
        // 数据中心部分左偏移量
        this.datacenterShift = this.workerBits + this.sequenceBits;
        // 节点部分左偏移量
        this.workerShift = this.sequenceBits;

        // 上次 ID 生成时间戳
        this.lastTimestamp = -1n;
        // 序号
        this.sequence = 0n;
    }
    // 3. 提供一个公有的静态方法，返回实例对象
    public static getInstance(options?: SnowFlakeConfigInterface): SnowFlakeService {
        if (this.instance === null) {
            return new SnowFlakeService(options);
        }
        return this.instance;
    }

    /**
     * 生成 ID
     * @return string | number
     */
    async nextId() {
        const id = this.getId(this.getNow());
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.isWebCompute ? parseInt(id) : id.toString();
    }

    /**
     * 获取 ID 的生成信息 时间 workerId 序号
     * 提取某一位：右移（n-1）位，然后与上1
     * 提取连续位：右移（n-1）位，然后与上m个二进制1
     * @param bigint | number | string id
     * @return object
     */
    async decode(id: bigint | number | string) {
        if (typeof id !== 'bigint') {
            id = BigInt(id);
        }
        // 生成时间
        const sec = id >> this.timeShift;
        const time = sec + this.timestamp;
        const date = this.isUseSecond ? time * 1000n : time;
        // datacenterId
        const datacenterId = (id >> this.datacenterShift) & this.datacenterMax;
        // workerId
        const workerId = (id >> this.workerShift) & this.workerMax;
        // 序号 SEQUENCE
        const sequence = id & this.sequenceMax;

        return {
            totalBits: parseInt(this.totalBits.toString()),
            timestampBits: parseInt(this.timestampBits.toString()),
            datacenterBits: parseInt(this.datacenterBits.toString()),
            datacenterId: parseInt(datacenterId.toString()),
            workerBits: parseInt(this.workerBits.toString()),
            workerId: parseInt(workerId.toString()),
            sequenceBits: parseInt(this.sequenceBits.toString()),
            sequence: parseInt(sequence.toString()),
            time: parseInt(time.toString()),
            date: new Date(parseInt(date.toString())),
        };
    }
    /**
     * 生成 ID
     * @param int timestamp 当前时间
     * @return bigint
     */
    private getId(timestampNow: bigint) {
        if (timestampNow < this.lastTimestamp) {
            // 解决时间回拨的问题
            // warning: clock is turn back:
            this.logger.warn(`Clock is back: ${timestampNow} from previous: ${this.lastTimestamp}`);
            timestampNow = this.lastTimestamp;
        }
        // 如果是同一时间生成的，则进行时间内序列
        if (this.lastTimestamp === timestampNow) {
            /**
             * 按位于操作 对于每一个比特位，只有两个操作数相应的比特位都是1时，结果才为1，否则为0。
             * 假设最开始 this.sequence 为 0 加1后，则为1
             * 结果如下
                00000000 00000000 00000000 00000001 //1的二进制
                00000000 00000000 00001111 11111111 //最终结果2^12  = 4096
          ---------------------------------------------------------------------------
                00000000 00000000 00000000 00000001 //结果1的二进制
             */
            this.sequence = (this.sequence + 1n) & this.sequenceMax;
            // 时间内序列溢出
            if (this.sequence === 0n) {
                // 阻塞到下一个时间,获得新的时间戳
                // this.logger.warn(`maximum id reached in epoch: ${timestampNow}`);
                timestampNow = this.tilNextTime(this.lastTimestamp);
            }
        } else {
            // 重新设置序号
            this.resetSequence();
        }
        // 更新 ID 生时间戳
        this.lastTimestamp = timestampNow;
        // 移位并通过或运算拼到一起组成 64/53 位的 ID
        return this.generateId(timestampNow);
    }
    /**
     * 阻塞到下一个毫秒，直到获得新的时间戳
     * @param lastTimestamp 上次生成ID的时间截
     * @return 当前时间戳
     */
    private tilNextTime(lastTimestamp: bigint) {
        let timestamp = this.getNow();
        while (timestamp <= lastTimestamp) {
            timestamp = this.getNow();
        }
        return timestamp;
    }

    /**
     * 重新设置序号
     */
    private resetSequence() {
        // 要分库分表时随机自增
        this.sequence = this.isSubData ? this.getRandom() : 0n;
    }
    /**
     * 生成ID
     * 移位并通过或运算拼到一起组成 64/53 位的 ID
     * @param bigint timestampNow 当前时间
     * @return bigint
     */
    private generateId(timestampNow: bigint) {
        return (
            ((timestampNow - this.timestamp) << this.timeShift) |
            (this.datacenterId << this.datacenterShift) |
            (this.workerId << this.workerShift) |
            this.sequence
        );
    }

    /**
     * 获取随机数
     * @return bigint
     */
    private getRandom() {
        return BigInt(this.getRandomInt(0, 100));
    }

    /**
     * 获取当前时间戳秒/毫秒数
     * @return bigint
     */
    private getNow() {
        // 返回自1970年1月1日 00:00:00 UTC到当前时间的毫秒数
        const timestamp = Date.now();
        // 分库分表时QPS不高可以用秒级
        return this.isUseSecond ? BigInt(Math.floor(timestamp / 1000)) : BigInt(timestamp);
    }

    /**
     * 设置是否用秒级
     * @param bool isUseSecond false
     */
    private setIsUseSecond(isUseSecond: boolean) {
        this.isUseSecond = !!isUseSecond;
    }
    /**
     * 是否要web计算，要web计算时，最大位数53位
     * @param bool isWebCompute false
     */
    private setIsWebCompute(isWebCompute: boolean) {
        this.isWebCompute = !!isWebCompute;
    }
    /**
     * 设置数据中心 id
     * @param number | bigint datacenterId
     */
    private setDatacenterId(datacenterId: number | bigint) {
        this.datacenterId = datacenterId as bigint;
        if (typeof this.datacenterId !== 'bigint') {
            this.datacenterId = BigInt(this.datacenterId);
        }
        if (this.datacenterId > this.datacenterMax) {
            const msg = `datacenter Id can't be greater than ${this.datacenterMax}`;
            this.logger.error(msg);
            throw new Error(msg);
        }
    }
    /**
     * 设置工作 id
     * @param number | bigint workerId
     */
    private setWorkerId(workerId: number | bigint) {
        this.workerId = workerId as bigint;
        if (typeof this.workerId !== 'bigint') {
            this.workerId = BigInt(this.workerId);
        }
        if (this.workerId > this.workerMax) {
            const msg = `worker Id can't be greater than ${this.workerMax}`;
            this.logger.error(msg);
            throw new Error(msg);
        }
    }

    /**
     * 生成随机整数
     * @param min
     * @param max
     */
    private getRandomInt(min: number, max?: number) {
        let tmp: number;
        max = max ?? min;
        if (min > max) {
            tmp = min;
            min = max;
            max = tmp;
        }
        tmp = max - min + 1;
        return Math.floor(Math.random() * tmp) + min;
    }

    // 是否 undefined
    private isUndefined(o: any) {
        return o === undefined;
    }
}
