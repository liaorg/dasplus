import { RequestValidationSchema } from '@/common/decorators';
import { unLockerSchema } from '../schemas';

// 解锁
@RequestValidationSchema(unLockerSchema)
export class UnLockingDto {
    /**
     * 地址数组
     * @example [...]
     */
    address: string[];
}

// 更新
export class UpdateLockerDto {
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
