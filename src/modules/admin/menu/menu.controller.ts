import { ApiResult, ApiSecurityAuth } from '@/common/decorators';
import { RequestUserDto } from '@/common/dto';
import { NotCheckMenuDecorator, RequestUserDecorator } from '@/modules/core/auth/decorators';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MenuRouteDto } from './dto/menu-route.dto';
import { MenuService } from './menu.service';

@ApiTags('系统管理-菜单')
@ApiSecurityAuth()
@Controller('menu')
export class MenuController {
    constructor(private readonly service: MenuService) {}

    @ApiOperation({ summary: '获取登录用户菜单' })
    @ApiResult({ type: [MenuRouteDto] })
    // 设置不验证获取菜单的权限 /admin/menu
    @NotCheckMenuDecorator()
    @Get()
    async findMenuTree(@RequestUserDecorator() loginUser: RequestUserDto): Promise<MenuRouteDto[]> {
        // 获取登录用户的角色
        const roleId = loginUser.roleId;
        // 获取菜单权限
        const menu = await this.service.findMenuByRoleId(roleId, !!loginUser.isDefault);
        // 生成菜单树
        return this.service.menuToTree(menu);
    }
}
