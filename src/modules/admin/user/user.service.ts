import { AdapterRequest } from '@/common/adapters';
import { AuthError, RoleError, UserError } from '@/common/constants';
import { RequestUserDto } from '@/common/dto';
import { InjectMongooseRepository, MongooseRepository } from '@/common/repository';
import { BaseService, ObjectIdType } from '@/common/services';
import {
    catchAwait,
    compareObjectId,
    compareUserPasswrod,
    createPassword,
    isEmpty,
    toObjectId,
    uniqArray,
} from '@/common/utils';
import { AdminRouteService } from '@/modules/core/admin-route/admin-route.service';
import { AuthException } from '@/modules/core/auth/auth.exception';
import { TokenService } from '@/modules/core/auth/services';
import { RoleGroupTypeEnum } from '@/modules/core/role-group/enums';
import { IDocument } from '@/types';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ClientSession, FilterQuery, QueryOptions } from 'mongoose';
import { ExtractJwt } from 'passport-jwt';
import { RoleException } from '../role/role.exception';
import { RoleService } from '../role/role.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './schemas';
import { UserException } from './user.exception';

// 抛出 500类(服务器错误)异常
@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        @InjectMongooseRepository(User.name) protected readonly repository: MongooseRepository<User>,
        // 有循环依赖时
        @Inject(forwardRef(() => RoleService)) private readonly roleService: RoleService,
        private readonly adminRouteService: AdminRouteService,
        private readonly tokenService: TokenService,
    ) {
        super(repository);
    }

    /**
     * 创建用户
     * @param createUser
     * @returns Promise<InsertResult>
     */
    async create(createUser: CreateUserDto) {
        const { name, roleId } = createUser;
        await Promise.all([
            // 检查用户名是否存在
            this.notHasUserName(name),
            // 检查角色是否存在
            this.mustHasRoleId(roleId),
        ]);
        const doc = {
            ...createUser,
            role: toObjectId(roleId),
        };
        doc.password = await createPassword(doc.password);
        // 写入数据库
        // 事务操作，失败后回滚
        const added = await this.transaction(async (session) => {
            // 写入数据库
            const [errAdded, addedUser] = await catchAwait(this.insert({ doc, options: { session } }));
            if (errAdded || !addedUser) {
                return false;
            }
            // 更新角色的信息
            const [err, update] = await catchAwait(
                this.roleService.findByIdAndUpdate(roleId, {
                    doc: { $addToSet: { users: addedUser._id } },
                    options: { session },
                }),
            );
            if (err || !update) {
                return false;
            }
            return addedUser;
        });
        return added;
    }

    // 获取指定用户包含角色信息
    async findUserInfo(id: ObjectIdType) {
        const user = await this.findOnePopulate({
            filter: { _id: id },
            populateOptions: {
                path: 'role',
                select: ['_id', 'name', 'isDefault', 'local'],
                populate: { path: 'roleGroup', select: ['_id', 'type', 'name'] },
            },
        });
        return user;
    }

    // 更新用户
    async updateById(
        id: ObjectIdType,
        updateUser: UpdateUserDto,
        oldUser: IDocument<User>,
        session?: ClientSession,
    ): Promise<any> {
        const { name, roleId } = updateUser;
        // 检查用户名是否存在
        if (name && name !== oldUser.name) {
            await this.notHasUserName(name);
        }
        const doc: any = { ...updateUser };
        // 检查角色是否存在
        // 角色有改变时才检查
        let deleteRoleUsers = (_session?: ClientSession) => Promise.resolve(true) as Promise<any>;
        let addRoleUsers = (_session?: ClientSession) => Promise.resolve(true) as Promise<any>;
        if (roleId && !compareObjectId(roleId, oldUser.role)) {
            const role = await this.mustHasRoleId(roleId);
            doc.role = role._id;
            // 更新角色信息
            // 删除旧角色中的用户
            deleteRoleUsers = (session?: ClientSession) =>
                this.roleService.findByIdAndUpdate(oldUser.role as ObjectIdType, {
                    doc: { $pull: { users: oldUser._id } },
                    options: { session },
                });
            // 添加新用户到角色中
            addRoleUsers = (session?: ClientSession) =>
                this.roleService.findByIdAndUpdate(roleId, {
                    doc: { $addToSet: { users: oldUser._id } },
                    options: { session },
                });
            // 如果角色信息改变了， 业务系统权限要重新分配
            doc.business = { id: [], name: [] };
            // 如果是安全员
            if (role.roleGroup.type === RoleGroupTypeEnum.securityAdmin) {
                doc.business = updateUser?.business;
            }
        }
        // 业务系统去重
        if (doc?.business && doc?.business?.id?.length) {
            doc.business = {
                id: uniqArray(updateUser.business.id),
                name: uniqArray(updateUser.business.name),
            };
        }
        // 如果有密码
        if (doc.password) {
            doc.password = await createPassword(doc.password);
            doc.password_update_date = Date.now();
        }
        // 更新数据库
        // 事务操作，失败后回滚
        return this.transaction(
            async (session) => {
                const [deletedRoleUsers, addedRoleUsers, updated] = await Promise.all([
                    deleteRoleUsers(session),
                    addRoleUsers(session),
                    // 更新用户信息
                    this.updateOne({ filter: { _id: id }, doc, options: { session } }),
                ]);
                // 失败返回 false 进行事务回滚
                if (!deletedRoleUsers || !addedRoleUsers || !updated) {
                    return false;
                }
                return updated;
            },
            { session },
        );
    }

    // 重置密码 根据id修改数据
    async resetPasswordByIds(ids: ObjectIdType[], updateUser: UpdateUserDto): Promise<any> {
        const [, has] = await Promise.all([
            // 不能包括默认系统管理员用户
            this.notHasDefaultSystemAdminer(ids),
            // 所有用户必须存在
            this.mustHasByIds(ids),
        ]);
        const doc = { ...updateUser };
        // 如果有密码
        if (doc.password) {
            doc.password = await createPassword(doc.password);
            // 重置密码后要强制修改密码
            doc.password_update_date = 0;
            const updated = await this.updateMany({ filter: { _id: { $in: ids } }, doc });
            // 影响行数是否等于传入的 id 数量
            // 有可能只更新了少数几条
            if (updated.modifiedCount === ids.length) {
                return has.names;
            }
            return false;
        }
        return false;
    }
    // 不能包括默认系统管理员用户
    async notHasDefaultSystemAdminer(ids: ObjectIdType[]) {
        const filter = { _id: { $in: ids }, isDefault: 1 };
        const options = { populate: { path: 'roles', match: { type: RoleGroupTypeEnum.systemAdmin } } };
        const count = await this.countDocuments({ filter, options });
        if (count) {
            const error = {
                ...UserError.unContainSystemDefault,
            };
            throw new UserException(error);
        }
        return true;
    }

    // 批量删除用户 根据id删除数据
    async removeByIds(ids: ObjectIdType[], session: ClientSession): Promise<any> {
        // 所有用户必须存在
        const has = await this.mustHasByIds(ids);
        const filter = { _id: { $in: ids }, isDefault: false };
        const deleted = await this.deleteMany({ filter, options: { session } });
        // 影响行数是否等于传入的 id 数量
        // 有可能只删除少数几条
        if (deleted.deletedCount === ids.length) {
            // 删除角色表中的用户
            const updateRole = await this.roleService.updateMany({
                filter: { _id: { $in: has.roles } },
                doc: { $pull: { users: { $in: toObjectId(ids) } } },
                options: { session },
            });
            if (!updateRole?.acknowledged) {
                return false;
            }
            return has.names;
        }
        // 失败返回 false 进行事务回滚
        return false;
    }

    // 获取指定用户包含密码
    async findOneContainPassword(filter: FilterQuery<User>, options?: QueryOptions<User>) {
        const projection = '+password';
        const user = await this.findOne({ filter, projection, options });
        return user as IDocument<User>;
    }

    // 根据 id 查找用户
    async findByUserId(id: ObjectIdType) {
        const data = await this.findById(id);
        if (isEmpty(data)) {
            const error = {
                ...UserError.notExisted,
                args: { id },
            };
            throw new UserException(error);
        }
        return data;
    }

    // 所有用户必须存在
    async mustHasByIds(ids: ObjectIdType[]) {
        ids = ids?.length ? ids : [];
        const data = await this.find({ filter: { _id: { $in: ids } } });
        if (!data) {
            const error = {
                ...UserError.notExisted,
                args: { id: ids?.join() },
            };
            throw new UserException(error);
        } else {
            if (data.length !== ids?.length) {
                const error = {
                    ...UserError.containNotExistUser,
                    args: { ids: ids?.join() },
                };
                throw new UserException(error);
            }
            const names = [];
            const roles = [];
            data.forEach((value) => {
                names.push(value.name);
                roles.push(value.role);
            });
            return { names, roles };
        }
    }
    // 检查用户名是否存在
    async notHasUserName(name: string) {
        let data: any;
        if (name) {
            data = await this.exists({ filter: { name } });
        }
        if (data) {
            const error = {
                ...UserError.existedName,
                args: { name },
            };
            throw new UserException(error);
        }
        return true;
    }

    // 根据 roleId 查找
    async mustHasRoleId(roleId: ObjectIdType) {
        let data: any;
        if (roleId) {
            data = await this.roleService.findById(roleId, { options: { populate: 'roleGroup' } });
        }
        if (!data) {
            const error = {
                ...RoleError.notExisted,
                args: { roleId },
            };
            throw new RoleException(error);
        }
        return data;
    }
    // 检查旧密码是否正确
    async matchPassword(target: string, source: string) {
        // 判断是否相等
        if (!(await compareUserPasswrod(target, source))) {
            const error = {
                ...UserError.passwordError,
            };
            throw new UserException(error);
        }
        return true;
    }

    // 获取系统安全员组用户的业务系统信息
    async findUserBusiness(userid?: ObjectIdType) {
        const param = {
            filter: { _id: userid },
            populateOptions: {
                path: 'role',
                populate: { path: 'roleGroup', match: { type: RoleGroupTypeEnum.securityAdmin } },
            },
        };
        const business = await this.findPopulate(param);
        return business;
    }

    // 获取角色名称下拉列表
    async findRoleList() {
        const options = { populate: 'roleGroup', sort: { order: 1, _id: -1 } };
        return await this.roleService.find({ options });
    }

    // 根据角色id，获取路由权限
    async matchRoutePermission(roleId: ObjectIdType, path: string, method: string) {
        // 先获取角色权限
        const role = await this.roleService.findById(roleId);
        // 再获取角色路由权限
        const param: any = {
            filter: {
                permission: { $in: role?.permissions || [] },
                path,
                method,
            },
        };
        const adminRoute = await this.adminRouteService.findOne(param);
        return adminRoute;
    }

    /**
     * 刷新登录 token
     * @param user
     */
    async refreshToken(reqUser: RequestUserDto, req: AdapterRequest) {
        // 更新 token，实际为更新 create_date update_date
        return await this.tokenService.updateAccessTokenByUserid(reqUser._id, req.ip);
    }

    /**
     * 注销登录
     *
     * @param {Request} req
     * @returns
     * @memberof AuthService
     */
    async logout(req: AdapterRequest) {
        const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req as any);
        if (accessToken) {
            return await this.tokenService.removeAccessToken(accessToken);
        }
        const error = {
            statusCode: 403,
            ...AuthError.forbiddenLogout,
        };
        throw new AuthException(error);
    }

    /**
     * 用户登录，查询用户是否存在
     * @param name
     * @param passwd
     * @returns
     */
    async validateUser(name: string, passwd: string): Promise<any> {
        // 获取指定用户包含密码
        const options = {
            populate: {
                path: 'role',
                select: ['_id', 'name', 'isDefault'],
                populate: { path: 'roleGroup', select: ['_id', 'type', 'name'] },
            },
        };
        const user = await this.findOneContainPassword({ name }, options);
        if (!user) {
            // 用户不存在
            return null;
        }
        // 通过密码盐，加密传参，再与数据库里的比较，判断是否相等
        if (await compareUserPasswrod(passwd, user.password)) {
            return user;
        }
        // 密码错误
        return undefined;
    }
}
