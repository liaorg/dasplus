import { OperateLogEnum } from '@/common/enum';
import { ObjectIdType } from '@/common/services';

export class CreateOperateLogDto {
    /**
     * 操作时间
     */
    operateDate?: number;
    /**
     * 日志类型
     * 99其它 1登录 2退出 3配置修改
     * 4系统管理 5业务操作 6导入 7导出
     * @example 4
     */
    type: OperateLogEnum;
    /**
     * 日志类型中文名
     */
    typeName?: string;
    /**
     * 日志内容
     * @example [添加]用户#1
     */
    content: string;
    /**
     * 操作业务模块
     * @example 用户管理
     */
    module?: string;
    /**
     * 操作结果：0-失败|1-成功
     * @example 1
     */
    status?: number;
    /**
     * 操作者
     * @example admin
     */
    operator?: string;
    /**
     * 操作者id如果有的话
     * @example 1
     */
    operatorId?: ObjectIdType;
    /**
     * 操作者ip
     */
    operatorIp?: string;
    /**
     * 操作旧值 修改的时候有，以json格式记录
     */
    oldContent?: string;
    /**
     * 操作新值 新增和修改的时候有，以json格式记录
     */
    newContent?: string;
    /**
     * 多语言参数 json字符串
     */
    lanArgs?: object;
    /**
     * 注意这个的日志信息不能改变，如有改变要通知引擎，因为引擎那边有监控这个
     * 只针对操作日志响应配置操作，其它操作不要增加这个字段
     */
    actionOperate?: number;
}
