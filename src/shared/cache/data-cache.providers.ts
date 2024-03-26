import { caching } from 'cache-manager';

/**
 * 数据缓存
 */
export const DATA_CACHE_MANAGER = 'DATA_CACHE_MANAGER';
export const dataCacheProviders = [
    {
        provide: DATA_CACHE_MANAGER,
        useFactory: async () => {
            return caching('memory', {
                max: 500,
                ttl: 10 * 1000,
            });
        },
    },
];
