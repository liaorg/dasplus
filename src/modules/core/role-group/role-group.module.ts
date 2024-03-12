import { MongooseRepositoryModule } from '@/common/repository';
import { Module } from '@nestjs/common';
import { RoleGroupService } from './role-group.service';
import { RoleGroup, RoleGroupSchema } from './schemas';

@Module({
    imports: [MongooseRepositoryModule.forFeature([{ name: RoleGroup.name, schema: RoleGroupSchema }])],
    providers: [RoleGroupService],
    exports: [MongooseRepositoryModule, RoleGroupService],
})
export class RoleGroupModule {}
