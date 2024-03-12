import { OperateLogConst } from '@/modules/admin/operate-log/consts';
import { CreateOperateLogDto } from '@/modules/admin/operate-log/dto';
import { OperateLogService } from '@/modules/admin/operate-log/operate-log.service';
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getContextObject } from 'nestjs-i18n';
import { Observable, map, tap } from 'rxjs';
import { AdapterRequest, AdapterResponse } from '../adapters';
import { CREATE_OPERATE_LOG } from '../decorators/operate-log.decorator';
import { isGeneralizedObject } from '../utils';

/**
 * 自定义日志拦截器,记录操作日志
 * 使用：
 * 在控制器方法中使用装饰器写入日志内容及模块
 * @OperateLogDecorator(obj)
 * obj包含：日志内容,模块,操作时间,日志类型
 * 在控制器中注入
 * @UseInterceptors(OperateLoggerInterceptor)
 * 或者全局注入
 * {
 *    provide: APP_INTERCEPTOR,
 *    useClass: OperateLoggerInterceptor,
 * }
 */

@Injectable()
export class OperateLoggerInterceptor implements NestInterceptor {
    constructor(
        @Inject(OperateLogService) private logService: OperateLogService,
        private readonly reflector: Reflector,
    ) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // 把context赋值到service上
        this.logService.context = context;
        // 获取请求体
        const ctx = context.switchToHttp();
        const res = ctx.getResponse<AdapterResponse>();
        const req = ctx.getRequest<AdapterRequest>();
        const user = req.user;
        return next
            .handle()
            .pipe(
                tap(() => {
                    // 获取类或方法中的参数： CREATE_OPERATE_LOG
                    const contextLog = this.getContextDto(context);
                    if (contextLog) {
                        this.createLog(contextLog, user, req.ip, res.statusCode);
                    }
                }),
            )
            .pipe(
                map((data) => {
                    // 把日志相关的信息返回去除，下标为 CREATE_OPERATE_LOG
                    if (isGeneralizedObject(data) && CREATE_OPERATE_LOG in data) {
                        if (data[CREATE_OPERATE_LOG]) {
                            const log = { ...data[CREATE_OPERATE_LOG] };
                            this.createLog(log, user, req.ip, res.statusCode);
                        }
                        data[CREATE_OPERATE_LOG] = undefined;
                        return data.data;
                    }
                    return data;
                }),
            );
    }
    // 获取类或方法中的参数： CREATE_OPERATE_LOG
    protected getContextDto(context: ExecutionContext) {
        return this.reflector.getAllAndOverride(CREATE_OPERATE_LOG, [
            context.getHandler(),
            context.getClass(),
        ]);
    }

    // 写入日志
    private async createLog(contextLog: any, user: any, loginip: string, statusCode: number) {
        // 获取操作者信息 operatorId operator operatorIp
        // 获取操作时间 operateDate
        // 获取操作结果 status
        // 获取操作业务模块 module
        const operator = contextLog?.username ? contextLog.username : user?.name ?? 'system';
        const operatorIp = contextLog?.loginIp ? contextLog.loginIp : loginip;
        const i18n = getContextObject(this.logService.context);
        // 翻译日志内容
        let content: any;
        // 是否有多语言参数
        if (contextLog?.lanArgs) {
            const args = contextLog?.lanArgs ?? undefined;
            content = i18n.t(contextLog?.content, { args });
        } else {
            content = i18n.t(contextLog?.content);
        }
        const log: CreateOperateLogDto = {
            operator: operator,
            operatorIp: operatorIp,
            operatorId: user?._id ?? 0,
            type: contextLog?.type,
            typeName: contextLog?.type ? i18n.t(OperateLogConst[`l${contextLog.type}`]) : '',
            content: content ? content : contextLog?.content ?? '',
            module: contextLog?.module ?? '',
            status: [200, 201, 202, 203].includes(statusCode) ? 1 : 0,
            /**
             * 注意这个的日志信息不能改变，如有改变要通知引擎，因为引擎那边有监控这个
             * 只针对操作日志响应配置操作，其它操作不要增加这个字段
             */
            actionOperate: contextLog?.actionOperate,
        };
        this.logService.create(log).catch((error) => {
            throw error;
        });
    }
}
