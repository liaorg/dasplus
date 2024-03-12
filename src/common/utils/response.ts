import { CreateOperateLogDto } from '@/modules/admin/operate-log/dto';
import { CREATE_OPERATE_LOG } from '../decorators';
import { isEmpty } from './help';

/**
 * 返回包含操作日志的数据
 */
export class DataAndLogDto<T> {
    // 返回的数据
    data: T;
    // 日志信息信息
    [CREATE_OPERATE_LOG]?: CreateOperateLogDto;
}

/**
 * 创建带操作日志信息的返回数据
 * @param data
 * @param log
 */
export function success<T>(data: T, log?: CreateOperateLogDto): DataAndLogDto<T> {
    const returnData = { data };
    if (!isEmpty(log)) {
        returnData[CREATE_OPERATE_LOG] = log;
    }
    return returnData;
}
