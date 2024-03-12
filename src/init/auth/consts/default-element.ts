import { RoleGroupTypeEnum } from '@/modules/core/role-group/enums';

// 要隐藏的页面元素
export interface ElementInterface {
    node: string;
    // 拥有权限的角色组type集合，*表示所有角色都有的操作
    roleGroupType?: '*' | RoleGroupTypeEnum[];
}
export const defaultElement = [];
