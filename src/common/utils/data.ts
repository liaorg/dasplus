/**
 * 数据处理
 */
import { RequestUserDto } from '../dto';
import { AnyObject, LogParam } from '../interfaces';
import { hasChange, uniqArray } from './array';
import { isArray, isEmpty, isObject } from './help';

/**
 * 对象转换
 * 把 source 对象转换为 target 中有的值
 * @param source
 * @param target
 * @returns
 */
export function trans2object(source: any, target: any) {
    const data = { ...target };
    if (!isEmpty(source) && !isEmpty(target)) {
        for (const key in target) {
            if (source.hasOwnProperty(key)) {
                data[key] = source[key];
            }
        }
    }
    return data;
}

/**
 * 用户信息转为登录用户信息
 * @param user
 * @returns
 */
export function user2requestUser(user: any): RequestUserDto {
    let businessId: number[] = [];
    let businessName: string[] = [];
    try {
        // const business = JSON.parse(user.business);
        businessId = user.business.id;
        businessName = user.business.name;
    } catch (error) {
        businessId = [];
        businessName = [];
    }
    // 记录登录的用户
    return {
        _id: user._id,
        name: user.name,
        isDefault: !!user.isDefault,
        business: businessId,
        businessName: businessName,
        roleId: user.role._id,
        isDefaultRole: !!user.role.isDefault,
        roleGroupId: user.role.roleGroup._id,
        roleGroupType: user.role.roleGroup.type,
        tenantId: user.tenant_id || 0,
    };
}

/**
 * 过滤对象中的 undefined
 * @param post
 * @returns
 */
export function filterUndefined(post: AnyObject) {
    try {
        if (!isEmpty(post)) {
            const data = {};
            for (const key in post) {
                if (post.hasOwnProperty(key)) {
                    if (post[key] !== undefined) {
                        data[key] = post[key];
                    }
                }
            }
            return data;
        }
        return post;
    } catch (error) {
        return post;
    }
}

/**
 * 比较数据是否有改变，返回变化的数据
 * @param withKey 对比字段
 * @param source 源数据
 * @param target 目标数据
 */
export function hasChangeWith(withKey: string[], source: AnyObject, target: AnyObject) {
    const data = [];
    withKey.forEach((value) => {
        // 都存在时
        if (source[value] !== undefined && target[value] !== undefined) {
            // 两值不相等时
            if (isArray(source[value]) && isArray(target[value])) {
                const change = hasChange(source[value], target[value]);
                if (change.length) {
                    data.push(value);
                }
            } else if (!isObject(source[value]) && !isObject(target[value])) {
                if (source[value] !== target[value]) {
                    data.push(value);
                }
            }
        }
        // 有一个不存在时
        if (
            // 在 source 中存在，在 target 中不存在
            (source[value] !== undefined && target[value] === undefined) ||
            // 在 target 中存在，在 source 中不存在
            (target[value] !== undefined && source[value] === undefined)
        ) {
            data.push(value);
        }
    });
    // 数组去重
    const change = uniqArray(data);
    const changeTarget: any = {};
    if (change.length) {
        change.forEach((item) => {
            if (target[item] !== undefined) {
                changeTarget[item] = target[item];
            }
        });
    }
    return { change, target: changeTarget };
}

/**
 * 生成日志修改内容
 * @param param
 * @returns log
 */
export function generateLog(param: LogParam) {
    const { change, name, module, logType, lanArgs, other, i18n } = param;
    let log: any = {};
    if (change.length) {
        // 如果有改内容，才写入日志
        // api.dot 为分割符
        // const content = change.map((value) => i18n.t(`${module}.${value}`)).join(i18n.t('api.dot'));
        const content = change.map((value) => i18n.t(`${module}.log.${value}`)).join();
        const moduleType = i18n.t(`api.module.${module}`);
        let args: AnyObject;
        if (lanArgs) {
            args = { moduleType, name, content, ...lanArgs };
        } else {
            args = { moduleType, name, content };
        }
        if (other) {
            args.other = i18n.t('api.log.other', { args: { other } });
        }
        log = {
            module: `${module}.module`,
            type: logType,
            content: 'api.log.update',
            lanArgs: { ...args },
        };
    }
    return log;
}
