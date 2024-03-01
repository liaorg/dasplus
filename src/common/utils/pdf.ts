// # https://github.com/parallax/jsPDF
// npm install jspdf

// import { readFileSync } from 'node:fs';
import autoTable from 'jspdf-autotable';
import { resolveDistDir } from './files';
import { jsPDF } from 'jspdf';
import { ApiError } from '../constants';
import { ApiException } from '../exceptions';

// const NotoSansCJKtc = readFileSync(resolveDistDir('./fonts/NotoSansCJKtc-Regular.ttf'), {
//     encoding: 'latin1',
// });

/**
 * 将对象数据解析成 pdf
 * @param data 数据
 * @param filePath 路径
 */
const writePdf = async (data: any[], filePath: string) => {
    try {
        const options = {
            compress: true,
            // orientation: 'l', // p/portrait:竖着, l/landscape:横着
            // unit: 'pt', // 单位: "pt", "mm", "cm", "m", "in" or "px"
            format: 'a4', // string 'a4' or [width,height]
        };
        const doc = new jsPDF(options);
        // 设置字体 只支持 ttf 格式字体
        // doc.addFileToVFS('NotoSansCJKtc', NotoSansCJKtc);
        doc.addFont(resolveDistDir('./fonts/NotoSansCJKtc-Regular.ttf'), 'NotoSansCJKtc', 'normal');
        doc.setFont('NotoSansCJKtc');

        const head = [];
        if (data[0]) {
            const tempHead = [];
            for (const key in data[0]) {
                if (Object.prototype.hasOwnProperty.call(data[0], key)) {
                    tempHead.push(key);
                }
            }
            head.push(tempHead);
        }
        const body = [];
        data.forEach((value) => {
            const tempBody = [];
            for (const key in value) {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    if (
                        key === '事件信息' ||
                        key === '语句内容' ||
                        key === '事件描述' ||
                        key === '触发事件的语句'
                    ) {
                        tempBody.push({
                            content: value[key],
                            styles: { minCellWidth: 15 },
                        });
                    } else if (key === 'SQL模板编号') {
                        tempBody.push({
                            content: value[key],
                            styles: { minCellWidth: 10 },
                        });
                    } else {
                        tempBody.push(value[key]);
                    }
                }
            }
            body.push(tempBody);
        });
        autoTable(doc, {
            styles: {
                // 使autotable支持中文
                font: 'NotoSansCJKtc',
                minCellWidth: 9,
                cellWidth: 'auto', // 'auto'|'wrap'|number = 'auto'
                overflow: 'linebreak', // 'linebreak'|'ellipsize'|'visible'|'hidden' = 'linebreak'
            },
            margin: 1,
            head,
            body,
        });

        doc.save(filePath);
        return filePath;
    } catch (e) {
        const error = {
            ...ApiError.createFileFailed,
        };
        throw new ApiException(error, e);
    }
};

/**
 * 读取文件内容
 * @param filePath
 * @returns
 */
// const readPdf = async (filePath: string) => {
//     // stream.set_readable(Readable);

export { writePdf };
