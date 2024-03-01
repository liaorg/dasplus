// # https://github.com/NaturalIntelligence/fast-xml-parser
// npm install fast-xml-parser

import { XMLBuilder } from 'fast-xml-parser';
import { ApiError } from '../constants';
import { writeFile } from './files';
import { catchAwait } from './help';
import { ApiException } from '../exceptions';

/**
 * 将对象数据解析成 xml
 * @param data 数据
 * @param filePath 路径
 */
const writeXml = async (data: any[], filePath: string) => {
    const options = {
        ignoreAttributes: false,
        processEntities: false,
        format: false,
        arrayNodeName: 'data',
        // cdataPropName: 'phone',
    };

    const builder = new XMLBuilder(options);
    const output = builder.build(data);
    const [err] = await catchAwait(writeFile(filePath, `<?xml version="1.0" ?><xml>${output}</xml>`));
    if (err) {
        const error = {
            ...ApiError.createFileFailed,
        };
        throw new ApiException(error);
    }
    return filePath;
};

/**
 * 读取文件内容
 * @param filePath
 * @returns
 */
// const readXml = async (filePath: string) => {
//     // stream.set_readable(Readable);
// };

export { writeXml };
