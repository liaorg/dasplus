import { CreateOperateLogDto } from '@/modules/admin/operate-log/dto';
import { SetMetadata } from '@nestjs/common';

export const CREATE_OPERATE_LOG = 'create_operate_log:dto';

/**
 * 自定义装饰器用于给拦截器： OperateLoggerInterceptor 设置操作日志参数
 * 使用：
 * 在控制器方法使用装饰器
 * @OperateLogDecorator(obj)
 * obj: { type: 1, module: '', content: '' }
 */
export const OperateLogDecorator = (dto: CreateOperateLogDto) => SetMetadata(CREATE_OPERATE_LOG, dto);
