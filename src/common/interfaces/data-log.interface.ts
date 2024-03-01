import { I18nContext } from 'nestjs-i18n';
import { OperateLogEnum } from '../enum';

/**
 * 日志生成参数
 */
export interface LogParam {
    // 对比字段
    change: string[];
    // 修改名称
    name?: string;
    // 模块名
    module: string;
    // 操作日志类型
    logType: OperateLogEnum;
    i18n: I18nContext;
    other?: string;
    // 其它语言参数
    lanArgs?: {
        [key: string]: any;
    };
}
