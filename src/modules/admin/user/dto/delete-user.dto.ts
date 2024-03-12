// 请求输入输出规范

import { RequestValidationSchema } from '@/common/decorators';
import { ObjectIdType } from '@/common/services';
import { deleteUserSchema } from '../schemas';

// 注入验证 schema 对象
@RequestValidationSchema(deleteUserSchema)
export class DeleteUserDto {
    /**
     * 用户ids
     * @example [100,101]
     */
    ids: ObjectIdType[];
}
