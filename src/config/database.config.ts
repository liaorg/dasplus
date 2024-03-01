import { registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

// 连接属性
interface MongodbConnectInterface {
    host?: string;
    port?: string;
    user?: string;
    pass?: string;
    dbName?: string;
}

// https://mongoosejs.com/docs/guide.html
// https://docs.nestjs.com/techniques/mongodb
/**
 * 创建 mongodb 连接
 * @param param
 * @returns
 */
const createMongodbConfig = (param: MongodbConnectInterface): MongooseModuleOptions => {
    const host = param.host || '127.0.0.1';
    const port = param.port || '27017';
    // @=>%40  :=>%3A
    const user = param.user ? encodeURIComponent(param.user) : '';
    const pass = param.pass ? encodeURIComponent(param.pass) : '';
    let userPass = '';
    if (user && pass) {
        userPass = `${user}:${pass}`;
    }
    return {
        uri: `mongodb://${userPass}@${host}:${port}/${param.dbName}?authMechanism=SCRAM-SHA-1&authSource=admin`,
        // user,
        // pass,
        // // 连接数据库
        // dbName: param.dbName,
        // // 用户权限数据库
        // authSource: 'admin',
        // authMechanism: 'DEFAULT',
        // 连接超时时间
        connectTimeoutMS: 5000,
        // 延后连接
        lazyConnection: true,
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    };
};

/**
 * 数据库配置
 */
export const mongodbConfig: any = registerAs('mongodbConfig', () => ({
    // 系统管理
    das: createMongodbConfig({
        host: process.env.DB_HOST_DEFAULT,
        port: process.env.DB_PORT_DEFAULT || '12310',
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        dbName: 'das',
    }),
    // 引擎相关
    dbfw: createMongodbConfig({
        host: process.env.DB_HOST_DEFAULT,
        port: process.env.DB_PORT_DEFAULT || '12310',
        user: process.env.DB_USER_ENGINE,
        pass: process.env.DB_PASS_ENGINE,
        dbName: 'dbfw',
    }),
    // 引擎 docker
    engineDbfwConfig: {
        uri: `mongodb://${process.env.DB_ENGINE_HOST}:12301/dbfw?replicaSet=dbfwcfg`,
        // 连接超时时间
        connectTimeoutMS: 5000,
        // 延后连接
        lazyConnection: true,
    },
    engineDbfwLogConfig: {
        uri: `mongodb://${process.env.DB_ENGINE_HOST}:12302/dbfw?replicaSet=dbfwlog`,
        // 连接超时时间
        connectTimeoutMS: 5000,
        // 延后连接
        lazyConnection: true,
    },
}));
