const MIN_INT32 = -(2 ** 31);
const MAX_INT32 = 2 ** 31 - 1;

function validateInt32(value: number): boolean {
    return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
}

function validateInt64(value: number): boolean {
    // JSON and javascript max Int is 2**53, so any int that passes isInteger is valid for Int64
    return Number.isInteger(value);
}

export { validateInt32, validateInt64 };
