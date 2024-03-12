import { Provider } from '@nestjs/common';
import { ModelDefinition, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from './mongoose.repository';

export function createMongooseRepositoryProviders(
    options: ModelDefinition[],
    connectionName?: string,
): Provider[] {
    return (options || []).map((model) => ({
        provide: `${model.name}Repository`,
        useFactory: (model: Model<Document>) => {
            return new MongooseRepository(model);
        },
        inject: [getModelToken(model.name, connectionName)],
    }));
}
