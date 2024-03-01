import { ObjectIdType } from '../interfaces';

export abstract class CommonDateDto {
    /**
     * id
     */
    _id: ObjectIdType;
    /**
     * 创建时间UTC毫秒
     */
    create_date?: number;
    /**
     * 修改时间UTC毫秒
     */
    update_date?: number;
}
