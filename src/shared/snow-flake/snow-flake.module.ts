import { Module } from '@nestjs/common';
import { snowFlakeProviders } from './snow-flake.providers';

@Module({})
export class SnowFlakeModule {
    static forRoot() {
        return {
            global: true,
            module: SnowFlakeModule,
            providers: [...snowFlakeProviders],
            exports: [...snowFlakeProviders],
        };
    }
}
