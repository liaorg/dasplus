import { RoleError, RoleGroupError } from '@/common/constants';
import { InjectMongooseRepository } from '@/common/repository';
import { MongooseRepository } from '@/common/repository/mongoose.repository';
import { BaseService, ObjectIdType } from '@/common/services';
import {
    compareObjectId,
    hasChange,
    hasChangeWith,
    includesObjectId,
    toObjectId,
    uniqArray,
} from '@/common/utils';
import { catchAwait, isEmpty } from '@/common/utils/help';
import { defaultAdminRoute } from '@/init/auth/consts';
import { AdminRouteService } from '@/modules/core/admin-route/admin-route.service';
import { AdminRoute } from '@/modules/core/admin-route/schemas';
import { RoleGroupTypeEnum } from '@/modules/core/role-group/enums';
import { RoleGroupException } from '@/modules/core/role-group/role-group.exception';
import { RoleGroupService } from '@/modules/core/role-group/role-group.service';
import { RoleGroup } from '@/modules/core/role-group/schemas';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { I18nContext } from 'nestjs-i18n';
import { ONLY_SYSTEM_ADMIN_MENU } from '../menu/constants';
import { MenuService } from '../menu/menu.service';
import { Menu } from '../menu/schemas';
import { UserDocument } from '../user/schemas';
import { UserService } from '../user/user.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleException } from './role.exception';
import { Role, RoleDocument } from './schemas';

@Injectable()
export class RoleService extends BaseService<Role> {
    constructor(
        @InjectMongooseRepository(Role.name) protected readonly repository: MongooseRepository<Role>,
        @Inject(forwardRef(() => MenuService)) private readonly menuService: MenuService,
        private readonly roleGroupService: RoleGroupService,
        private readonly adminRouteService: AdminRouteService,
        private readonly userService: UserService,
    ) {
        super(repository);
    }

    // 添加角色
    async addRole(createRole: CreateRoleDto): Promise<RoleDocument> {
        const { name, roleGroupId, permissionIds, description } = createRole;
        // 获取额外的报表任务菜单，即不在菜单中显示的菜单权限
        const ids = await this.findReportTaskMenuPermission(permissionIds);
        const [_hasName, hasGroup, menu] = await Promise.all([
            // 查询角色名是否已经存在
            this.notHasRoleName(name),
            // 检查角色组是否存在
            this.mustHasByRoleGroupId(roleGroupId),
            // 权限值必须存在，查询角色菜单权限
            this.mustHasPermissionIds(ids, roleGroupId),
        ]);
        // 获取额外的路由的操作权限
        const menuUrl = menu.map((item) => item.menuUrl);
        const [route, otherPermission] = await Promise.all([
            // 获取菜单包含的路由权限
            this.adminRouteService.find({ filter: { menuPath: { $in: menuUrl } } }),
            // 获取额外的路由的操作权限
            this.findOtherRoutePermission(hasGroup.type),
        ]);
        const routePermission = route.map((item) => item.permission.toString());
        const doc = {
            name,
            status: 1,
            // 不能添加为默认角色
            isDefault: false,
            roleGroup: toObjectId(roleGroupId),
            permissions: uniqArray([...ids, ...routePermission, ...otherPermission]),
            description,
        };
        // 事务操作，失败后回滚
        const addedRole = await this.transaction(async (session) => {
            // 写入数据库
            const [errAdded, added] = await catchAwait(this.insert({ doc, options: { session } }));
            if (errAdded || !added) {
                return false;
            }
            // 更新角色组的信息
            const [err, update] = await catchAwait(
                this.roleGroupService.findByIdAndUpdate(roleGroupId, {
                    doc: { $addToSet: { roles: added._id } },
                    options: { session },
                }),
            );
            if (err || !update) {
                return false;
            }
            return added;
        });
        if (!addedRole) {
            const error = {
                ...RoleError.addFailed,
            };
            throw new RoleException(error);
        }
        return addedRole;
    }

    // 获取指定角色信息，包含默认用户
    async findRoleContainDefaultAdminer(filter: any) {
        const role = await this.findOnePopulate({
            filter,
            populateOptions: ['roleGroup', 'defaultUser'],
        });
        return role;
    }

    // 更新角色
    async updateById(id: ObjectIdType, updateRole: UpdateRoleDto, oldRole: Role): Promise<any> {
        const { name, roleGroupId, permissionIds, userId } = updateRole;
        // 提取修改内容
        const withKey = ['name', 'description'];
        const { change, target } = hasChangeWith(withKey, oldRole, updateRole);
        // 检查角色名是否存在
        if (change.includes('name')) {
            await this.notHasRoleName(name);
        }
        // 要清除旧管理员的token
        let mastClearToken = false;
        // 修改角色组，权限值时不能包含默认角色
        let mustNotInDefaultRole = false;
        const oldRoleGropup = oldRole.roleGroup as RoleGroup;
        // 新角色组id
        let newRoleGroupId = oldRoleGropup._id;
        let newRoleGroupType = oldRoleGropup.type;
        // 角色组有改变时才检查
        // 必须更新角色组？
        let mustUpdateRoleGroup = false;
        if (roleGroupId && roleGroupId !== oldRoleGropup._id.toString()) {
            newRoleGroupId = toObjectId(roleGroupId);
            // 不能修改默认角色的角色组
            this.notHasDefaultRole(oldRole);
            // 检查角色组是否存在
            const newRoleGroup = await this.mustHasByRoleGroupId(roleGroupId);
            mustNotInDefaultRole = true;
            mustUpdateRoleGroup = true;
            newRoleGroupType = newRoleGroup.type;
            change.push('roleGroup');
            target.roleGroup = newRoleGroupId;
            mastClearToken = true;
        }
        if (oldRole.isDefault) {
            // 固定一下排序
            target.order = newRoleGroupType;
        }
        // 获取额外的报表任务菜单，即不在菜单中显示的菜单权限
        const ids = await this.findReportTaskMenuPermission(permissionIds);
        // 权限有修改时才检查
        // 查询菜单权限 id 是否存在
        if (!isEmpty(ids)) {
            // 不能修改默认角色的菜单权限，路由权限
            this.notHasDefaultRole(oldRole);
            // 权限值必须存在，查询角色菜单权限
            const menu = await this.mustHasPermissionIds(ids, newRoleGroupId);
            const menuUrl = menu.map((item) => item.menuUrl);
            const [route, otherPermission] = await Promise.all([
                // 获取菜单包含的路由权限
                this.adminRouteService.find({ filter: { menuPath: { $in: menuUrl } } }),
                // 获取额外的路由的操作权限
                this.findOtherRoutePermission(newRoleGroupType),
            ]);
            const routePermission = route.map((item) => item.permission.toString());
            const newPermission = uniqArray([...ids, ...routePermission, ...otherPermission]);
            const oldPermissions = oldRole.permissions.map((value: any) => value.toString());
            const changePermission = hasChange(oldPermissions, newPermission);
            if (changePermission.length) {
                mustNotInDefaultRole = true;
                mastClearToken = true;
                change.push('permissions');
                target.permissions = newPermission;
            }
        }
        // 有修改默认管理员时，只有默认管理员组才有默认管理员用户
        const oldRoleDefaultUser = oldRole.defaultUser as UserDocument;
        // 必须更新默认用户
        let musetUpdateDefaultUser = false;
        if (userId && userId !== oldRoleDefaultUser._id.toString()) {
            this.mustHasDefaultRole(oldRole);
            // 查询新设置的用户是否存在
            const user = await this.findOneUser(userId, id);
            if (isEmpty(user)) {
                const error = {
                    ...RoleError.notContainUser,
                    args: { userId, roleId: oldRole.name },
                };
                throw new RoleException(error);
            }
            musetUpdateDefaultUser = true;
            change.push('defaultUser');
            target.defaultUser = toObjectId(userId);
            mastClearToken = true;
        }

        if (change.length) {
            // 事务操作，失败后回滚
            return this.transaction(async (session) => {
                if (mustUpdateRoleGroup) {
                    // 更新角色组信息
                    // 删除旧角色组中的角色
                    const deletedRoleGroupRoles = await this.roleGroupService.updateOne({
                        filter: { _id: oldRoleGropup._id },
                        doc: { $pull: { roles: oldRole._id } },
                        options: { session },
                    });
                    // 失败返回 false 进行事务回滚
                    if (!deletedRoleGroupRoles?.acknowledged) {
                        return false;
                    }
                    // 添加新角色到角色组中
                    const addedRoleGroupRoles = await this.roleGroupService.updateOne({
                        filter: { _id: newRoleGroupId },
                        doc: { $addToSet: { roles: oldRole._id } },
                        options: { session },
                    });
                    // 失败返回 false 进行事务回滚
                    if (!addedRoleGroupRoles?.acknowledged) {
                        return false;
                    }
                    // 如果安全员角色变成其他角色
                    if (
                        oldRoleGropup.type === RoleGroupTypeEnum.securityAdmin &&
                        newRoleGroupType !== oldRoleGropup.type
                    ) {
                        // 删除旧角色下用户的业务权限
                        const business = { id: [], name: [] };
                        const updateUserBusiness = await this.userService.updateOne({
                            filter: { role: oldRole._id },
                            doc: { business },
                            options: { session },
                        });
                        if (!updateUserBusiness?.acknowledged) {
                            return false;
                        }
                    }
                }
                if (musetUpdateDefaultUser) {
                    // 必须更新默认用户
                    const updatedDefaultAdminer = await this.updateDefaultAdminer(
                        userId,
                        oldRole,
                        oldRoleDefaultUser._id,
                        session,
                    );
                    // 失败返回 false 进行事务回滚
                    if (!updatedDefaultAdminer) {
                        return false;
                    }
                }
                // 更新角色信息
                const updated = await this.updateRole(
                    target,
                    oldRole._id,
                    mustNotInDefaultRole,
                    session,
                );
                // 失败返回 false 进行事务回滚
                if (!updated?.acknowledged) {
                    return false;
                }
                return { updated, change, mastClearToken };
            });
        } else {
            return true;
        }
    }
    // 修改角色，修改角色组，权限值时不能包含默认角色
    async updateRole(
        updateRole: Partial<Role>,
        id: ObjectIdType,
        mustNotInDefaultRole: boolean,
        session: ClientSession,
    ) {
        const param: any = {
            filter: { _id: id },
            doc: { ...updateRole },
            options: { session },
        };
        if (mustNotInDefaultRole) {
            param.filter.isDefault = false;
        }
        const updated = await this.updateOne(param);
        // if (!updated.acknowledged) {
        //     const error = {
        //         ...RoleError.updateFailed,
        //     };
        //     throw new RoleException(error);
        // }
        return updated;
    }
    // 检查角色名是否存在
    async notHasRoleName(name: string) {
        let data: any;
        if (name) {
            data = await this.exists({ filter: { name } });
        }
        if (data) {
            const error = {
                ...RoleError.existedName,
                args: { name },
            };
            throw new RoleException(error);
        }
        return true;
    }
    // 不能修改默认角色的角色组、业务权限、菜单权限、路由权限
    notHasDefaultRole(role: Role) {
        if (role.isDefault) {
            const error = {
                ...RoleError.unModifyDefaultRoleNameMenuBusiness,
            };
            throw new RoleException(error);
        }
        return true;
    }
    // 必须是默认角色
    mustHasDefaultRole(role: Role) {
        if (!role.isDefault) {
            const error = {
                ...RoleError.mustDefaultRole,
            };
            throw new RoleException(error);
        }
        return true;
    }

    // 删除角色
    async remove(oldRole: Role): Promise<boolean> {
        // 不能删除当前登录用户所属于的角色，即自己不能删除自己
        // 只有默认系统管理员有角色管理权限，这边可以去掉不判断
        // await this.notHasLoginRole([id], loginUserId);
        // 事务操作，失败后回滚
        return this.transaction(async (session) => {
            // 先删除角色下的用户，再删除角色
            const [deletedUser, deleteRole, updateRoleGroup] = await Promise.all([
                // 删除角色下的用户
                this.userService.deleteMany({ filter: { role: oldRole._id }, options: { session } }),
                // 删除角色
                // 不能删除默认管理员角色
                this.deleteOne({
                    filter: { _id: oldRole._id, isDefault: false },
                    options: { session },
                }),
                // 删除角色组中对应的角色
                this.roleGroupService.findByIdAndUpdate(oldRole.roleGroup as ObjectIdType, {
                    doc: { $pull: { roles: oldRole._id } },
                    options: { session },
                }),
            ]);
            if (!deletedUser || !deleteRole || !updateRoleGroup) {
                return false;
            }
            return true;
        });
    }

    // 根据 id 查找
    async findByRoleId(id: ObjectIdType, status?: number) {
        const param: any = { filter: { _id: id } };
        if (status) {
            param.filter.status = status;
        }
        const data = await this.findOne(param);
        if (isEmpty(data)) {
            const error = {
                ...RoleError.notExisted,
                args: { id },
            };
            throw new RoleException(error);
        }
        return data;
    }

    // 设置默认角色的管理员用户
    // 约定：默认角色组的id与默认角色id是一样的
    // 且用户要是默认角色的用户
    async updateDefaultAdminer(
        userId: ObjectIdType,
        oldRole: Role,
        oldUserId: ObjectIdType,
        session?: ClientSession,
    ) {
        const uid = toObjectId(userId);

        // 如果是安全员
        const business = { id: [], name: [] };
        const newBusiness = { id: [], name: [] };
        if ((oldRole.roleGroup as RoleGroup).type === RoleGroupTypeEnum.securityAdmin) {
            newBusiness.id = [-1];
        }
        // 还原旧的默认管理员设置
        const updateOld = await this.userService.updateOne({
            filter: { _id: oldUserId },
            doc: { isDefault: false, business: business },
            options: { session },
        });
        if (!updateOld.modifiedCount) {
            return false;
        }
        const [updateNew, updateRole] = await Promise.all([
            // 设置新的默认管理员用户,改变其所属角色
            this.userService.updateOne({
                filter: { _id: userId },
                doc: { isDefault: true, business: newBusiness },
                options: { session },
            }),
            // 更新角色的默认用户
            this.updateOne({
                filter: { _id: oldRole._id },
                doc: { defaultUser: uid },
                options: { session },
            }),
        ]);
        if (updateNew.modifiedCount && updateRole.modifiedCount) {
            return updateRole;
        }
        return false;
    }
    // 查找单个用户
    async findOneUser(userId: ObjectIdType, roleId: ObjectIdType) {
        const user = await this.userService.findOne({
            filter: { _id: userId, role: toObjectId(roleId) },
        });
        return user;
    }

    // 根据角色组id，获取用户名称下拉列表
    async findUserList(roleGroupId?: ObjectIdType) {
        const group = await this.findOnePopulate({
            filter: { roleGroup: toObjectId(roleGroupId) },
            populateOptions: { path: 'users', options: { order: 1, _id: -1 } },
        });
        return group;
    }
    // 根据角色组type，获取用户名称下拉列表
    async findUserListByType(roleGroupType: RoleGroupTypeEnum) {
        // 获取角色组下的角色
        const roleRroup = await this.roleGroupService.findOnePopulate({
            filter: { type: roleGroupType },
            populateOptions: { path: 'roles', populate: 'users' },
        });
        return roleRroup?.roles;
    }

    // 获取角色组下拉列表
    async findRoleGroupList() {
        return await this.roleGroupService.find({ options: { sort: { order: 1, _id: -1 } } });
    }

    // 根据 id 查找角色组是否存在
    async mustHasByRoleGroupId(id: ObjectIdType) {
        let data: RoleGroup;
        if (id) {
            data = await this.roleGroupService.findById(id);
        }
        if (!data) {
            const error = {
                ...RoleGroupError.notExisted,
                args: { id },
            };
            throw new RoleGroupException(error);
        }
        return data;
    }

    // 根据 ids 查找权限，只有默认系统管理员 defaultSystemAdmin - admin 才有角色管理和用户管理
    // 添加/修改时要排除角色管理和用户管理的权限
    // 要在所属角色组中
    async mustHasPermissionIds(ids: ObjectIdType[], roleGroupId: ObjectIdType) {
        const [roleGropup, excludeIds, menu] = await Promise.all([
            // 查询角色组的权限值
            this.roleGroupService.findById(roleGroupId),
            // 找出要排除的权限id
            this.findOfDefaultAdmin(),
            // 获取菜单信息
            this.menuService.find({ filter: { permission: { $in: toObjectId(ids) } } }),
        ]);
        // 返回没有包含在排除权限中的值
        const permissions = (roleGropup?.permissions as string[]).filter(
            (value) => !includesObjectId(excludeIds, value),
        );
        // 查询权限是否都在
        const data = ids?.filter((value) => includesObjectId(permissions, value));
        // 包含角色组不存在的权限
        if (!data.length || !menu?.length) {
            const error = {
                ...RoleError.containNonePermission,
            };
            throw new RoleException(error);
        }
        return menu;
    }
    // 获取只有默认管理员才有的权限值
    // 包括菜单 menu，路由 adin_route
    // 如果不是系统安全员，还要排除 business 的权限 id
    async findOfDefaultAdmin() {
        const [menu, adminRoute] = await Promise.all([
            // 查询菜单权限值
            this.menuService.find({ filter: { menuUrl: { $in: ONLY_SYSTEM_ADMIN_MENU } } }),
            // 查询路由权限值
            this.adminRouteService.find({ filter: { menuPath: { $in: ONLY_SYSTEM_ADMIN_MENU } } }),
        ]);
        const permissionIds = [];
        // 合并菜单权限
        !isEmpty(menu) &&
            menu.forEach((value) => {
                permissionIds.push(value.permission);
            });
        // 合并路由权限
        !isEmpty(adminRoute) &&
            adminRoute.forEach((value) => {
                permissionIds.push(value.permission);
            });
        return permissionIds;
    }

    // 根据角色组，获取菜单权限下拉列表
    async findMenuByRoleGroup(roleGroupId: ObjectIdType) {
        // 查询角色组的权限值
        const roleGroup = await this.roleGroupService.findById(roleGroupId);
        // 再获取角色组菜单
        const param: any = {
            filter: {
                status: 1,
                permission: { $in: roleGroup?.permissions },
            },
        };
        const menu = await this.menuService.find(param);
        return menu;
    }

    // 根据角色，获取菜单权限下拉列表
    async findMenuByRole(roleId: ObjectIdType) {
        // 先获取角色权限
        const role = await this.findById(roleId);
        // 再获取角色菜单
        const param: any = {
            filter: {
                status: 1,
                permission: { $in: role?.permissions },
            },
        };
        const menu = await this.menuService.find(param);
        return menu;
    }

    // 根据角色组，获取路由权限
    async findAdminRouteByRoleGroup(roleGroupId: ObjectIdType) {
        // 查询角色组的权限值
        const roleGroup = await this.roleGroupService.findById(roleGroupId);
        // 再获取角色组路由
        const param: any = {
            filter: {
                permission: { $in: roleGroup?.permissions },
            },
        };
        const adminRoute = await this.adminRouteService.find(param);
        return adminRoute;
    }

    // 根据角色，获取路由权限
    async findAdminRouteByRole(roleId: ObjectIdType) {
        // 先获取角色权限
        const role = await this.findById(roleId);
        // 再获取角色路由权限
        const param: any = {
            filter: {
                permission: { $in: role?.permissions },
            },
        };
        const adminRoute = await this.adminRouteService.find(param);
        return adminRoute;
    }

    // 获取所有菜单
    findAllMenu() {
        return this.menuService.find();
    }

    // 获取额外的路由的操作权限，即不在菜单下的权限
    async findOtherRoutePermission(groupType: RoleGroupTypeEnum) {
        const $or = [];
        defaultAdminRoute.forEach((item) => {
            if (item.roleGroupType === '*') {
                // 所有角色都必须有的路由
                $or.push({ path: item.path, method: item.method });
            } else if (item.roleGroupType.length > 1 && item.roleGroupType.includes(groupType)) {
                // 有包含该角色时
                $or.push({ path: item.path, method: item.method });
            }
        });
        // 获取路由权限
        const allRoute = await this.adminRouteService.find({
            filter: { $or },
        });
        // 过滤出权限id
        const permission = allRoute.map((item) => item.permission.toString());
        return permission;
    }

    // 获取额外的报表任务菜单，即不在菜单中显示的菜单权限
    async findReportTaskMenuPermission(permissionIds: ObjectIdType[]) {
        const ids = uniqArray(permissionIds);
        // 包含报表任务时，要额外增加(周期性报表 一次性报表)
        const [reportTaskMenu, reportTypeMenu] = await Promise.all([
            // 查询菜单权限值
            this.menuService.findOne({ filter: { menuUrl: '/analysis/report-task' } }),
            // 获取周期性报表 一次性报表的权限
            this.menuService.find({
                filter: {
                    menuUrl: { $in: ['/analysis/cycle-reports/:id', '/analysis/once-reports/:id'] },
                },
            }),
        ]);
        if (ids.includes(reportTaskMenu.permission.toString())) {
            // 包含报表任务
            reportTypeMenu.forEach((m) => {
                ids.push(m.permission.toString());
            });
        } else {
            const reportTypePermission = reportTypeMenu.map((m) => m.permission.toString());
            // 不包含报表任务时要去除
            if (reportTypePermission.length) {
                return ids.filter((p) => !reportTypePermission.includes(p));
            }
        }
        return ids;
    }

    // 数组转成树
    menuToTree(menu: Menu[], adminRoute: AdminRoute[], i18n: I18nContext) {
        const newArr = [];
        // 生成一级菜单
        const topMenu = menu.filter((m) => m.parentId === '');
        topMenu.forEach((item) => {
            const topRoute = {
                key: item.permission,
                order: item.order,
                title: i18n.t(item.locale),
                disabled: false,
                menuUrl: item.menuUrl,
                hideInMenu: item.hideInMenu,
                children: [],
            };
            // 生成二级菜单
            const childMenu = menu.filter((m) => compareObjectId(item._id, m.parentId));
            if (childMenu.length) {
                childMenu.sort((a, b) => {
                    return (a.order || 0) - (b.order || 0);
                });
                childMenu.forEach((m) => {
                    // 用户管理和角色管理不能被选择 disabled
                    let disabled = false;
                    if (ONLY_SYSTEM_ADMIN_MENU.includes(m.menuUrl)) {
                        disabled = true;
                    }
                    topRoute.children.push({
                        order: m.order,
                        key: m.permission,
                        title: i18n.t(m.locale),
                        disabled,
                        menuUrl: m.menuUrl,
                        hideInMenu: m.hideInMenu,
                    });
                    // 查找路由权限并合并
                    const route = adminRoute.filter((r) => r.menuPath === m.menuUrl);
                    route.forEach((r) => {
                        // 用户管理和角色管理不能被选择 disabled
                        let disabled = false;
                        if (ONLY_SYSTEM_ADMIN_MENU.includes(r.menuPath)) {
                            disabled = true;
                        }
                        topRoute.children.push({
                            key: r.permission,
                            title: i18n.t(r.locale),
                            disabled,
                            menuUrl: r.menuPath,
                        });
                    });
                });
            }
            newArr.push(topRoute);
        });
        newArr.sort((a, b) => {
            return (a.order || 0) - (b.order || 0);
        });
        return newArr;
    }
    // 菜单权限列表
    menuToList(menu: Menu[], adminRoute: AdminRoute[], i18n?: I18nContext) {
        const newArr = [];
        // 生成一级菜单
        const topMenu = menu.filter((m) => m.parentId === '');
        topMenu.forEach((item) => {
            const topRoute = {
                order: item.order,
                title: i18n.t(item.locale),
                hideInMenu: item.hideInMenu,
                children: [],
            };
            // 生成二级菜单
            const childMenu = menu.filter((m) => compareObjectId(item._id, m.parentId));
            if (childMenu.length) {
                childMenu.sort((a, b) => {
                    return (a.order || 0) - (b.order || 0);
                });
                childMenu.forEach((m) => {
                    topRoute.children.push({
                        order: m.order,
                        title: i18n.t(m.locale),
                        hideInMenu: m.hideInMenu,
                    });
                    // 查找路由权限并合并
                    const route = adminRoute.filter((r) => r.menuPath === m.menuUrl);
                    route.forEach((r) => {
                        topRoute.children.push(i18n.t(r.locale));
                    });
                });
            }
            newArr.push(topRoute);
        });
        newArr.sort((a, b) => {
            return (a.order || 0) - (b.order || 0);
        });
        return newArr;
    }
}
