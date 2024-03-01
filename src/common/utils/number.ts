/**
 * 生成随机整数
 * 使用 randomInt 替代
 * @param min
 * @param max
 */
export function getRandomInt(min: number, max?: number) {
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
