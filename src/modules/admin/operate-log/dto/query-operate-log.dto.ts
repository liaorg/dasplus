/**
 * 请求输入输出规范
 */

import { RequestValidationSchema } from '@/common/decorators';
import { PaginationDto } from '@/common/dto';
import { OperateLogEnum } from '@/common/enum';
import { queryOperateLogSchema } from '../schemas';

/**
 * 注入验证 schema 对象
 */
@RequestValidationSchema(queryOperateLogSchema)
export class QueryOperateLogDto extends PaginationDto {
    /**
     * 开始时间,结束时间
     * @example ['2023-01-01 00:00:00', '2023-12-12 09:53:52']
     */
    dateTime?: string[];
    /**
     * 日志类型
     * 99其它 1登录 2退出 3配置修改
     * 4系统管理 5业务操作 6导入 7导出
     * @example 4
     */
    type?: OperateLogEnum;
    /**
     * 日志内容
     * @example
     */
    content?: string;
    /**
     * 操作者
     * @example system
     */
    operator?: string;
}
