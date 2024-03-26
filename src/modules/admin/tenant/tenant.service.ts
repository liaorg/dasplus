import { genCacheKey } from '@/common/helps';
import { AnyObject } from '@/common/interfaces';
import { InjectMongooseRepository, MongooseRepository } from '@/common/repository';
import { BaseService } from '@/common/services';
import { catchAwait, createPassword, getUTCTime, isEmpty } from '@/common/utils';
import { defaultRoleGroupOid } from '@/init/auth/consts';
import { AdminRouteService } from '@/modules/core/admin-route/admin-route.service';
import { RoleGroupNameEnum } from '@/modules/core/role-group/enums';
import { RoleGroupService } from '@/modules/core/role-group/role-group.service';
import { SNOW_FLAKE_DEFAULT_SERVICE } from '@/shared/snow-flake/snow-flake.providers';
import { SnowFlakeService } from '@/shared/snow-flake/snow-flake.service';
import { Inject, Injectable } from '@nestjs/common';
import { TENANT_NOT_ADMIN_ROUTE, TENANT_NOT_MENU } from '../menu/constants';
import { MenuService } from '../menu/menu.service';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';
import { CreateTenantDto, QueryTenantDto } from './dto';
import { Tenant } from './schemas';

@Injectable()
export class TenantService extends BaseService<Tenant> {
    constructor(
        @InjectMongooseRepository(Tenant.name) protected readonly repository: MongooseRepository<Tenant>,
        @Inject(SNOW_FLAKE_DEFAULT_SERVICE) private readonly snowFlakeService: SnowFlakeService,
        private readonly menuService: MenuService,
        private readonly adminRouteService: AdminRouteService,
        private readonly roleGroupService: RoleGroupService,
        private readonly roleService: RoleService,
        private readonly userService: UserService,
    ) {
        const cacheKey: string = genCacheKey('TenantService');
        super(repository, cacheKey);
        // 缓存数据
        this.initCache();
    }

    // 添加租户
    async addTenant(post: CreateTenantDto) {
        // 当前时间戳
        const now = getUTCTime();
        // 当前年份
        const year = now.year();
        const { name, description, email } = post;
        // 租户要同时新增加三个默认角色和对应的用户
        // 生成租户 id
        const tenantId = (await this.snowFlakeService.nextId()) as number;
        const doc = {
            name,
            tenant_id: tenantId,
            status: 1,
            email,
            description,
        };
        // 要添加的角色和用户信息
        const roleAndUserInfo = [
            {
                roleGroupid: defaultRoleGroupOid.auditAdmin,
                roleName: `tenant_${RoleGroupNameEnum.auditAdmin}_`,
                userName: 'audit_',
                userPassword: await createPassword(`A_udit@${year}`),
            },
            {
                roleGroupid: defaultRoleGroupOid.securityAdmin,
                roleName: `tenant_${RoleGroupNameEnum.securityAdmin}_`,
                userName: 'sec_',
                userPassword: await createPassword(`S_ec@${year}`),
            },
            {
                roleGroupid: defaultRoleGroupOid.systemAdmin,
                roleName: `tenant_${RoleGroupNameEnum.systemAdmin}_`,
                userName: 'admin_',
                userPassword: await createPassword(`A_dmin@${year}`),
            },
        ];
        // 事务操作，失败后回滚
        const addedTenant = await this.transaction(async (session) => {
            // 写入数据库
            const [errAdded, added] = await catchAwait(
                this.insert({
                    doc,
                    options: { session },
                }),
            );
            console.log('roleErrAdded || !addedRole::: ', added._id, added);
            if (errAdded || !added) {
                return false;
            }
            const tenantObjectId = added._id;
            // 获取租户有的权限值
            const permissionIds = await this.findPermission();
            // 创建角色和用户
            const [err, rep] = await catchAwait(
                Promise.all(
                    roleAndUserInfo.map(async (item) => {
                        // 创建角色
                        const roleGroupId = item.roleGroupid;
                        // 查询角色组的权限值
                        const roleGroup = await this.roleGroupService.findById(roleGroupId, {
                            options: { fields: 'permissions' },
                        });
                        const roleGroupPermissions = roleGroup.permissions.map((value) =>
                            value.toString(),
                        );
                        const rolePermissions = permissionIds.filter((id) => {
                            return roleGroupPermissions.includes(id.toString());
                        });
                        const roleDoc = {
                            name: `${item.roleName}${tenantId}`,
                            status: 1,
                            isDefault: false,
                            roleGroup: roleGroupId,
                            permissions: rolePermissions,
                            tenant: tenantObjectId,
                        };
                        // 写入数据库
                        const [roleErrAdded, addedRole] = await catchAwait(
                            this.roleService.insert({
                                doc: roleDoc,
                                options: { session, rawResult: true },
                            }),
                        );
                        if (roleErrAdded || !addedRole) {
                            return Promise.reject('error');
                        }
                        const roleId = addedRole._id;
                        // 更新角色组的信息
                        const [roleGroupErr, roleGroupUpdate] = await catchAwait(
                            this.roleGroupService.updateOne({
                                filter: { _id: roleGroupId },
                                doc: { $addToSet: { roles: roleId } },
                                options: { session },
                            }),
                        );
                        if (roleGroupErr || !roleGroupUpdate) {
                            return Promise.reject('error');
                        }
                        // 创建用户
                        const userDoc = {
                            name: `${item.userName}${tenantId}`,
                            // 默认密码
                            password: item.userPassword,
                            role: roleId,
                            tenant: tenantObjectId,
                        };
                        // 写入数据库
                        const [userErrAdded, addedUser] = await catchAwait(
                            this.userService.insert({
                                doc: userDoc,
                                options: { session, rawResult: true },
                            }),
                        );
                        if (userErrAdded || !addedUser) {
                            return Promise.reject('error');
                        }
                        // 更新角色的信息
                        const [roleErr, updatedRole] = await catchAwait(
                            this.roleService.findByIdAndUpdate(roleId, {
                                doc: { $addToSet: { users: addedUser._id } },
                                options: { session },
                            }),
                        );
                        if (roleErr || !updatedRole) {
                            return Promise.reject('error');
                        }
                        return { role: addedRole, user: addedUser };
                    }),
                ),
            );
            if (err || !rep?.length) {
                return false;
            }
            return { tenant: added, roleAndUser: rep };
        });
        return addedTenant;
    }

    // 获取租户有的权限值
    // 包括菜单 menu，路由 adin_route
    async findPermission() {
        const [menu, adminRoute] = await Promise.all([
            // 查询菜单权限值
            this.menuService.find({
                filter: { menuUrl: { $nin: TENANT_NOT_MENU } },
                options: { fields: 'permission' },
            }),
            // 查询路由权限值
            this.adminRouteService.find({
                filter: { menuPath: { $nin: TENANT_NOT_MENU }, path: { $nin: TENANT_NOT_ADMIN_ROUTE } },
                options: { fields: 'permission' },
            }),
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

    // 生成查询条件
    createQueryWhere(post: QueryTenantDto) {
        const { tenant_id, name, status, description } = post;
        const where: AnyObject = {};
        // id
        if (tenant_id) {
            where.tenant_id = tenant_id;
        }
        // 名称
        if (name) {
            where.name = { $regex: name, $options: 'i' };
        }
        // 状态
        if (status !== -1) {
            where.status = status;
        }
        // 描述
        if (description) {
            where.description = { $regex: description, $options: 'i' };
        }
        return where;
    }
}
