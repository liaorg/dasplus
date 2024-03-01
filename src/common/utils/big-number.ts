import JSONbig from 'json-bigint';

// JavaScript 的 Number 采用 64 比特的 IEEE 754 标准来表示整数和浮点数数值 \
// 其中整数的安全范围在 -2 的 53 次方- 1 到 2 的 53 次方 - 1 之间 \
// -9007199254740991 到 9007199254740991 之间 \

// 可接收外部任意长度数字
// https://github.com/sidorares/json-bigint
// npm i --save json-bigint
// npm i --save-dev @types/json-bigint
// 或
// yarn add json-bigint
// yarn add -D @types/json-bigint

// JSONBig
// JSONbig.parse
// JSONbig.stringify
// JSONBig(opt);

/**
 * json 解析
 * JSONBIGTool.parse()
 * JSONBIGTool.stringify()
 */
export const JSONBIGTool = JSONbig({
    // 使用 JSON.parse
    strict: false,
    // BigNumber是否应作为字符串
    storeAsString: true,
    // 是否应将所有数字存储为BigNumber
    alwaysParseAsBig: false,
    // 使用本机 BigInt
    useNativeBigInt: true,
});

/**
 * json 处理
 * JSON.stringify(data, replacer);
 * 18014398509481982n => 18014398509481982
 * @param key
 * @param value
 * @returns
 */
export const replacer = (_key: string, value: any) =>
    typeof value === 'bigint' ? value.toString() : value;

/**
 * json 处理
 * JSON.parse(payload, reviver);
 * 18014398509481982 => 18014398509481982n
 * @param key
 * @param value
 * @returns
 */
export const reviver = (key: string, value: string) => (key === 'big' ? BigInt(value) : value);
