import { RequestValidationSchema } from '@/common/decorators';
import { OperateLogEnum } from '@/common/enum';
import { exportOperateLogSchema } from '../schemas';
import { SortType } from '@/common/dto';
import { AnyObject } from '@/common/interfaces';

// 导出参数

@RequestValidationSchema(exportOperateLogSchema)
export class ExportOperateLogDto<T = AnyObject> {
    /**
     * 日志id
     */
    ids?: string[];
    /**
     * 开始时间,结束时间
     * @example ['2023-01-01 00:00:00', '2023-12-12 09:53:52']
     */
    dateTime?: string[];
    /**
     * 日志类型
     * 99其它 1登录 2退出 3配置修改
     * 4系统管理 5业务操作 6导入 7导出
     */
    type?: OperateLogEnum;
    /**
     * 日志内容
     */
    content?: string;
    /**
     * 操作者
     */
    operator?: string;
    /**
     * 加密密码
     */
    password?: string;
    /**
     * 排序字段 {id: -1}，-1 降序，1 升序
     * @example {id: -1}
     */
    sort?: SortType<T>;
}
