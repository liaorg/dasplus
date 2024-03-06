import { SetMetadata } from '@nestjs/common';
import { IS_CHECK_MENU } from '../constants';

/**
 * 自定义装饰器用于给设置是否要验证获取菜单的权限 /admin/menu
 * 使用：
 * 在类或方法使用装饰器
 * @CheckMenuDecorator()
 * @NotCheckMenuDecorator()
 */
export const CheckMenuDecorator = () => SetMetadata(IS_CHECK_MENU, true);
export const NotCheckMenuDecorator = () => SetMetadata(IS_CHECK_MENU, false);
