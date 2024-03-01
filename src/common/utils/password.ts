import { bcrypt, bcryptVerify, sm3 } from 'hash-wasm';
import { IDataType } from 'hash-wasm/dist/lib/util';
import { getRandomValues } from 'node:crypto';

// const randomBytesAsync = promisify(randomBytes);
/**
 * 生成随机字符串
 * @param byte
 * @returns
 */
export const randomString = async (byte = 16) => {
    const salt = new Uint8Array(byte);
    getRandomValues(salt);
    const buffer = Buffer.from(salt);
    return buffer.toString('hex');
};

/**
 * 生成随机字符串-同步
 * @param byte
 * @returns
 */
export const randomStringSync = (byte = 16) => {
    const salt = new Uint8Array(byte);
    getRandomValues(salt);
    const buffer = Buffer.from(salt);
    return buffer.toString('hex');
};

/**
 * 生成密码
 * @param password
 * @param salt
 * @returns
 */
export const createPassword = async (password: string, salt?: Uint8Array) => {
    // 加密密码
    let saltNew: IDataType;
    if (salt) {
        saltNew = salt;
    } else {
        // 16 字节 128 位
        saltNew = new Uint8Array(16);
        getRandomValues(saltNew);
    }
    const key = await bcrypt({
        password,
        salt: saltNew,
        costFactor: 12,
        outputType: 'encoded',
    });
    return key;
};

/**
 * 比较用户密码
 * @param target
 * @param source
 * @param salt
 * @returns
 */
export const compareUserPasswrod = async (target: string, source: string) => {
    const isValid = await bcryptVerify({
        password: target,
        hash: source,
    });
    return isValid;
};

/**
 * 生成密码 sm3
 * @param password
 * @param salt
 * @returns
 */
export const createSm3Password = async (password: string, salt: string) => {
    return sm3(password + salt);
};
