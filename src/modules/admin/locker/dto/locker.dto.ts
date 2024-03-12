import { PaginationListDto } from '@/common/dto';
import { ObjectIdType } from '@/common/services';

// 锁定客户端数据
export class LockerDto {
    _id: ObjectIdType;
    /**
     * IP地址
     */
    address: string;
    /**
     * 状态：1-锁定|0-解锁
     */
    status: number;
    /**
     * 锁定次数
     */
    times: number;
    /**
     * 锁定秒数
     */
    seconds: number;
    /**
     * 剩余时间 秒
     */
    left_time?: number;
}
// 分页数据
export class LockerListDto extends PaginationListDto {
    /**
     * 列表数据
     */
    declare list: LockerDto[];
}

// 查询
// @RequestValidationSchema(queryLockerSchema)
// export class QueryLockerDto<T> extends PaginationDto<T> {}
