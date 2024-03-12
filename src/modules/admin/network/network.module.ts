import { connectionName } from '@/common/database';
import { MongooseRepositoryModule } from '@/common/repository';
import { Module } from '@nestjs/common';
import { NetworkController } from './network.controller';
import { NetworkService } from './network.service';
import { Network, NetworkSchema } from './schemas';

const providers = [NetworkService];

@Module({
    imports: [
        MongooseRepositoryModule.forFeature(
            [{ name: Network.name, schema: NetworkSchema }],
            connectionName.ENGINE_DBFW,
        ),
    ],
    controllers: [NetworkController],
    providers: [...providers],
    exports: [MongooseRepositoryModule, ...providers],
})
export class NetworkModule {}
