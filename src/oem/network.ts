// 默认网卡配置
export const defaultNetwork = [
    {
        // 监听口数组
        listening: [
            {
                // 默认监听口 eth1-1
                device: 'eth1-1',
            },
        ],
        // 网卡列表数组
        info: [
            {
                // 默认管理口 eth0-1
                device: 'eth0-1',
                name: 'eth0-1',
                isAdminPort: true,
                isMaintainPort: false,
                ipv4: {
                    // ipv4地址
                    address: '192.168.0.1',
                    // 子网掩码
                    netmask: '255.255.255.0',
                    // 子网掩码
                    netmaskInt: 24,
                    // 默认网关
                    gateway: '',
                },
                ipv6: {
                    // ipv6地址
                    address: '2023::23',
                    // 前缀长度
                    prefixlen: 64,
                    // 默认网关
                    gateway: '2023::1',
                },
            },
            {
                // 默认检修口 eth0-2
                device: 'eth0-2',
                name: 'eth0-2',
                isAdminPort: false,
                isMaintainPort: true,
                ipv4: {
                    // ipv4地址
                    address: '1.0.0.1',
                    // 子网掩码
                    netmask: '255.255.0.0',
                    // 子网掩码
                    netmaskInt: 16,
                    // 默认网关
                    gateway: '',
                },
                ipv6: {
                    // ipv6地址
                    address: '',
                    // 前缀长度
                    prefixlen: 0,
                    // 默认网关
                    gateway: '',
                },
            },
        ],
    },
];

// 默认网卡配置
export const defaultNetworkSet = [
    {
        // string 网卡接口名
        device: 'eth0-1',
        // boolean 启用状态
        up: true,
        // boolean 连接状态
        running: true,
        // string MAC地址
        mac: '',
        // 接口类型: 电口 electric /光口 optical
        port_type: '',
        // 速率类型 百兆 100 /千兆 1000 /万兆 10000
        speed_type: 1000,
        // 网卡负载
        card_load: 0,
        // number 接收总量
        recevice_bytes: 0,
        // number 接收正确数据包
        recevice_packets: 0,
        // number 接收错误数据包
        recevice_errs: 0,
        // number 接收丢弃数据包
        recevice_drop: 0,
        // number 发送总量
        transmit_bytes: 0,
        // number 发送正确数据包
        transmit_packets: 0,
        // number 发送错误数据包
        transmit_errs: 0,
        // number 发送丢弃数据包
        transmit_drop: 0,
        // ipv4 地址
        ipv4: [
            {
                // string 地址
                address: '192.168.0.1',
                // string 子网掩码
                netmask: '255.255.255.0',
                // number 掩码位
                netmask_int: 24,
                // string 网关
                gateway: '',
                // number 状态：0 失效 | 1 生效 | -1 删除
                status: 1,
            },
        ],
        // ipv6 地址
        ipv6: [
            {
                // string 地址
                address: '2004::24',
                // number 前缀长度
                prefixlen: 64,
                // string 网关
                gateway: '',
                // number 状态：0 失效 | 1 生效 | -1 删除
                status: 1,
            },
        ],
        name: 'eth0-1',
        // boolean 是否检修口
        is_admin_port: false,
        // boolean 是否管理口
        is_maintain_port: true,
        // boolean 监听状态
        listening: false,
    },
    {
        // string 网卡接口名
        device: 'eth0-2',
        // boolean 启用状态
        up: true,
        // boolean 连接状态
        running: true,
        // string MAC地址
        mac: '',
        // 接口类型: 电口 electric /光口 optical
        port_type: '',
        // 速率类型 百兆 100 /千兆 1000 /万兆 10000
        speed_type: 1000,
        // 网卡负载
        card_load: 0,
        // number 接收总量
        recevice_bytes: 0,
        // number 接收正确数据包
        recevice_packets: 0,
        // number 接收错误数据包
        recevice_errs: 0,
        // number 接收丢弃数据包
        recevice_drop: 0,
        // number 发送总量
        transmit_bytes: 0,
        // number 发送正确数据包
        transmit_packets: 0,
        // number 发送错误数据包
        transmit_errs: 0,
        // number 发送丢弃数据包
        transmit_drop: 0,
        // ipv4 地址
        ipv4: [
            {
                // string 地址
                address: '1.0.0.1',
                // string 子网掩码
                netmask: '255.255.255.0',
                // number 掩码位
                netmask_int: 24,
                // string 网关
                gateway: '',
                // number 状态：0 失效 | 1 生效 | -1 删除
                status: 1,
            },
        ],
        // ipv6 地址
        ipv6: [
            {
                // string 地址
                address: '',
                // number 前缀长度
                prefixlen: 64,
                // string 网关
                gateway: '',
                // number 状态：0 失效 | 1 生效 | -1 删除
                status: 0,
            },
        ],
        name: 'eth0-2',
        // boolean 是否检修口
        is_admin_port: true,
        // boolean 是否管理口
        is_maintain_port: false,
        // boolean 监听状态
        listening: false,
    },
];
