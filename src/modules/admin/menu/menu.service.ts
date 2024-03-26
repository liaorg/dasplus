import { RequestUserDto } from '@/common/dto';
import { genCacheKey } from '@/common/helps';
import { InjectMongooseRepository, MongooseRepository } from '@/common/repository';
import { BaseService } from '@/common/services';
import { compareObjectId, includesObjectId } from '@/common/utils';
import { AuthService } from '@/modules/core/auth/auth.service';
import { Injectable } from '@nestjs/common';
import { ONLY_SYSTEM_ADMIN_MENU } from './constants';
import { Menu } from './schemas';

@Injectable()
export class MenuService extends BaseService<Menu> {
    constructor(
        @InjectMongooseRepository(Menu.name) protected readonly repository: MongooseRepository<Menu>,
        private readonly authService: AuthService,
    ) {
        const cacheKey: string = genCacheKey('MenuService');
        super(repository, cacheKey);
        // 缓存数据
        this.initCache();
    }

    // 根据角色，获取菜单权限下拉列表
    async findMenuByRoleId(loginUser: RequestUserDto, isDefaultUser: boolean = false) {
        // 从缓存中获取
        const [permissions, data] = await Promise.all([
            // 获取角色权限
            this.authService.getPermissionsByLoginUser(loginUser),
            // 获取角色菜单
            this.getCache(),
        ]);
        const menu = data.filter((item) => {
            let has = item.status === 1 && includesObjectId(permissions, item.permission);
            if (isDefaultUser === false) {
                // 如果不是默认管理员要排除用户管理和角色管理的权限
                // /system/role /system/user
                has = has && ONLY_SYSTEM_ADMIN_MENU.includes(item.menuUrl);
            }
            return has;
        });
        return menu;
    }

    // 数组转成树
    menuToTree(menu: Menu[]) {
        const newArr = [];
        // 生成一级菜单
        const topMenu = menu.filter((m) => m.parentId === '');
        topMenu.forEach((item) => {
            const route = {
                ...item,
                routeName: item.routeName || undefined,
                icon: item.icon || undefined,
                children: undefined,
                // 默认打开主页
                defaultRoute: undefined,
            };
            // 生成二级菜单
            const childMenu = menu.filter((m) => compareObjectId(item._id, m.parentId));
            if (childMenu.length) {
                childMenu.sort((a, b) => {
                    return (a.order || 0) - (b.order || 0);
                });
                // 三级菜单
                const sonMenu = childMenu.map((child: any) => {
                    // 生成三级菜单
                    // const childThreeMenu = menu.filter((m) => child._id?.equals(m.parentId as string));
                    // return { ...child, children: [...childThreeMenu] };
                    return { ...child };
                });
                route.children = [...sonMenu];
                route.defaultRoute = {
                    title: sonMenu[0].menuName,
                    name: sonMenu[0].routeName,
                    path: sonMenu[0].menuUrl,
                };
            }
            newArr.push(route);
        });
        newArr.sort((a, b) => {
            return (a.order || 0) - (b.order || 0);
        });
        return newArr;
    }
}
