import { Module } from '@nestjs/common';
import { RoleGroupService } from './role-group.service';

@Module({
    providers: [RoleGroupService],
    exports: [RoleGroupService],
})
export class RoleGroupModule {}
