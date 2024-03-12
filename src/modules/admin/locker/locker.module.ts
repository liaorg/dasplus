import { MongooseRepositoryModule } from '@/common/repository';
import { Module } from '@nestjs/common';
import { LockerController } from './locker.controller';
import { LockerService } from './locker.service';
import { Locker, LockerSchema } from './schemas';

const providers = [LockerService];

@Module({
    imports: [MongooseRepositoryModule.forFeature([{ name: Locker.name, schema: LockerSchema }])],
    controllers: [LockerController],
    providers: [...providers],
    exports: [MongooseRepositoryModule, ...providers],
})
export class LockerModule {}
