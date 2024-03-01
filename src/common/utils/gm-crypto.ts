/**
 * 国密加密
 * https://github.com/byte-fe/gm-crypto
 * https://github.com/Daninet/hash-wasm/blob/master/lib/sm3.ts
 * 发送端，一般都是用SM4对数据内容加密，使用SM3对内容进行摘要，再使用SM2对摘要进行签名
 * 接收端，先用SM2，对摘要进行验签，验签成功后，就做到了防抵赖
 * 对发送过来的内容进行SM3摘要，看下生成的摘要和验签后的摘要是否一致，用于防篡改
 *
 * 公钥密码算法 sm2 非对称加密，主要作用是进行签名、验签和加解密对称密钥
 * 杂凑摘要算法 sm3 主要作用数据摘要的生成
 * 分组密码算法 sm4 对称加密，主要作用对数据内容加密
 * sm4cbc 加密解密
 *
 * await sm2Encrypt(data); 加密字符串
 * await sm2Decrypt(data); 解密字符串
 *
 * await sm4Encrypt(data, key, iv); 加密字符串
 * await sm4Decrypt(data, key, iv); 解密字符串
 *
 * await sm3(data); 加密字符串
 */

import { SM2, SM4 } from 'gm-crypto';

type HexString = string;

/**
 * 字符串到十六进制
 * @param str
 * @returns
 */
export function stringToHex(str: string) {
    const buf = Buffer.from(str, 'utf8');
    return buf.toString('hex');
}

/**
 * 十六进制转换为字符串
 * @param str
 * @returns
 */
export function hexToString(str: string) {
    const buf = Buffer.from(str, 'hex');
    return buf.toString('utf8');
}

// 生成公钥，私钥
// 公钥加密，私钥解密是加解密的过程
// 私钥加密，公钥解密是签名的过程
export const generateSm2Key = async () => {
    // const { publicKey, privateKey } = SM2.generateKeyPair();
    return SM2.generateKeyPair();
};

/**
 * SM2 签名
 * 公钥加密，私钥解密是加解密的过程
 * 私钥加密，公钥解密是签名的过程
 * @param string originalData 加密字符串
 * @return bool|string hex
 */
export const sm2Encrypt = async (originalData: string, key: HexString): Promise<HexString> => {
    return SM2.encrypt(originalData, key, {
        inputEncoding: 'utf8',
        outputEncoding: 'hex',
    });
};

/**
 * SM2 解密
 * 公钥加密，私钥解密是加解密的过程
 * 私钥加密，公钥解密是签名的过程
 * @param HexString encryptedData 解密字符串
 * @return bool|string hex
 */
export const sm2Decrypt = async (encryptedData: HexString, key: HexString): Promise<string> => {
    return SM2.decrypt(encryptedData, key, {
        inputEncoding: 'hex',
        outputEncoding: 'utf8',
    });
};

/**
 * SM3 摘要
 * 改用 hash-wasm
 * import { md5 } from 'hash-wasm';
 * @param string data 加密字符串
 * @return bool|string hex
 */
// export const sm3 = (data: string): HexString => {
//     return SM3.digest(data, 'utf8', 'hex');
// };

/**
 * SM4 sm4cbc 对称加密
 * @param string originalData 加密字符串
 * @param string key 32 hexadecimal digits
 * @param string iv 32 hexadecimal digits
 * @return bool|string hex
 */
export const sm4Encrypt = async (originalData: string, key: string, iv: string): Promise<HexString> => {
    return SM4.encrypt(originalData, key, {
        iv,
        mode: SM4.constants.CBC,
        inputEncoding: 'utf8',
        outputEncoding: 'hex',
    });
};

/**
 * SM4 sm4cbc 解密
 * @param HexString encryptedData 解密字符串
 * @param string key 32 hexadecimal digits
 * @param string iv 32 hexadecimal digits
 * @return bool|string
 */
export const sm4Decrypt = async (encryptedData: HexString, key: string, iv: string): Promise<string> => {
    return SM4.decrypt(encryptedData, key, {
        iv,
        mode: SM4.constants.CBC,
        inputEncoding: 'hex',
        outputEncoding: 'utf8',
    });
};
