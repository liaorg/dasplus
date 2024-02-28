import { ModuleMetadata } from '@nestjs/common';
import { MongooseModule, MongooseModuleAsyncOptions, MongooseModuleOptions } from '@nestjs/mongoose';

/**
 * 核心模块用于挂载一些全局类服务, 比如整合 MongooseModule
 */
export class CoreModule {
    public static forRoot(uri: string, options?: MongooseModuleOptions) {
        const imports: ModuleMetadata['imports'] = [MongooseModule.forRoot(uri, options)];
        return {
            global: true,
            imports,
            module: CoreModule,
        };
    }

    public static forRootAsync(options?: MongooseModuleAsyncOptions) {
        const imports: ModuleMetadata['imports'] = [MongooseModule.forRootAsync(options)];
        return {
            global: true,
            imports,
            module: CoreModule,
        };
    }
}
