import { RequestValidationSchema } from '@/common/decorators';
import { createRoleSchema } from '../schemas';
import { ObjectIdType } from '@/common/services';

// 添加角色
@RequestValidationSchema(createRoleSchema)
export class CreateRoleDto {
    /**
     * 角色名
     * @example systemAdminTest
     */
    name: string;

    /**
     * 角色组id
     * @example 1
     */
    roleGroupId: ObjectIdType;

    /**
     * 角色权限id
     * 菜单路由
     * 业务，只有系统安全员可以分配
     * @example [20,27]
     */
    permissionIds: ObjectIdType[];
    /**
     * 角色描述
     * @example test
     */
    description?: string;
}
