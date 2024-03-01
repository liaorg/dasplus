import { BIN_PATH } from '@/config';
import { ChildProcess, SpawnOptions as NodeSpawnOptions, exec, spawn } from 'node:child_process';
import { promisify } from 'node:util';

/**
 * 异步执行命令 exec
 * @param str
 */
const execPromise = promisify(exec);

interface SpawnOptions extends NodeSpawnOptions {
    ignoreStdio?: boolean;
}

export interface SpawnPromise<T> extends Promise<T> {
    child: ChildProcess;
}

export interface SpawnResult {
    pid?: number;
    output: string[];
    stdout: string;
    stderr: string;
    status: number | null;
    signal: string | null;
    spawnargs?: any;
}

/**
 * 参考 https://github.com/expo/spawn-async @expo/spawn-async
 * 参考 https://github.com/anaisbetts/spawn-rx spawn-rx
 * 异步执行命令 spawn
 * @param command
 * @param args
 * @param options
 * @returns
 */
function spawnPromise(
    command: string,
    args?: ReadonlyArray<string>,
    options: SpawnOptions = {},
): SpawnPromise<SpawnResult> {
    const stubError = new Error();
    const callerStack = stubError.stack ? stubError.stack.replace(/^.*/, '    ...') : null;
    let child: ChildProcess;
    const promise = new Promise((resolve, reject) => {
        const { ignoreStdio, ...nodeOptions } = options;
        // sh -c 它可以让 bash 将一个字串作为完整的命令来执行，这样就可以将 sudo 的影响范围扩展到整条命令
        // const shell = { cmd: 'sh', arg: '-c' };
        // child = spawn(shell.cmd, [shell.arg, command, ...args], nodeOptions);
        // cross-spawn declares "args" to be a regular array instead of a read-only one
        child = spawn(command, args, nodeOptions);
        let stdout = '';
        let stderr = '';

        if (!ignoreStdio) {
            if (child.stdout) {
                child.stdout.on('data', (data) => {
                    stdout += data;
                });
            }

            if (child.stderr) {
                child.stderr.on('data', (data) => {
                    stderr += data;
                });
            }
        }

        const completionListener = (code: number | null, signal: string | null) => {
            child.removeListener('error', errorListener);
            const result: SpawnResult = {
                pid: child.pid,
                output: [stdout, stderr],
                stdout,
                stderr,
                status: code,
                signal,
                spawnargs: child?.spawnargs,
            };
            if (code !== 0) {
                const argumentString = args && args.length > 0 ? ` ${args.join(' ')}` : '';
                const error = signal
                    ? new Error(`${command}${argumentString} exited with signal: ${signal}`)
                    : new Error(`${command}${argumentString} exited with non-zero code: ${code}`);
                if (error.stack && callerStack) {
                    error.stack += `\n${callerStack}`;
                }
                Object.assign(error, result);
                reject(error);
            } else {
                resolve(result);
            }
        };

        const errorListener = (error: Error) => {
            if (ignoreStdio) {
                child.removeListener('exit', completionListener);
            } else {
                child.removeListener('close', completionListener);
            }
            Object.assign(error, {
                pid: child.pid,
                output: [stdout, stderr],
                stdout,
                stderr,
                status: null,
                signal: null,
                spawnargs: child?.spawnargs,
            });
            reject(error);
        };

        if (ignoreStdio) {
            child.once('exit', completionListener);
        } else {
            child.once('close', completionListener);
        }
        child.once('error', errorListener);
    }) as SpawnPromise<SpawnResult>;
    // TypeScript isn't aware the Promise constructor argument runs synchronously and
    // thinks `child` is not yet defined
    promise.child = child;
    return promise;
}

/**
 * 执行 shell 脚本
 * @param command 脚本名称
 * @param args 参数数组
 * @param options
 * @returns
 */
function execSh(command: string, args: ReadonlyArray<string> = [], options: SpawnOptions = {}) {
    return spawnPromise('sh', [`${BIN_PATH}/exec.sh`, command, ...args], options);
}

/**
 * 执行 python 脚本
 * @param command 脚本名称
 * @param args 参数数组
 * @param options
 * @returns
 */
function execPy(command: string, args: ReadonlyArray<string> = [], options: SpawnOptions = {}) {
    return spawnPromise('sh', [`${BIN_PATH}/py.sh`, command, ...args], options);
}

export { execPromise, execPy, execSh, spawnPromise };
