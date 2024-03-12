import { PaginationListDto } from '@/common/dto';
import { Role } from '../schemas';

/**
 * 角色列表
 */
export class RoleListDto extends PaginationListDto {
    /**
     * 角色列表
     */
    declare list: Role[];
}

// 角色菜单权限
export class RoleMenuAdminRouteDto {
    /**
     * 菜单名或操作权限名
     */
    title: string;
    /**
     * 操作权限
     */
    children?: string[];
}
