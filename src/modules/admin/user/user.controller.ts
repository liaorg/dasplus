import { AdapterRequest } from '@/common/adapters';
import { AuthError, UserError } from '@/common/constants';
import { ApiResult, ApiSecurityAuth } from '@/common/decorators';
import { RequestUserDto } from '@/common/dto';
import { OperateLogEnum } from '@/common/enum';
import { LogParam } from '@/common/interfaces';
import { ParseObjectIdPipe } from '@/common/pipes';
import { ObjectIdType } from '@/common/services';
import {
    compareObjectId,
    generateLog,
    hasChange,
    hasChangeWith,
    isEmpty,
    success,
    toObjectId,
} from '@/common/utils';
import { RequestUserDecorator } from '@/modules/core/auth/decorators';
import { AdminUserRoleGuard, WeakPasswordGuard } from '@/modules/core/auth/guards';
import { TokenService } from '@/modules/core/auth/services';
import { RoleGroupTypeEnum } from '@/modules/core/role-group/enums';
import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Role } from '../role/schemas';
import {
    CreateUserDto,
    DeleteUserDto,
    QueryUserDto,
    ResetPasswordDto,
    UpdatePasswordDto,
    UpdateProfileDto,
    UpdateUserDto,
    UserDto,
    UserListDto,
    UserProfileDto,
} from './dto';
import { UserException } from './user.exception';
import { UserService } from './user.service';

// 抛出 400类(客户端错误)异常 500类(服务器错误)异常
// 出现多级路由时，多级的要排前面定义 user/role-list > user/:id

// -- swagger 设置 --begain
// 设置标题
@ApiTags('系统管理-用户管理')
// token 参数设置
@ApiSecurityAuth()
// -- swagger 设置 --end
@UseGuards(AdminUserRoleGuard)
@Controller('user')
export class UserController {
    private logMoudle = 'user.module';
    private logType = OperateLogEnum.systemAdmin;
    constructor(
        private readonly service: UserService,
        private readonly tokenService: TokenService,
    ) {}

    /**
     * 注销登录
     * @param req
     * @returns
     */
    @ApiOperation({ summary: '退出登录' })
    @Get('logout')
    async logout(@Req() req: AdapterRequest) {
        // 日志
        const username = (req?.user as any)?.name;
        const log = {
            module: this.logMoudle,
            type: OperateLogEnum.logout,
            content: 'user.logout',
            username,
            loginIp: req?.ip,
            lanArgs: { name: username },
        };
        const data = await this.service.logout(req);
        // 创建带操作日志信息的返回数据
        return success<void>(data, log);
    }

    /**
     * 刷新登录 token
     * @param request
     * @returns
     */
    @ApiOperation({ summary: '刷新登录 token' })
    @Get('refresh-token')
    async refreshToken(@RequestUserDecorator() user: RequestUserDto, @Req() req: AdapterRequest) {
        const updated = await this.service.refreshToken(user, req);
        return updated;
    }

    @ApiOperation({ summary: '修改密码' })
    @ApiResult({ type: Boolean })
    @Patch('password/:userId')
    @UseGuards(WeakPasswordGuard)
    async updatePassword(
        @Param('userId', ParseObjectIdPipe) userId: ObjectIdType,
        @Body() post: UpdatePasswordDto,
        @RequestUserDecorator() loginUser: RequestUserDto,
    ) {
        // 只能修改登录用户自己的密码
        // 获取登录用户信息
        const oldUser = await this.service.findOneContainPassword({ _id: loginUser._id });
        if (isEmpty(oldUser)) {
            const error = {
                ...UserError.notExisted,
                args: { id: userId },
            };
            throw new UserException(error);
        }
        // 检查旧密码是否正确
        await this.service.matchPassword(post.oldPassword, oldUser.password);
        const updated = await this.service.updateById(userId, post, oldUser);
        if (!updated.acknowledged) {
            const error = {
                ...UserError.updatePasswordFailed,
            };
            throw new UserException(error);
        }
        // 日志
        const log = {
            module: this.logMoudle,
            type: this.logType,
            content: 'user.passwordModify',
            lanArgs: { name: oldUser.name },
        };
        // 强制退出已经登录的用户
        // 把已经登录用户的 access_token 清除
        const userIds = [userId];
        await this.tokenService.clearAccessToken(userIds);
        // 创建带操作日志信息的返回数据
        return success<boolean>(true, log);
    }

    @ApiOperation({ summary: '重置密码' })
    @ApiResult({ type: Boolean })
    @Patch('passwords')
    @UseGuards(WeakPasswordGuard)
    async resetPassword(
        @Body() post: ResetPasswordDto,
        @RequestUserDecorator() loginUser: RequestUserDto,
    ) {
        // 只有默认系统管理员才可以重置密码
        if (loginUser.roleGroupType === RoleGroupTypeEnum.systemAdmin && loginUser.isDefault) {
            const { ids, password } = post;
            const updateUser = { password };
            const updated = await this.service.resetPasswordByIds(ids, updateUser);
            if (updated === false) {
                const error = {
                    ...UserError.resetPasswordFailed,
                };
                throw new UserException(error);
            }
            // 日志
            const log = {
                module: this.logMoudle,
                type: this.logType,
                content: 'user.passwordReset',
                lanArgs: { name: updated.join(',') },
            };
            // 强制退出已经登录的用户
            // 把已经登录用户的 access_token 清除
            await this.tokenService.clearAccessToken(ids);
            // 创建带操作日志信息的返回数据
            return success<boolean>(true, log);
        } else {
            const error = {
                statusCode: 403,
                ...AuthError.forbiddenUserRoleRoute,
            };
            throw new UserException(error);
        }
    }

    @ApiOperation({ summary: '获取登录用户信息-头部' })
    @ApiResult({ type: UserProfileDto })
    @Get('profile')
    async findProfile(@RequestUserDecorator() loginUser: RequestUserDto) {
        const id = loginUser._id;
        return await this.service.findUserInfo(id);
    }

    @ApiOperation({ summary: '修改登录用户信息-头部' })
    @ApiResult({ type: Boolean })
    @Patch('profile')
    @UseGuards(WeakPasswordGuard)
    async updateProfile(
        @Body() post: UpdateProfileDto,
        @RequestUserDecorator() loginUser: RequestUserDto,
        @I18n() i18n: I18nContext,
    ) {
        const id = loginUser._id;
        // 检查用户是否存在
        const oldUser = await this.service.findOneContainPassword({ _id: id });
        if (isEmpty(oldUser)) {
            const error = {
                ...UserError.notExisted,
                args: { id },
            };
            throw new UserException(error);
        }
        const withKey = [
            'name',
            'description',
            'email',
            'fullName',
            'gender',
            'address',
            'department',
            'duty',
            'idNumber',
            'phoneNumber',
            'qq',
        ];
        if (post.password) {
            if (post.password !== post.repassword) {
                // 需要确认密码
                // 确认密码应该与密码相同
                const error = {
                    ...UserError.repasswordError,
                };
                throw new UserException(error);
            }
            if (!post.oldPassword) {
                // 旧密码必填
                const error = {
                    ...UserError.oldPasswordReruired,
                };
                throw new UserException(error);
            }
            if (post.password === post.oldPassword) {
                // 新密码不能和旧密码相同
                const error = {
                    ...UserError.notEqualOldPassword,
                };
                throw new UserException(error);
            }
            // 检查旧密码是否正确
            await this.service.matchPassword(post.oldPassword, oldUser.password);
            withKey.push('password');
        }
        // 头部个人信息修改不能修改业务权限，所属角色
        Reflect.deleteProperty(post, 'business');
        Reflect.deleteProperty(post, 'roleId');
        // 对比修改的内容
        const { change, target } = hasChangeWith(withKey, oldUser, post);
        let log: any = {};
        let updated: any = true;
        if (change.length) {
            updated = await this.service.updateById(id, target, oldUser);
            if (!updated.acknowledged) {
                const error = {
                    ...UserError.updateFailed,
                };
                throw new UserException(error);
            }
            // 生成日志内容
            const logParam: LogParam = {
                change,
                name: oldUser.name,
                module: 'user',
                logType: this.logType,
                i18n,
            };
            if (change.includes('name') && post.name) {
                logParam.other = i18n.t('user.log.changeName', { args: { name: post.name } });
            }
            log = generateLog(logParam);
        }
        if (post.password || (change.includes('name') && post.name)) {
            // 修改密码时
            // 强制退出已经登录的用户
            // 把已经登录用户的 access_token 清除
            const userIds = [id];
            await this.tokenService.clearAccessToken(userIds);
        }
        // 创建带操作日志信息的返回数据
        return success(updated, log);
    }

    @ApiOperation({ summary: '获取角色名称下拉列表' })
    @ApiResult({ type: [Role] })
    @Get('role-list')
    async findRoleList() {
        // async findRoleList(): Promise<RoleNameListDto[]> {
        return await this.service.findRoleList();
    }

    @ApiOperation({ summary: '用户分页-查询' })
    @ApiResult({ type: UserListDto, isPage: true })
    @Post('query')
    async findAll(@Body() query: QueryUserDto) {
        const { current, pageSize, name, roleId, status, sort = { order: 1, _id: -1 } } = query;
        const filter: any = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (roleId) {
            filter.role = toObjectId(roleId);
        }
        if (status === 0 || status === 1) {
            filter.status = status;
        }
        // 关联查询角色
        const populate = 'role';
        const [list, total] = await this.service.findPagination({
            filter,
            sort,
            current,
            pageSize,
            populate,
        });
        return { list, current, pageSize, total };
    }

    @ApiOperation({ summary: '删除/批量删除用户' })
    @ApiResult({ type: Boolean })
    @Post('deletion')
    async removeByIds(
        @Body() deleteUser: DeleteUserDto,
        @RequestUserDecorator() loginUser: RequestUserDto,
    ) {
        const userIds = deleteUser.ids;
        const loginUserId = loginUser._id;
        // 不能删除当前登录用户，即自己不能删除自己
        this.matchLoginId(userIds, loginUserId);
        // 不能删除默认管理员用户
        await this.matchDefaultUserId(userIds);
        // 事务操作
        const deleted = await this.service.transaction(async (session) => {
            // 把用户的 access_token 清除
            await this.tokenService.clearAccessToken(userIds, session);
            // 删除用户
            return await this.service.removeByIds(userIds, session);
        });
        if (!deleted) {
            const error = {
                ...UserError.deleteFailed,
            };
            throw new UserException(error);
        }
        // 日志
        const log = {
            module: this.logMoudle,
            type: this.logType,
            content: 'user.del',
            lanArgs: { name: deleted.join(',') },
        };
        // 创建带操作日志信息的返回数据
        return success<boolean>(true, log);
    }

    @ApiOperation({ summary: '添加用户' })
    @ApiResult({ type: UserDto })
    @Post()
    @UseGuards(WeakPasswordGuard)
    async create(@Body() post: CreateUserDto) {
        const added = await this.service.create(post);
        if (!added) {
            const error = {
                ...UserError.addFailed,
            };
            throw new UserException(error);
        }
        // 日志
        const log = {
            module: this.logMoudle,
            type: this.logType,
            content: 'user.add',
            lanArgs: { name: post.name },
        };
        // 创建带操作日志信息的返回数据
        return success(added, log);
    }

    @ApiOperation({ summary: '获取指定用户信息(包含角色)-用户管理' })
    @ApiResult({ type: UserDto })
    @Get(':userId')
    async findUserInfo(@Param('userId', ParseObjectIdPipe) userId: ObjectIdType) {
        const user = await this.service.findUserInfo(userId);
        if (isEmpty(user)) {
            const error = {
                ...UserError.notExisted,
                args: { id: userId },
            };
            throw new UserException(error);
        }
        return user;
    }

    @ApiOperation({ summary: '修改用户' })
    @ApiResult({ type: Boolean })
    @Patch(':userId')
    @UseGuards(WeakPasswordGuard)
    async update(
        @Param('userId', ParseObjectIdPipe) userId: ObjectIdType,
        @Body() post: UpdateUserDto,
        @RequestUserDecorator() loginUser: RequestUserDto,
        @I18n() i18n: I18nContext,
    ) {
        // 检查用户是否存在
        const oldUser = await this.service.findOneContainPassword({ _id: userId });
        if (isEmpty(oldUser)) {
            const error = {
                ...UserError.notExisted,
                args: { id: userId },
            };
            throw new UserException(error);
        }
        // 提取修改内容
        const withKey = [
            'name',
            'description',
            'email',
            'fullName',
            'gender',
            'address',
            'department',
            'duty',
            'idNumber',
            'phoneNumber',
            'qq',
            'status',
        ];
        const { change, target } = hasChangeWith(withKey, oldUser, post);
        const changeBusiness = hasChange(oldUser?.business.id, post?.business.id);
        if (changeBusiness) {
            change.push('business');
            target.business = post?.business;
        }
        if (post?.roleId && !compareObjectId(post.roleId, oldUser.role)) {
            change.push('role');
            target.roleId = post.roleId;
        }
        // 只能修改自己和非默认用户的密码
        if (
            post.password &&
            (oldUser._id.toString() === loginUser._id.toString() || !oldUser.isDefault)
        ) {
            // 密码安全规则检查
            if (post.password !== post.repassword) {
                // 需要确认密码
                // 确认密码应该与密码相同
                const error = {
                    ...UserError.repasswordError,
                };
                throw new UserException(error);
            }
            // 是默认系统管理员的时，要检查旧密码
            if (oldUser.isDefault) {
                if (!post.oldPassword) {
                    // 旧密码
                    const error = {
                        ...UserError.oldPasswordReruired,
                    };
                    throw new UserException(error);
                }
                if (post.password === post.oldPassword) {
                    // 新密码不能和旧密码相同
                    const error = {
                        ...UserError.notEqualOldPassword,
                    };
                    throw new UserException(error);
                }
                // 检查旧密码是否正确
                await this.service.matchPassword(post.oldPassword, oldUser.password);
            }
            withKey.push('password');
        } else {
            Reflect.deleteProperty(post, 'password');
        }
        let log: any = {};
        let updated: any = true;
        if (change.length) {
            updated = await this.service.updateById(userId, target, oldUser);
            if (!updated.acknowledged) {
                const error = {
                    ...UserError.updateFailed,
                };
                throw new UserException(error);
            }
            // 生成日志内容
            const logParam: LogParam = {
                change,
                name: oldUser.name,
                module: 'user',
                logType: this.logType,
                i18n,
            };
            if (change.includes('name') && post.name) {
                logParam.other = i18n.t('user.log.changeName', { args: { name: post.name } });
            }
            log = generateLog(logParam);
        }
        if (
            post.password ||
            (post.roleId && !compareObjectId(post.roleId, oldUser.role)) ||
            (!post.status && post.status !== oldUser.status) ||
            (post.business && JSON.stringify(post.business) !== JSON.stringify(oldUser.business))
        ) {
            // 修改角色名称、密码或将用户状态修改为停用时
            // 修改用户业务系统权限时
            // 强制退出已经登录的用户
            // 把已经登录用户的 access_token 清除
            const userIds = [userId];
            await this.tokenService.clearAccessToken(userIds);
        }
        // 创建带操作日志信息的返回数据
        return success<boolean>(true, log);
    }

    // 不能删除当前登录用户，即自己不能删除自己
    matchLoginId(ids: ObjectIdType[], loginUserId: ObjectIdType) {
        if (ids.includes(loginUserId)) {
            const error = {
                ...UserError.unContainLoginUser,
            };
            throw new UserException(error);
        }
        return false;
    }

    // 不能删除默认管理员用户
    async matchDefaultUserId(ids: ObjectIdType[]) {
        // 查询默认管理员
        const defaultUser = await this.service.findOne({ filter: { isDefault: true } });
        if (defaultUser) {
            if (ids.includes(defaultUser._id.toString())) {
                const error = {
                    ...UserError.unContainDefault,
                };
                throw new UserException(error);
            }
        }
    }
}
