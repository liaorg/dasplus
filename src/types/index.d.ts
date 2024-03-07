import '@/common/adapters';
import { RequestUserDto } from '../modules/core/auth/dto/request-user.dto';

/**
 * 扩展 Request 中 user 字段: 登录用户
 */
declare module '@/common/adapters' {
    interface AdapterRequest {
        user?: RequestUserDto;
    }
}

/**
 * 防止SWC下循环依赖报错
 */
declare type WrapperType<T> = T; // WrapperType === Relation
