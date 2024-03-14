import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AdminHostModule } from './admin-host/admin-host.module';
import { LockerModule } from './locker/locker.module';
import { MenuModule } from './menu/menu.module';
import { NetworkModule } from './network/network.module';
import { OperateLogModule } from './operate-log/operate-log.module';
import { RoleModule } from './role/role.module';
import { SecurityConfigureModule } from './security-configure/security-configure.module';
import { TenantModule } from './tenant/tenant.module';
import { TimeConfigureModule } from './time-configure/time-configure.module';
import { UserModule } from './user/user.module';

const modules = [
    AdminHostModule,
    LockerModule,
    MenuModule,
    NetworkModule,
    OperateLogModule,
    RoleModule,
    SecurityConfigureModule,
    TenantModule,
    TimeConfigureModule,
    UserModule,
];

@Module({
    imports: [
        ...modules,
        RouterModule.register([
            {
                path: 'admin',
                module: AdminModule,
                children: [...modules],
            },
        ]),
    ],
    exports: [...modules],
})
export class AdminModule {}
