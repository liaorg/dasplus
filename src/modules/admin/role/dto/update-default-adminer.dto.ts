import { RequestValidationSchema } from '@/common/decorators';
import { updateDefaultAdminerSchema } from '../schemas';
import { ObjectIdType } from '@/common/services';

// 设置默认管理员
@RequestValidationSchema(updateDefaultAdminerSchema)
export class UpdateDefaultAdminerDto {
    /**
     * 角色组id
     * @example 1
     */
    roleGroupId: ObjectIdType;
    /**
     * 用户id
     * @example 1
     */
    userId: ObjectIdType;
}
