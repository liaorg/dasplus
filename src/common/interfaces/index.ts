export * from './api-error.interface';
export * from './engine.interface';
export * from './user-business.interface';
export * from './data-log.interface';

export interface AnyObject {
    [key: string]: any;
}

/**
 * 模块错误信息对象
 */
export interface ModuleErrorInterface {
    /**
     * 错误码
     */
    errorCode: number;
    /**
     * 多语言关键字，对应i18n中的字段
     */
    langKeyword: string;
}
