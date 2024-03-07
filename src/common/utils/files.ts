import { createReadStream, createWriteStream, read, Stats } from 'node:fs';
import { access, constants, mkdir, readdir, rename, rm, stat, unlink } from 'node:fs/promises';
import os from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
// import zlib from 'node:zlib';
import { toBase64 } from 'js-base64';
import lineReader from 'line-reader';
import { nanoid } from 'nanoid/async';
import { I18nContext } from 'nestjs-i18n';
import { FileHandle, open, readFile as readFileAsync } from 'node:fs/promises';
import { ServerResponse } from 'node:http';
import { pipeline } from 'node:stream/promises';
import { promisify } from 'node:util';
import { ApiError } from '../constants';
import { ApiException } from '../exceptions';
import { formatDateTime } from './datetime';
import { execSh, spawnPromise } from './exec';
import { catchAwait } from './help';

/**
 * 返回 dist 目录的拼接路径
 * @param dir 文件目录名
 */
const resolveDistDir = (dir: string) => join(resolve(__dirname, '../../'), dir);

/**
 * 判断文件是否存在
 * @param path
 * @returns
 */
const fileExisted = async (path: string) => {
    const fileName = basename(path);
    try {
        // 判断文件是否存在
        await access(path, constants.F_OK);
        return true;
    } catch (e) {
        const error = {
            ...ApiError.fileNotExisted,
            args: { file: fileName },
        };
        throw new ApiException(error, e);
    }
};

function getStartPos(range = '') {
    let startPos = 0;
    if (typeof range === 'string') {
        const matches = /^bytes=([0-9]+)-$/.exec(range);
        if (matches) {
            startPos = Number(matches[1]);
        }
    }
    return startPos;
}

/**
 * 下载文件
 * @param path 文件路径
 * @param res 返回拦截对象
 * @param isRemoveFile 下载完是否删除文件
 * @param isRemoveParent 下载完是否删除文件夹
 */
const downloadFile = async (param: {
    path: string;
    res: ServerResponse;
    isRemoveFile?: boolean;
    isRemoveDir?: boolean;
}) => {
    const { path, res, isRemoveFile = true, isRemoveDir = false } = param;
    let status: Stats;
    // 获取文件名部分 extname：获取文件扩展名
    const fileName = basename(path);
    try {
        // 判断文件是否存在
        status = await stat(path);
    } catch (e) {
        const error = {
            ...ApiError.fileNotExisted,
            args: { file: fileName },
        };
        throw new ApiException(error, e);
    }
    try {
        // 读取文件流
        const range = res.getHeader('range') as string;
        const start = getStartPos(range);
        const stream = createReadStream(path, {
            start,
            highWaterMark: Math.ceil((status.size - start) / 4),
        });
        if (start === 0) {
            res.writeHead(200, {
                // 告诉浏览器这是一个二进制文件
                'Content-Type': 'application/octet-stream',
                // 'Content-Type': 'application/force-download',
                // 告诉浏览器这是一个需要下载的文件
                'Content-Disposition': 'attachment; filename=' + fileName,
                Connection: 'keep-alive',
                // Content-Length 与 Transfer-Encoding 是互斥的
                // 'Content-Length': status.size,
                'Accept-Ranges': 'bytes',
                'Transfer-Encoding': 'chunked',
                // 'Content-Encoding': 'gzip',
            });
        } else {
            res.writeHead(206, {
                // 告诉浏览器这是一个二进制文件
                'Content-Type': 'application/octet-stream',
                // 'Content-Type': 'application/force-download',
                // 告诉浏览器这是一个需要下载的文件
                'Content-Disposition': 'attachment; filename=' + fileName,
                Connection: 'keep-alive',
                'Content-Range': `bytes ${start}-${status.size - 1}/${status.size}`,
                'Transfer-Encoding': 'chunked',
                // 'Content-Encoding': 'gzip',
            });
        }
        // res.writeHead(200, {
        //     // 告诉浏览器这是一个二进制文件
        //     'Content-Type': 'application/octet-stream',
        //     // 'Content-Type': 'application/force-download',
        //     // 告诉浏览器这是一个需要下载的文件
        //     'Content-Disposition': 'attachment; filename=' + fileName,
        //     'Content-Length': status.size,
        //     Connection: 'keep-alive',
        // });
        // stream.pipe(zlib.createGzip()).pipe(res);
        stream.pipe(res);
        // 删除文件夹优先于删除文件
        if (isRemoveDir) {
            // 获取文件的父文件夹
            const dirPath = dirname(path);
            stream.once('close', () => {
                rm(dirPath, { recursive: true, force: true });
            });
        } else if (isRemoveFile) {
            stream.once('close', () => {
                unlink(path);
            });
        }
        // f.on('end', (aa) => {
        // });
    } catch (e) {
        const error = {
            ...ApiError.downloadFileFailed,
        };
        throw new ApiException(error, e);
    }
};

/**
 * 创建文件
 * @param path
 * @returns
 */
const createFile = async (path: string) => {
    let file: FileHandle;
    try {
        // await spawnPromise('sudo', ['touch', path]);
        file = await open(path, 'w+');
    } catch (e) {
        const error = {
            ...ApiError.createFileFailed,
        };
        throw new ApiException(error, e);
    } finally {
        await file.close();
    }
};
/**
 * 设置文件权限 0755
 * @param path
 * @returns
 */
const chmodFile = async (path: string) => {
    try {
        // await chmod(path, 0o775);
        await spawnPromise('sudo', ['chmod', '-R', '0666', path]);
    } catch (e) {
        if (e['stderr']) {
            const error = {
                ...ApiError.createFileFailed,
            };
            throw new ApiException(error, e);
        } else {
            throw e;
        }
    }
};
/**
 * 复制文件
 * @param src
 * @param dest
 * @returns
 */
const copyFile = async (src: string, dest: string) => {
    try {
        await spawnPromise('sudo', ['cp', '-f', src, dest]);
    } catch (e) {
        if (e['stderr']) {
            const error = {
                ...ApiError.copyFileFailed,
            };
            throw new ApiException(error, e);
        } else {
            throw e;
        }
    }
};

/**
 * 写入文件
 * @param path
 * @param data
 */
const writeFile = (path: string, data: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        const wstream = createWriteStream(path, {
            flags: 'w+',
            mode: 0o755, // 文件的权限设置
            encoding: 'utf8', // 写入文件的字符的编码
            start: 0, // 写入文件的起始索引位置
            autoClose: true, // 是否自动关闭文档
        });
        wstream.write(data);
        wstream.end();
        wstream.on('error', (error) => {
            reject(error);
        });
        wstream.on('finish', (data: any) => {
            resolve(data);
        });
    });
};

/**
 * 读取文件
 * @param filePath
 * @param data
 */
const readFile = (filePath: string) => {
    return readFileAsync(filePath, { encoding: 'utf8' });
    // try {
    //     const contents = await readFileAsync(filePath, { encoding: 'utf8' });
    //     return contents;
    // } catch (e) {
    //     const error = {
    //         ...ApiError.readFileFailed,
    //     };
    //     throw new ApiException(error, e);
    // }
};

/**
 * 创建临时目录
 * @param dir 路径要以 / 开头，不然是相对应用目录
 */
const createTempDir = async (dir: string) => {
    try {
        // return await mkdtemp(path.join(os.tmpdir(), dir));
        const tmpdir = join(os.tmpdir(), resolve(dir));
        try {
            const status: Stats = await stat(tmpdir);
            if (!status.isDirectory) {
                await mkdir(tmpdir, 0o755);
            }
        } catch (error) {
            await mkdir(tmpdir, 0o755);
        }
        return tmpdir;
    } catch (err) {
        console.error(err);
    }
};

/**
 * 创建目录
 * @param dir 路径要以 / 开头，不然是相对应用目录
 */
const createDir = async (dir: string) => {
    const dirPath = resolve(dir);
    const [error, status] = await catchAwait(stat(dirPath));
    if (error !== undefined || !status?.isDirectory()) {
        const [error] = await catchAwait(mkdir(dirPath, 0o755));
        if (!error === undefined) {
            return dirPath;
        }
        return dirPath;
    }
    if (error === undefined) {
        return dirPath;
    }
};

/**
 * 按行读取文件
 */
// const eachLine = promisify(lineReader.eachLine);
const eachLine = function (
    filename: string | NodeJS.ReadableStream,
    // eslint-disable-next-line @typescript-eslint/ban-types
    iteratee?: (line: string, last: boolean, continueCb?: Function) => void,
) {
    return new Promise(function (resolve, reject) {
        lineReader.eachLine(filename, iteratee, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

// const readStremfunc = (filepath, start, end) => {
//     const readStream = createReadStream(filepath, { start, end });
//     readStream.setEncoding('binary');
//     let data = '';
//     readStream.on('data', (chunk) => {
//         data = data + chunk;
//     });
// };

/**
 * 生成文件路径
 * @param fileId 文件id
 * @param rootPath 文件根路径，默认 ../public
 * @param ext 文件后辍，默认 .xlsx
 * @param rootIsAbsolute rootPath是否绝对路径，默认否
 * @returns
 */
async function createPath(opts?: {
    fileId?: string;
    rootPath?: string;
    ext?: string;
    rootIsAbsolute?: boolean;
}) {
    const fileId = opts?.fileId || (await nanoid());
    const rootPath = opts?.rootPath || '../public';
    const ext = opts?.ext ? `.${opts.ext}` : '.xlsx';
    const isAbsolute = opts?.rootIsAbsolute || false;
    const filename = basename(`${fileId}${ext}`);
    let root: string;
    if (!isAbsolute) {
        // rootPath 不是绝对路径时
        // 相对 dist 目录
        root = resolveDistDir(`${rootPath}/${fileId}`);
        await mkdir(root, { recursive: true, mode: 0o755 });
    } else {
        // rootPath 是绝对路径时
        root = rootPath;
    }
    const path = `${root}/${filename}`;
    return { fileId, path, ext, root };
}

/**
 * 获取目录大小
 * @param dir 目录路径要以 / 开头，不然是相对应用目录
 */
async function getDirSize(dir: string) {
    try {
        const dirPath = resolve(dir);
        const result = await spawnPromise('sudo', ['du', '-sb', dirPath]);
        const match = /^(\d+)/.exec(result?.stdout);
        const bytes = Number(match[1]);
        return bytes;
    } catch (error) {
        return 0;
    }
}

/**
 * 获取目录下除了 . 和 .. 的所有文件
 * @param dir 路径要以 / 开头，不然是相对应用目录
 * @returns
 */
async function scanDir(dir: string) {
    try {
        const dirPath = resolve(dir);
        const files = await readdir(dirPath);
        return files;
    } catch (error) {
        return [];
    }
}

/**
 * 解压缩文件
 * @param filePath 源文件
 * @param target 解压目标目录
 * @param password 压缩密码
 * @param rootPath 文件根路径，默认 ../public
 * @param targetIsAbsolute 是否绝对路径
 * @returns
 */
async function unZipFile(param: {
    filePath: string;
    target: string;
    password?: string;
    rootPath?: string;
    targetIsAbsolute?: boolean;
}) {
    try {
        const { filePath, password, target, rootPath = '../public', targetIsAbsolute = false } = param;
        // 解压缩目录
        let targetPath: string;
        if (!targetIsAbsolute) {
            // rootPath 不是绝对路径时
            // 相对 dist 目录
            targetPath = resolveDistDir(`${rootPath}/${target}`);
            await mkdir(targetPath, { recursive: true, mode: 0o755 });
        } else {
            // target 是绝对路径时
            targetPath = target;
        }
        let stdout: string;
        if (password) {
            // 解密解压缩
            const passwordBase64 = toBase64(password);
            // 解密
            const fileInfo = await execSh('unzipfile.sh', [passwordBase64, filePath, targetPath]);
            stdout = fileInfo.stdout;
        } else {
            // 解压缩
            const fileInfo = await execSh('unzipfile.sh', [filePath, targetPath]);
            stdout = fileInfo.stdout;
        }
        // 删除原文件
        unlink(filePath);
        return { targetPath, stdout };
    } catch (e) {
        const error = {
            ...ApiError.badParams,
        };
        throw new ApiException(error, e);
    }
}

/**
 * 压缩文件
 * @param fileId 文件id
 * @param root 文件路径
 * @param path 源文件
 * @param password 压缩密码
 * @param newName 是否重命名文件
 * @returns
 */
async function zipFile(param: {
    fileId: string;
    root: string;
    path: string;
    password?: string;
    newName?: string;
}) {
    try {
        const { fileId, root, password, newName } = param;
        let { path } = param;
        if (newName) {
            path = `${root}/${newName}`;
            await rename(param.path, path);
        }
        const filename = basename(`${fileId}.zip`);
        const targetPath = `${root}/${filename}`;
        if (password) {
            const passwordBase64 = toBase64(password);
            // 加密压缩
            await execSh('zipfile.sh', [passwordBase64, targetPath, path]);
        } else {
            // 压缩
            await execSh('zipfile.sh', [targetPath, path]);
        }
        // 删除原文件
        unlink(path);
    } catch (e) {
        const error = {
            ...ApiError.badParams,
        };
        throw new ApiException(error, e);
    }
}

// 生成加密文件，返回文件下载参数
async function generateFileDowloadParam(param: {
    i18n: I18nContext;
    moduleName: string;
    fileId: string;
    root: string;
    path: string;
    ext: string;
    selectedLength?: number;
    password?: string;
}) {
    // 生成文件路径信息
    const { i18n, selectedLength, password, moduleName, fileId, root, path, ext } = param;
    const now = Date.now();
    // 文件下载时间
    const date = formatDateTime({ date: now }, 'YYYYMMDDHHmm.ssSSS');
    let filename: string;
    let content: string;
    if (selectedLength) {
        filename = `${i18n.t('api.exportSelected', {
            args: { name: moduleName, num: selectedLength || 0 },
        })}-${date}`;
        content = 'api.exportSelected';
    } else {
        filename = `${i18n.t('api.exportAll', {
            args: { name: moduleName },
        })}-${date}`;
        content = 'api.exportAll';
    }
    // 有密码时，文件加密
    if (password) {
        await zipFile({
            fileId,
            root,
            path,
            password,
            newName: `${filename}${ext}`,
        });
        // 后辍名要变成 .zip
        filename = `${filename}.zip`;
    } else {
        filename = `${filename}${ext}`;
    }
    return { content, filename };
}

/**
 * 合并文件
 * Stream concurrent merge
 * @param chunks
 * @param target
 * @param chunkSize
 */
async function streamConcurrentMerge(chunkDir: string, target: string, chunkSize: number) {
    // 获取合并目录的文件
    const chunks = await scanDir(chunkDir);
    // 文件重新排序
    chunks.sort((a: string, b: string) => {
        return parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]);
    });
    await Promise.all(
        chunks.map((filename) => {
            const index = Number(filename.split('-').pop());
            const start = index * chunkSize;
            const source = `${chunkDir}/${filename}`;
            return pipeline(createReadStream(source), createWriteStream(target, { start }));
        }),
    );
}

/**
 * 异步读取文件内容
 */
export const asyncRead = promisify(read);

/**
 * 删除目录
 * 限定目录 /tmp /mnt/disk/logs /mnt/disk/public /var/www/server/upload
 * @param targetPath 路径要以 / 开头，不然是相对应用目录
 */
export const removeDir = (targetPath: string) => {
    return rm(targetPath, { recursive: true, force: true });
};

export {
    chmodFile,
    copyFile,
    createDir,
    createFile,
    createPath,
    createTempDir,
    downloadFile,
    eachLine,
    fileExisted,
    generateFileDowloadParam,
    getDirSize,
    readFile,
    resolveDistDir,
    scanDir,
    streamConcurrentMerge,
    unZipFile,
    writeFile,
    zipFile,
};
