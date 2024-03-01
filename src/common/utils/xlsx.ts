// https://docs.sheetjs.com/docs/demos/stream
// import * as XLSX from 'xlsx/xlsx.mjs';

// /* load 'fs' for readFile and writeFile support */
// import * as fs from 'fs';
// XLSX.set_fs(fs);

// /* load 'stream' for stream support */
// import { Readable } from 'stream';
// XLSX.stream.set_readable(Readable);

// /* load the codepage support library for extended support with older formats  */
// import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
// XLSX.set_cptable(cpexcel);

import { readFile, utils, writeFile } from 'xlsx';
// import * as fs from 'fs';
// import { Readable } from 'stream';
import { ApiError } from '../constants';
import { ApiException } from '../exceptions';

// set_fs(fs);
// stream.set_readable(Readable);
/**
 * 将对象数据解析成 excel
 * @param data 数据
 * @param filePath 路径
 * @param sheetName 表格名字, 默认 Sheet1
 */
const writeExcel = async (data: any[], filePath: string, sheetName = 'Sheet1') => {
    try {
        // 新建工作簿
        const workBook = utils.book_new();
        // 添加表格
        utils.book_append_sheet(workBook, utils.json_to_sheet(data), sheetName);
        // 输出文件
        writeFile(workBook, filePath, { compression: true });
    } catch (e) {
        const error = {
            ...ApiError.createFileFailed,
        };
        throw new ApiException(error, e);
    }
};

/**
 * 读取 excel 文件第一个工作薄的内容
 * @param filePath
 * @returns
 */
const readExcel = async <T = any>(filePath: string) => {
    // stream.set_readable(Readable);
    const workbook = readFile(filePath, { dense: true });
    const sheetName = workbook.SheetNames[0];
    const ws = workbook.Sheets[workbook.SheetNames[0]];
    const data = utils.sheet_to_json(ws, { raw: true });
    return { data: data as T, sheetName };
};

export { writeExcel, readExcel };
