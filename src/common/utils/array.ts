import { AnyObject } from '../interfaces';

/**
 * 网卡名排序整体排序
 * eth0-9 eth1-0
 * @param rev 升序降序 默认升序
 * @returns
 */
export function netSortByEth(rev = true) {
    return (first: any, second: any) => {
        // eth0-9 eth1-0
        const numbersFirst = first.device.match(/\d+(\.\d+)?/g);
        const numberFirst = numbersFirst.length ? parseInt(numbersFirst.join(''), 10) : 0;
        const numbersSecond = second.device.match(/\d+(\.\d+)?/g);
        const numberSecond = numbersSecond.length ? parseInt(numbersSecond.join(''), 10) : 0;
        return rev ? numberFirst - numberSecond : numberSecond - numberFirst;
    };
}
/**
 * 网卡名排序，说网卡排序
 * eth0 eth1
 * @param rev 升序降序 默认升序
 * @returns
 */
export function netSortByEthMain(rev = true) {
    return (first: any, second: any) => {
        // eth0 eth1
        const numbersFirst = first.device.match(/\d+(\.\d+)?/g);
        const numberFirst = numbersFirst.length ? parseInt(numbersFirst[0], 10) : 0;
        const numbersSecond = second.device.match(/\d+(\.\d+)?/g);
        const numberSecond = numbersSecond.length ? parseInt(numbersSecond[0], 10) : 0;
        return rev ? numberFirst - numberSecond : numberSecond - numberFirst;
    };
}

/**
 * 数组去重
 */
export function uniqArray(arr: any[]) {
    const set = new Set(arr);
    return Array.from(set);
}

/**
 * 找出不在 target 中的值
 * @param arr
 * @param target
 * @returns
 */
export function notInTarget(arr: any[], target: any[]) {
    const returnData: any[] = [];
    const set = new Set(target);

    arr.forEach((value) => {
        if (!set.has(value)) {
            returnData.push(value);
        }
    });
    return returnData;
}

/**
 * 求两个数组的并集
 * @param arr1
 * @param arr2
 * @returns
 */
export function unionSet(arr1: any[], arr2: any[]) {
    const arr = arr1.concat(arr2);
    const set = new Set(arr);
    return Array.from(set);
}

/**
 * 获取两个数组的交集
 * @param arr1
 * @param arr2
 * @returns
 */
export function intersection(arr1: any[], arr2: any[]) {
    const returnData: any[] = [];
    const set = new Set(arr2);

    arr1.forEach((value) => {
        if (set.has(value)) {
            returnData.push(value);
        }
    });
    return returnData;
}

/**
 * 数组转成树
 */
export const arrToTree = function (arr: any[], parentId = 0) {
    const newArr = [];
    arr.forEach((item) => {
        if (item.parentId === parentId) {
            newArr.push({
                ...item,
                children: arrToTree(arr, item.id),
            });
        }
    });
    return newArr;
};

/**
 * 数组反转
 * @param obj
 * @returns
 */
export function invert(obj: AnyObject) {
    const retobj = {};
    for (const key in obj) {
        retobj[obj[key]] = key;
    }
    return retobj;
}

/**
 * 数据分割
 * @param array
 * @param subLength
 * @returns
 */
export function division(array: any[], subLength: number) {
    let index = 0;
    const newArr = [];
    while (index < array.length) {
        newArr.push(array.slice(index, (index += subLength)));
    }
    return newArr;
}

/**
 * 比较数据是否有改变，返回变化的数据
 * @param source 源数据
 * @param target 目标数据
 */
export function hasChange(source: any[], target: any[]) {
    const data = [];
    source?.forEach((value) => {
        if (!target?.includes(value)) {
            data.push(value);
        }
    });
    target?.forEach((value) => {
        if (!source?.includes(value)) {
            data.push(value);
        }
    });
    // 数组去重
    return uniqArray(data);
}
