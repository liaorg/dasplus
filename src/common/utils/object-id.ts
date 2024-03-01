/**
 * mongodb objectid 处理
 */
import { Types, isValidObjectId } from 'mongoose';
import { isArray, isString } from './help';

/**
 * 转换为 ObjectId
 * @param data
 * @returns
 */
export function toObjectId(data: any) {
    if (isString(data)) {
        return new Types.ObjectId(data);
    }
    if (isArray(data)) {
        return data?.map((value: any) => {
            if (isString(value)) {
                return new Types.ObjectId(value);
            }
            return value;
        });
    }
    return data;
}

/**
 * 查找对象中是否包含 ObjectId
 * source 是否包含 target
 * @param source
 * @param target
 * @returns
 */
export function includesObjectId(source: any[], target: any) {
    // 先把 source 转换为普通数组
    const data = JSON.parse(JSON.stringify(source));
    let search = target;
    if (isValidObjectId(target)) {
        search = target.toString();
    }
    return data.includes(search);
}

/**
 * 比较 ObjectId 是否相等
 * source 是否等于 target
 * @param source
 * @param target
 * @returns
 */
export function compareObjectId(source: any, target: any) {
    // 先把 source 转换为普通数组
    let data = source;
    let search = target;
    if (isValidObjectId(source)) {
        data = source.toString();
    }
    if (isValidObjectId(target)) {
        search = target.toString();
    }
    return data === search;
}
