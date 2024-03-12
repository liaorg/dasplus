import { RoleError } from '@/common/constants';
import { ApiResult, ApiSecurityAuth } from '@/common/decorators';
import { PaginationDto, TreeNodeDto } from '@/common/dto';
import { OperateLogEnum } from '@/common/enum';
import { LogParam } from '@/common/interfaces';
import { ParseObjectIdPipe } from '@/common/pipes';
import { ObjectIdType } from '@/common/services';
import { emptyCallback, generateLog, isEmpty, success, toObjectId } from '@/common/utils';
import { AdminUserRoleGuard } from '@/modules/core/auth/guards';
import { TokenService } from '@/modules/core/auth/services';
import { RoleGroupListDto } from '@/modules/core/role-group/dto';
import { RoleGroup } from '@/modules/core/role-group/schemas';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { UserDocument } from '../user/schemas';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { RoleListDto, RoleMenuAdminRouteDto } from './dto/role.dto';
import { UpdateDefaultAdminerDto } from './dto/update-default-adminer.dto';
import { RoleException } from './role.exception';
import { RoleService } from './role.service';
import { Role } from './schemas';

// 出现多级路由时，多级的要排前面定义 role/role-group-list > role/:id

@ApiTags('系统管理-角色管理')
@ApiSecurityAuth()
@UseGuards(AdminUserRoleGuard)
@Controller('role')
export class RoleController {
    private logMoudle = 'role.module';
    private logType = OperateLogEnum.systemAdmin;
    constructor(
        private readonly service: RoleService,
        private readonly tokenService: TokenService,
    ) {}

    @ApiOperation({ summary: '获取角色组名称下拉列表' })
    @ApiResult({ type: [RoleGroupListDto] })
    @Get('role-group-list')
    async findRoleGroupList(@I18n() i18n: I18nContext) {
        const data = await this.service.findRoleGroupList();
        const list = [];
        !isEmpty(data) &&
            data.forEach((value) => {
                list.push({
                    ...value,
                    name: value.locale ? i18n.t(value.locale) : value.name,
                });
            });
        return list;
    }

    @ApiOperation({ summary: '根据角色组，获取用户名称下拉列表' })
    @ApiResult({ type: Role })
    @Get('user-list/:roleGroupId')
    async findUserList(@Param('roleGroupId', ParseObjectIdPipe) roleGroupId: ObjectIdType) {
        return await this.service.findUserList(roleGroupId);
    }

    @ApiOperation({ summary: '根据角色组，获取菜单树' })
    @ApiResult({ type: [TreeNodeDto] })
    @Get('menu-list/:roleGroupId')
    async findMenuTree(
        @Param('roleGroupId', ParseObjectIdPipe) roleGroupId: ObjectIdType,
        @I18n() i18n: I18nContext,
    ) {
        const [menu, adminRoute] = await Promise.all([
            // 获取菜单权限
            this.service.findMenuByRoleGroup(roleGroupId),
            // 获取路由权限
            // this.service.findAdminRouteByRoleGroup(roleGroupId),
            // 暂时只获取菜单就好了
            Promise.resolve([]),
        ]);
        // 合并菜单路由权限，生成菜单树
        return this.service.menuToTree(menu, adminRoute, i18n);
    }

    @ApiOperation({ summary: '获取角色菜单权限' })
    @ApiResult({ type: [RoleMenuAdminRouteDto] })
    @Get('menu-route/:roleId')
    async findMenuRoute(
        @Param('roleId', ParseObjectIdPipe) roleId: ObjectIdType,
        @I18n() i18n: I18nContext,
    ) {
        const [menu, adminRoute] = await Promise.all([
            // 获取菜单权限
            this.service.findMenuByRole(roleId),
            // 获取路由权限
            // this.service.findAdminRouteByRole(roleId),
            // 暂时只获取菜单就好了
            Promise.resolve([]),
        ]);
        // 合并菜单路由权限，生成菜单权限列表
        return this.service.menuToList(menu, adminRoute, i18n);
    }

    @ApiOperation({ summary: '设置角色组默认管理员' })
    @ApiResult({ type: Boolean })
    @Patch('default-adminer')
    async updateDefaultAdminer(@Body() update: UpdateDefaultAdminerDto, @I18n() i18n: I18nContext) {
        const oldRole = await this.service.findRoleContainDefaultAdminer({
            roleGroup: toObjectId(update.roleGroupId),
        });
        // 有修改默认管理员时，只有默认管理员组才有默认管理员用户
        const { userId } = update;
        const oldDefaultUserId = (oldRole.defaultUser as UserDocument)._id;
        let updated: any = true;
        let log: any = {};
        if (userId && userId !== oldDefaultUserId.toString()) {
            this.service.mustHasDefaultRole(oldRole);
            // 查询新设置的用户是否存在
            const user = await this.service.findOneUser(userId, oldRole._id.toString());
            if (isEmpty(user)) {
                const error = {
                    ...RoleError.notContainUser,
                    args: { userId, roleId: oldRole.name },
                };
                throw new RoleException(error);
            }
            // 事务操作，失败后回滚
            updated = await this.service.transaction((session) => {
                return this.service.updateDefaultAdminer(userId, oldRole, oldDefaultUserId, session);
            });
            if (!updated) {
                const error = {
                    ...RoleError.updateFailed,
                };
                throw new RoleException(error);
            }
            // 清除登录 token
            const userIds = [userId];
            if (oldDefaultUserId) {
                userIds.push(oldDefaultUserId);
            }
            await this.tokenService.clearAccessToken(userIds);
            log = {
                module: this.logMoudle,
                type: this.logType,
                content: 'role.updateDefaultAdminer',
                lanArgs: {
                    roleGroup: i18n.t(`role.${(oldRole.roleGroup as RoleGroup).name}`),
                    user: user.name,
                },
            };
        }
        // 创建带操作日志信息的返回数据
        return success(updated, log);
    }

    @ApiOperation({ summary: '角色表格分页数据' })
    @ApiResult({ type: RoleListDto, isPage: true })
    @Post('query')
    async findAll(@Body() query: PaginationDto) {
        const { current, pageSize, sort = { order: 1, _id: -1 } } = query;
        const filter = { status: 1 };
        // 关联查询所有用户和默认管理用户
        const populate = ['users', 'defaultUser', 'roleGroup'];
        const [roleList, menu] = await Promise.all([
            // 关联查询所有用户和默认管理用户
            this.service.findPagination({ filter, sort, current, pageSize, populate }),
            // 获取所有菜单
            this.service.findAllMenu(),
        ]);
        const [role, total] = roleList;
        menu.sort((a, b) => {
            return (a.order || 0) - (b.order || 0);
        });
        // 匹配每个角色的菜单
        const list = role.map((item) => {
            const value: any = { ...item };
            // 过滤出角色菜单权限
            value.menus = menu.filter((m) =>
                (item.permissions as ObjectIdType[]).includes(m.permission as ObjectIdType),
            );
            Reflect.deleteProperty(value, 'permissions');
            return value;
        });
        return { list, current, pageSize, total };
    }

    @ApiOperation({ summary: '添加角色' })
    @ApiResult({ type: Role })
    @Post()
    async create(@Body() createRole: CreateRoleDto) {
        const added = await this.service.addRole(createRole);
        if (!added) {
            const error = {
                ...RoleError.addFailed,
            };
            throw new RoleException(error);
        }
        // 日志
        const log = {
            module: this.logMoudle,
            type: this.logType,
            content: 'role.add',
            lanArgs: { name: createRole.name },
        };
        // 创建带操作日志信息的返回数据
        return success(added, log);
    }

    @ApiOperation({ summary: '获取角色信息' })
    @ApiResult({ type: Role })
    @Get(':roleId')
    async findRoleInfo(@Param('roleId', ParseObjectIdPipe) roleId: ObjectIdType) {
        // 获取指定角色信息包含默认用户
        return this.service.findRoleContainDefaultAdminer({ _id: roleId });
    }

    @ApiOperation({ summary: '修改角色' })
    @ApiResult({ type: Boolean || Role })
    @Patch(':roleId')
    async update(
        @Param('roleId', ParseObjectIdPipe) roleId: ObjectIdType,
        @Body() updateRole: UpdateRoleDto,
        @I18n() i18n: I18nContext,
    ) {
        // 检查角色是否存在
        // 获取指定角色信息包含默认用户
        const oldRole = await this.service.findRoleContainDefaultAdminer({ _id: roleId });
        if (isEmpty(oldRole)) {
            const error = {
                ...RoleError.notExisted,
                args: { id: roleId },
            };
            throw new RoleException(error);
        }
        const data = await this.service.updateById(roleId, updateRole, oldRole);
        if (!data) {
            const error = {
                ...RoleError.updateFailed,
            };
            throw new RoleException(error);
        }
        let updated: any = true;
        let log: any = {};
        if (data !== true) {
            updated = data.updated;
            const { change, mastClearToken } = data;
            if (mastClearToken) {
                // 清除用户的token
                this.tokenService.clearAccessTokenByRoleId([roleId]).catch(emptyCallback);
            }
            // 生成日志内容
            // 日志
            const logParam: LogParam = {
                change,
                name: oldRole.name,
                module: 'role',
                logType: this.logType,
                i18n,
            };
            if (change.includes('name') && updateRole.name) {
                logParam.other = i18n.t('role.log.changeName', { args: { name: updateRole.name } });
            }
            log = generateLog(logParam);
        }
        // 创建带操作日志信息的返回数据
        return success(updated, log);
    }

    @ApiOperation({ summary: '删除角色，角色下的用户也会删除' })
    @ApiResult({ type: Boolean })
    @Delete(':roleId')
    async remove(@Param('roleId', ParseObjectIdPipe) roleId: ObjectIdType) {
        // 检查角色是否存在
        const oldRole = await this.service.findByRoleId(roleId);
        if (isEmpty(oldRole)) {
            const error = {
                ...RoleError.notExisted,
                args: { id: roleId },
            };
            throw new RoleException(error);
        }
        // 不能删除默认角色
        if (oldRole.isDefault) {
            const error = {
                ...RoleError.unDeleteDefault,
            };
            throw new RoleException(error);
        }
        const deleted = await this.service.remove(oldRole);
        if (!deleted) {
            const error = {
                ...RoleError.deleteFailed,
            };
            throw new RoleException(error);
        }
        // 日志
        const log = {
            module: this.logMoudle,
            type: this.logType,
            content: 'role.del',
            lanArgs: { name: oldRole.name },
        };
        // 创建带操作日志信息的返回数据
        return success<boolean>(true, log);
    }
}
