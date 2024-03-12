import { RequestValidationSchema } from '@/common/decorators';
import { createLockerSchema } from '../schemas';

@RequestValidationSchema(createLockerSchema)
export class CreateLockerDto {
    /**
     * 用户名称
     * @example admin
     */
    username: string;
    /**
     * IP地址
     * @example 10.4.8.220
     */
    address: string;
    /**
     * 状态：1-锁定|0-解锁
     * @example 1
     */
    status?: number;
    /**
     * 锁定次数
     * @example 1
     */
    times?: number;
    /**
     * 锁定秒数
     * @example 1800
     */
    seconds?: number;
}
