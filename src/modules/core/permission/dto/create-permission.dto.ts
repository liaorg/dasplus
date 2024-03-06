import { RequestValidationSchema } from '@/common/decorators';
import { createPermissionSchema } from '../schemas';

// 注入验证 schema 对象
@RequestValidationSchema(createPermissionSchema)
export class CreatePermissionDto {
    /**
     * 权限类型 menu admin_api element operate
     * @example menu
     */
    type: string;
}
