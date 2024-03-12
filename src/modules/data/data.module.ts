import { Module } from '@nestjs/common';

import { RouterModule } from '@nestjs/core';
import { DesensitizationModule } from './desensitization/desensitization.module';

const modules = [DesensitizationModule];

@Module({
    imports: [
        ...modules,
        RouterModule.register([
            {
                path: 'data',
                module: DataModule,
                children: [...modules],
            },
        ]),
    ],
    exports: [...modules],
})
export class DataModule {}
