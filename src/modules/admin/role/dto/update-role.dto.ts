import { RequestValidationSchema } from '@/common/decorators';
import { updateRoleSchema } from '../schemas';
import { ObjectIdType } from '@/common/services';

// 更新角色信息
@RequestValidationSchema(updateRoleSchema)
export class UpdateRoleDto {
    /**
     * 角色名
     * @example test-update
     */
    name?: string;

    /**
     * 角色组id
     * @example 1
     */
    roleGroupId?: ObjectIdType;
    /**
     * 默认管理员id
     * @example 1
     */
    userId?: ObjectIdType;

    /**
     * 角色权限id
     * @example [20,27]
     */
    permissionIds?: ObjectIdType[];

    /**
     * 角色描述
     * @example update-test
     */
    description?: string;
}
