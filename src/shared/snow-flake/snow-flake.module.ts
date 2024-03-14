import { Global, Module } from '@nestjs/common';
import { snowFlakeProviders } from './snow-flake.providers';

@Global()
@Module({
    providers: [...snowFlakeProviders],
    exports: [...snowFlakeProviders],
})
export class SnowFlakeModule {}
