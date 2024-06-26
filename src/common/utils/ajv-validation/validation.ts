import { ValidationError } from '@nestjs/common';
import { AnyObject } from '@/common/interfaces';
import Ajv, { SchemaObject } from 'ajv';
import ajvErrors from 'ajv-errors';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, $data: true });

// ajv 中间件，可自定义错误信息 errorMessage
ajvErrors(ajv);

// ajv 中间件，增加 string 中的 format
// https://github.com/ajv-validator/ajv-formats
// "date" | "time" | "date-time" | "duration" | "uri" | "uri-reference" | "uri-template" | "url" | "email" | "hostname" | "ipv4" | "ipv6" | "regex" | "uuid" | "json-pointer" | "json-pointer-uri-fragment" | "relative-json-pointer" | "byte" | "int32" | "int64" | "float" | "double" | "password" | "binary"
// email /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
// 加入一些常用的限制规则
// addFormats(ajv, ['date', 'time', 'date-time', 'ipv4', 'ipv6', 'email', 'url']);
addFormats(ajv);

// npm install ajv-errors --save
// npm install ajv-formats --save

// 规则参考
// https://ajv.js.org/json-schema.html

// 在 ./rules 中添加自定义的验证规则

/**
 * 基于 ajv [https://github.com/ajv-validator/ajv] 的验证器
 * http://json-schema.org/
 * https://ajv.js.org/guide/managing-schemas.html#re-using-validation-functions
 *
 * 在 dto 中使用装饰器
 * @RequestSchemaValidation(schema: SchemaObjece)
 * SchemaObjece, 类似如下结构：
 * 参考：
 * ajv-errors repository[https://github.com/ajv-validator/ajv-errors]
 * ajv-formats[https://github.com/ajv-validator/ajv-formats]
 * ajv-keywords[https://github.com/ajv-validator/ajv-keywords]
 * ```
 * 公共的错误用 api.validate.xxx
 * 模块独有的用 模块名.validate.xxx 如，user.validate.xxx
 * const schema = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
            minLength: 3,
            maxLength: 10,
            errorMessage: {
                type: 'api.validate.string',
                minLength: 'api.validate.minLength|{"length": 3}',
                maxLength: 'api.validate.maxLength|{"length": 10}',
            },
        },
        realName: { charDesc: true },
    },
    required: ['username', 'realName'],
    errorMessage: {
        properties: {
            realName: 'api.validate.charDesc',
        },
        required: {
            username: 'api.validate.required',
            realName: 'api.validate.required',
        },
    },
};
 * ```
 */

/**
 * 遍历并转换错误消息
 * 返回错误信息类似以下 errors：
 * [
 *   {
 *     instancePath: '',
 *     params: { errors: [{
 *         keyword: 'required',
 *         params: { missingProperty: 'realName' },
 *     }]},
 *     message: 'must required realName'
 *   },
 *   {
 *     instancePath: '/username',
 *     params: { errors: [{
 *        params: { type: 'number' },
 *     }]},
 *     message: 'must be a number'
 *   }
 * ]
 * 转换成 i18n 的错误形式 return：
 * [{
 *      property: 'realName',
 *      constraints: { required: 'must required realName' }
 *   },
 *   { property: 'username', constraints: { type: 'must a number' } }
 * ]
 * @param errors
 * @returns
 */
function mapErrors(errors: any[]): ValidationError[] {
    return errors?.map((value) => {
        let property = '';
        let constraints: AnyObject = {};
        const error = value.params.errors?.length ? value.params.errors[0] : value;
        if (error.keyword === 'required') {
            // 如果是 required类型，即 schema对象中在required: ["username", "realName"]中的限定
            if (value.params.errors?.length) {
                property = value.params.errors[0]?.params.missingProperty;
            } else {
                property = value.params.missingProperty;
            }
            constraints = { required: value.message };
        } else if (error.keyword === 'type') {
            // 是类型错误
            property = error.instancePath.substring(1);
            constraints[error.params.type] = value.message;
        } else if (error.keyword === 'format') {
            // 是 format 类型错误
            property = error.instancePath.substring(1);
            constraints[error.params.format] = value.message;
        } else {
            // 其他的在 errorMessage: { }中的限定
            property = value.instancePath.substring(1);
            constraints[error.keyword] = value.message;
        }
        return { property, constraints };
    });
}

/**
 * 根据 schema 规则验证数据
 * schema 规则可通过 在 dto 对象中 注入：@RequestSchemaValidation(schema)
 * @param schema
 * @param data
 * @returns
 */
function ajvValidate(schema: SchemaObject, data: any) {
    // 生成验证规则
    if (schema) {
        const validate = ajv.compile(schema);
        // 验证
        if (validate && !validate(data)) {
            // 验证不通过，转换错误
            // 遍历并转换消息
            return mapErrors(validate.errors);
        }
    }
    return [];
}

/**
 * 执行验证
 * @param schema 验证规则
 * @param data 数据
 * @returns
 */
function doValidate(schema: any, data: any) {
    const errors = ajvValidate(schema, data);
    if (errors?.length) {
        // 抛出错误
        return errors;
    }
    return undefined;
}

export { ajv, ajvValidate, doValidate };
