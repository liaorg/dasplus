import { ajvValidate, isClassInstance, isObject, simpleCloneDeep } from '@/common/utils';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { SchemaObject } from 'ajv';
import { I18nValidationException } from 'nestjs-i18n';
import { REQUEST_SCHEMA_VALIDATION } from '../constants';

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
 * 自定义管道，根据传递的 schema 结构验证请求参数
 * 使用：
 * 在 dto 中使用装饰器
 * @RequestValidationSchema(schema)
 *
 * 在类或方法使用装饰器
 * @UsePipes(RequestValidationSchemaPipe)
 * 在全局使用
 * // 全局 request 参数验证
 *        {
 *            provide: APP_PIPE,
 *            useClass: RequestValidationSchemaPipe,
 *        }
 */

@Injectable()
export class RequestValidationSchemaPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const { metatype, type } = metadata;
        // 参数类型是自定义类型时直接返回
        if (type === 'custom') {
            return value;
        }
        // let newValue: any;
        // // 从 request 中提取只在 dto 中定义的参数
        // // value 为 object 类型且 dto 有定义时才转换
        // // 字符串自动去除前后空格
        // if (this.mustClean(value)) {
        //     // newValue = this.cleanRequest(value, new dto());
        //     newValue = value;
        // } else if (isString(value)) {
        //     newValue = value.trim();
        // } else {
        //     newValue = value;
        // }
        // 内容安全验证 todo
        // 获取要验证的 dto 类
        const dto = metatype as any;
        // 获取 dto 类的装饰器元数据中的自定义验证选项
        const schema: SchemaObject = Reflect.getMetadata(REQUEST_SCHEMA_VALIDATION, dto) || {};
        // 验证请求参数
        const errors = ajvValidate(schema, value);
        if (errors.length) {
            // 抛出错误
            throw new I18nValidationException(errors);
        }
        return value;
    }
    // 从 request 中提取只在 dto 中定义的参数
    cleanRequest(value: any, dto: any) {
        if (typeof value?.hasOwnProperty === 'function') {
            const newValue = {};
            for (const key in dto) {
                if (value.hasOwnProperty(key)) {
                    newValue[key] = simpleCloneDeep(value[key], { isTrim: true });
                }
            }
            return newValue;
        }
        return value;
    }
    mustClean(value: any) {
        // 是否为 object
        return isObject(value) && !isClassInstance(value);
        // const isObject = Object.prototype.toString.call(value) === "[object Object]";
        // // 是否为 class 的实例
        // const isClassInstance = value.constructor.toString().slice(0, 5) === "class";
        // // 是否为 i18n
        // // const isI18nContext = value instanceof I18nContext;
        // // 只是纯对象 object 才转，其他的不转
        // return isObject && !isClassInstance;
    }
}
