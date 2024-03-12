import { Inject } from '@nestjs/common';

export const InjectMongooseRepository = (model: string) => Inject(`${model}Repository`);
