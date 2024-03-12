import { MongoDbService, ObjectIdType } from '@/common/services';
import { Role, RoleDocument } from '@/modules/admin/role/schemas';
import { RoleGroupTypeEnum } from '@/modules/core/role-group/enums';
import { RoleGroup } from '@/modules/core/role-group/schemas';
import { Logger } from '@nestjs/common';
import { ClientSession, ConnectOptions, Connection, createConnection } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { defaultRoleOid } from '../auth/consts';

export class InitDBService {
    private loggre: Logger;
    private connection: Connection;
    constructor(uri: string, config: ConnectOptions) {
        this.connection = createConnection(uri, config);
        this.loggre = new Logger('mongodb', { timestamp: true });
    }
    // 删除数据库及其所有数据
    dropDatabase() {
        // 删除给定的数据库，包括所有集合、文档和索引
        return this.connection.dropDatabase();
    }
    // 关闭连接
    close() {
        return this.connection.close();
    }

    // 获取连接
    getConnection() {
        return this.connection;
    }
    // 切换数据库
    useDb(name: string) {
        this.connection = this.connection.useDb(name);
    }

    // 添加默认数据
    async addDefaultData<TM = any, TD = any>(
        opt: { name: string; collection: string; schema?: any; defaultData?: TM[] },
        i18n: I18nService,
    ) {
        const { name, schema, defaultData, collection } = opt;
        this.loggre.log(i18n.t('init.begainInitTable', { args: { tablename: collection } }));
        const model = this.connection.model(name, schema);
        const service = new MongoDbService<TM, TD>(model);
        const data = await service.insertMany({ doc: defaultData });
        this.loggre.log(i18n.t('init.finishedInitTable', { args: { tablename: collection } }));
        return data;
    }
    // 根据组 名称 更新角色和角色组权限
    // 默认角色名与默认角色组名相同
    updateRolePermission(
        roleGroupTypeData: RoleGroupTypeEnum[],
        roleGroup: MongoDbService<RoleGroup>,
        role: MongoDbService<Role, RoleDocument>,
        permissionId: ObjectIdType,
        session?: ClientSession,
    ) {
        // 添加角色组权限
        const updateRoleGroup = roleGroupTypeData.map(async (type) => {
            return roleGroup.updateOne({
                filter: { type },
                doc: { $addToSet: { permissions: permissionId } },
                options: { session },
            });
        });
        // 添加角色权限
        const addRoleData = [];
        roleGroupTypeData.forEach((item) => {
            if (item === RoleGroupTypeEnum.systemAdmin) {
                addRoleData.push(defaultRoleOid.systemAdmin);
            }
            if (item === RoleGroupTypeEnum.auditAdmin) {
                addRoleData.push(defaultRoleOid.auditAdmin);
            }
            if (item === RoleGroupTypeEnum.securityAdmin) {
                addRoleData.push(defaultRoleOid.securityAdmin);
            }
        });
        const updateRole = addRoleData.map(async (id) => {
            return role.updateOne({
                filter: { _id: id },
                doc: { $addToSet: { permissions: permissionId } },
                options: { session },
            });
        });
        return [...updateRoleGroup, ...updateRole];
    }
}
