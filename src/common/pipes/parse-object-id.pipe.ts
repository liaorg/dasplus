import { PipeTransform, Injectable } from '@nestjs/common';
import { ApiError } from '../constants';
import { isObjectIdOrHexString } from 'mongoose';
import { MongooseException } from '../exceptions/mongoose.exception';

// 验证请求参数管道
// 使用 @Injectable() 装饰器注解的类
// 管道应该实现 PipeTransform 接口
// 每个管道必须实现一个 transform(value: any, metadata: ArgumentMetadata) 函数
// value 是当前处理的参数，而 metadata 是其元数据，包含一些属性：
// export interface ArgumentMetadata {
//   type: 'body' | 'query' | 'param' | 'custom';
//   metatype?: Type<unknown>;
//   data?: string;
// }

/**
 * 自定义管道，验证 mongodb 中的 objectId
 * 使用：
 * 在 dto 中使用装饰器
 * @RequestValidationSchema(schema)
 *
 * 在类或方法使用装饰器
 * @UsePipes(ParseObjectIdPipe)
 * 在全局使用
 * // 全局
 *        {
 *            provide: APP_PIPE,
 *            useClass: ParseObjectIdPipe,
 *        }
 */

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
    transform(value: any) {
        // 判断是否 ObjectId
        if (!isObjectIdOrHexString(value)) {
            // 抛出错误
            const error = {
                ...ApiError.objectIdError,
            };
            throw new MongooseException(error, { value });
        }
        return value;
    }
}
