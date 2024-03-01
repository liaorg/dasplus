import { registerAs } from '@nestjs/config';

/**
 * 应用配置
 */
export const appConfig = registerAs('appConfig', () => ({
    // 日志
    logger: {
        level: 'debug',
        maxFiles: 30,
    },
    // 默认显示时的时区
    // 写入时建议不设置时区，即保持UTC0时区，时间统一在应用读取时转换
    timezone: 'Asia/Shanghai',
    timeFormat: 'YYYY-MM-DD HH:mm:ss',
    // 默认语言
    locale: 'zh-cn',
    // ssh 端口
    sshPort: 22,
    // 参数签名密钥
    apiSecretKey: 'c1604f40602d76070e233cc846210e5956e52ccdc8795a0725a7322bff0cc832',
    // 管理页面路由前缀， 注意结尾要加 /
    adminPrefix: 'admin/',
    // jwt 配置
    // header 参数为:
    // authorization: Bearer ''
    // token: ''
    jwt: {
        // 秘钥
        secret: '732cc2cb2871235bc2599b10bfb59012',
        // 过期时间秒 30分钟 = 60 * 30 = 1800
        // 一天 24小时 = 60 * 60 * 24 = 86400
        tokenExpired: 86400,
        refreshSecret: '3f7d293a8168b32750799fef9cc1d275',
        // 30天 = 86400 * 30 = 2592000
        refreshTokenExpired: 2592000,
    },
    // 公钥和私钥
    sm2: {
        publicKey:
            '0421dc7aeb188319034346ed0b685315eb9068e64e479e3cf78a491d6252d1d28c4b24d589ccaef04da472ec69d43c962b7984097b28c4e075848a82fb3b38ce92',
        privateKey: 'a5d037a00ddd22b6f1238a32e8bb7170760a223c300f57cbeb2f426a737b5ac0',
    },
    // 加密向量iv和key
    sm4: {
        iv: 'e349f75d28ed33a214b92262296282c7',
        key: 'a630db5bc49e8e09c54c721d408ec2da',
    },
    // 引擎业务操作配置
    // 页面路由前缀， 注意结尾要加 /
    enginePrefix: 'engine/',
    engine: {
        // 接口基础地址
        baseUrl: process.env.ENGINE_BASEURL,
    },
    // 数据接口配置
    // 页面路由前缀， 注意结尾要加 /
    dataPrefix: 'data/',
    data: {
        // 接口基础地址
        baseUrl: '',
    },
    // 导出文件密码
    exportDefaultPass: '2023@TO.export',
    // 数据归档默认密码
    archiveDefaultPass: 'dBsas_7Zcry123',
}));
