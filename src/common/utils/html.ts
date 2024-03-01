import { readFileSync } from 'node:fs';
import { ApiError } from '../constants';
import { writeFile } from './files';
import { catchAwait } from './help';
import { ApiException } from '../exceptions';
import { resolveDistDir } from './files';

const tableCss = readFileSync(resolveDistDir('./fonts/table.css'), { encoding: 'utf-8' });

/**
 * 将对象数据解析成 html
 * @param data 数据
 * @param filePath 路径
 */
const writeHtml = async (data: any[], filePath: string, title: string) => {
    // 表头
    const thead = [];
    if (data[0]) {
        for (const key in data[0]) {
            if (Object.prototype.hasOwnProperty.call(data[0], key)) {
                thead.push(`<th>${key}</th>`);
            }
        }
    }
    // 内容
    const tbody = [];
    data.forEach((value) => {
        const tempBody = [];
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                tempBody.push(`<td>${value[key]}</td>`);
            }
        }
        tbody.push(`<tr>${tempBody.join('')}</tr>`);
    });
    const output = `<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>${tableCss}</style>
        <title>${title}</title>
    </head>
    <body>
        <div class="table">
            <div class="scrollbar-container table-header">
                <table cellpadding="0" cellspacing="0">
                <thead><tr>${thead.join('')}</tr></thead>
                <tbody>${tbody.join('')}</tbody></table>
            </div>
        </div>
    </body>
</html>
`;
    const [err] = await catchAwait(writeFile(filePath, `${output}`));
    if (err) {
        const error = {
            ...ApiError.createFileFailed,
        };
        throw new ApiException(error);
    }
    return filePath;
};

/**
 * Module variables.
 * @private
 */

const matchHtmlRegExp = /["'&<>]/;

/**
 * 转义 HTML
 *
 * @param string
 */
function escapeHtml(string: string) {
    const str = '' + string;
    const match = matchHtmlRegExp.exec(str);

    if (!match) {
        return str;
    }

    let escape: string;
    let html = '';
    let index = 0;
    let lastIndex = 0;

    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
            case 34: // "
                escape = '&quot;';
                break;
            case 38: // &
                escape = '&amp;';
                break;
            case 39: // '
                escape = '&#39;';
                break;
            case 60: // <
                escape = '&lt;';
                break;
            case 62: // >
                escape = '&gt;';
                break;
            default:
                continue;
        }

        if (lastIndex !== index) {
            html += str.substring(lastIndex, index);
        }

        lastIndex = index + 1;
        html += escape;
    }

    return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}

export { writeHtml, escapeHtml };
