import { RequestValidationSchema } from '@/common/decorators';
import { updateTimeSchema } from '../schemas';

// 参数验证
@RequestValidationSchema(updateTimeSchema)
export class UpdateTimeDto {
    /**
     * 日期时间 - 客户端时间
     * @example '2023-02-13 11:45:48'
     */
    dateTime: string;
}
