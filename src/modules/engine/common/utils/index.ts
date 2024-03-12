import { EngineError } from '@/common/constants';
import { AnyObject } from '@/common/interfaces';
import { isObject } from '@/common/utils';
import { EngineException } from '../../engine.exception';
import { EngineRepDataDto } from '../dto';

/**
 * 获取分页参数
 * @param current 最小 1
 * @param pageSize 最多500 最小1
 * @returns
 */
function createLimitAndSkip(current: number, pageSize: number) {
    let limit = +pageSize || 20;
    limit = limit < 1 ? 20 : limit > 500 ? 500 : limit;
    let skip = +current - 1 || 0;
    skip = skip < 0 ? 0 : skip * limit;
    const page = +current < 0 ? 1 : current;
    return { limit, skip, page };
}

/**
 * 统一处理返回结果
 * @param err
 * @param rep
 * @param objerr
 * @param exception
 * @param args
 */
function handleRep(
    err: AnyObject | Error,
    rep: EngineRepDataDto,
    objerr: { errorCode: number; langKeyword: string },
    args?: AnyObject,
    param?: AnyObject,
) {
    // const params = param ? JSON.stringify(param) : '';
    // 程序错误
    if (err) {
        const error = {
            ...EngineError.serverError,
        };
        throw new EngineException(error, { param, err });
    }
    // 接口返回失败
    if (!rep?.ok) {
        const error = {
            ...objerr,
            args: isObject(args) ? { ...args } : {},
        };
        throw new EngineException(error, { param, rep });
    }
}

// export * from './api';
export { createLimitAndSkip, handleRep };
