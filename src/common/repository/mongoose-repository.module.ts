import { DynamicModule, Module } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { createMongooseRepositoryProviders } from './mongoose.providers';

@Module({})
export class MongooseRepositoryModule {
    static forFeature(models: ModelDefinition[] = [], connectionName?: string): DynamicModule {
        const repositoryProviders = createMongooseRepositoryProviders(models, connectionName);
        return {
            module: MongooseRepositoryModule,
            imports: [MongooseModule.forFeature(models, connectionName)],
            providers: [...repositoryProviders],
            exports: [...repositoryProviders],
        };
    }
}
