import { ObjectIdType } from '@/common/interfaces';
import { InjectMongooseRepository, MongooseRepository } from '@/common/repository';
import { BaseService } from '@/common/services';
import { AdminRouteService } from '@/modules/core/admin-route/admin-route.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { FilterQuery, QueryOptions } from 'mongoose';
import { RoleService } from '../role/role.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas';

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        @InjectMongooseRepository(User.name) protected readonly repository: MongooseRepository<User>,
        @Inject(forwardRef(() => RoleService)) private readonly roleService: RoleService,
        private readonly adminRouteService: AdminRouteService,
    ) {
        super(repository);
    }
    create(createUserDto: CreateUserDto) {
        return 'This action adds a new user';
    }

    findAll() {
        return `This action returns all user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    // 获取指定用户包含密码
    async findOneContainPassword(
        filter: FilterQuery<UserDocument>,
        options?: QueryOptions<UserDocument>,
    ) {
        const projection = '+password';
        const user = this.repository.findOne({ filter, projection, options });
        return user;
    }

    // 根据角色id，获取路由权限
    async matchRoutePermission(roleId: ObjectIdType, path: string, method: string) {
        // 先获取角色权限
        const role = await this.roleService.findById(roleId);
        // 再获取角色路由权限
        const param: any = {
            filter: {
                permission: { $in: role?.permissions },
                path,
                method,
            },
        };
        const adminRoute = await this.adminRouteService.findOne(param);
        return adminRoute;
    }
}
