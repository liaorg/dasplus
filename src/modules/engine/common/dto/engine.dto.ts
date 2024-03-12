// 引擎返回数据结构

import { RequestValidationSchema } from '@/common/decorators';
import { AnyObject } from '@/common/interfaces';
import { SortOrder } from 'mongoose';

// 参数验证
export const objectIdSchema = {
    type: 'array',
    uniqueItemsBlur: true,
    minItems: 1,
    items: { mongodbObjectId: true },
    errorMessage: {
        type: 'api.validate.array',
        uniqueItemsBlur: 'api.validate.uniqueItemsBlur',
        minItems: 'api.validate.minItems|{"value":1}',
        items: ['api.validate.objectIdError'],
    },
};

// mongodb生成的默认 _id
export class EngineOidDto {
    /**
     * oid 值， mongodb生成的默认 _id
     */
    $oid: string;
}

// 排序
enum SortEnum {
    // 升序
    asc = 1,
    // 降序
    desc = -1,
}

class SortDto {
    [key: string]: SortEnum;
}

// 分页参数
export class EnginePageDto {
    /**
     * 读取文档条数
     */
    limit?: number;
    /**
     * 跳过指定数量文档
     */
    skip?: number;
    /**
     * 排序，根据字段排序，1升序，-1降序
     */
    sort?: SortDto;
    /**
     * 指定返回字段/分组字段
     */
    fields?: string[];
}

/**
 * 查询分页，排序，返回字段等条件
 * 分页条件，排序条件和指定返回字段
 */
export class EngineOptionsDto {
    /**
     * 读取文档条数
     */
    limit?: number;
    /**
     * 跳过指定数量文档
     */
    skip?: number;
    /**
     * 排序，根据字段排序，1升序，-1降序
     */
    sort?: SortDto;
    /**
     * 指定返回字段
     */
    fields?: string[];
}

/**
 * 返回数据
 */
export class EngineRepDataDto {
    /**
     * 是否查询成功，true 成功，false 失败
     */
    ok: boolean;
    /**
     * 用于判断发响应配置发送是否成功，true 成功，false 失败
     * 失败前端显示errmsg消息
     */
    sucess?: boolean;
    /**
     * 信息
     */
    doc?: object;
    /**
     * 查询列表的总数
     */
    count?: number;
    /**
     * 列表的内容
     */
    doclist?: any[];
    /**
     * 错误消息
     */
    errmsg?: string;
    /**
     * insert成功会返回文档oid
     */
    docid?: string;
}

// 参数验证
const objectIdAndNameSchema = {
    type: 'object',
    required: ['oidlist', 'nameList'],
    properties: {
        // objectid
        oidlist: {
            ...objectIdSchema,
        },
        // 名称
        nameList: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: { type: 'string' },
            errorMessage: {
                type: 'api.validate.array',
                uniqueItems: 'api.validate.uniqueItems',
                minItems: 'api.validate.minItems|{"value":1}',
                items: ['api.validate.string'],
            },
        },
    },
    errorMessage: {
        required: {
            oidlist: 'api.validate.required',
            nameList: 'api.validate.required',
        },
        properties: {
            oidlist: 'api.validate.objectIdError',
        },
    },
};

/**
 * 删除/批量删除
 */
@RequestValidationSchema(objectIdAndNameSchema)
export class DeleteOidDto {
    /**
     * 文档oid列表
     */
    oidlist?: string[];
    /**
     * 名称列表
     */
    nameList?: string[];
}

/**
 * 文档oid列表
 */
export class OidListDto {
    /**
     * 文档oid列表
     */
    oidlist?: string[];
}

// 参数验证
const objectIdListSchema = {
    type: 'object',
    required: ['oidlist'],
    properties: {
        // objectid
        oidlist: {
            ...objectIdSchema,
            minItems: 0,
        },
    },
    errorMessage: {
        required: {
            oidlist: 'api.validate.required',
        },
        properties: {
            oidlist: 'api.validate.objectIdError',
        },
    },
};

type SortType<T> = {
    [key in keyof T]: SortOrder;
};
/**
 * 导出选中的 id 列表
 */
@RequestValidationSchema(objectIdListSchema)
export class ExportOidListDto<T = AnyObject> {
    /**
     * 文档oid列表，
     */
    oidlist?: string[];
    /**
     * 加密密码
     */
    password?: string;
    /**
     * 排序字段 {id: -1}，-1 降序，1 升序
     * @example {id: -1}
     */
    sort?: SortType<T>;
}

// 参数验证
const objectIdListStatusSchema = {
    type: 'object',
    required: ['oidlist', 'nameList', 'enable'],
    properties: {
        // objectid
        oidlist: {
            ...objectIdSchema,
        },
        // 名称
        nameList: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: { type: 'string' },
            errorMessage: {
                type: 'api.validate.array',
                uniqueItems: 'api.validate.uniqueItems',
                minItems: 'api.validate.minItems|{"value":1}',
                items: ['api.validate.string'],
            },
        },
        // 状态
        enable: {
            type: 'boolean',
            errorMessage: {
                type: 'api.validate.boolean',
            },
        },
    },
    errorMessage: {
        required: {
            oidlist: 'api.validate.required',
            nameList: 'api.validate.required',
            enable: 'api.validate.required',
        },
        properties: {
            oidlist: 'api.validate.objectIdError',
        },
    },
};
/**
 * 启用/停用
 */
@RequestValidationSchema(objectIdListStatusSchema)
export class UpdateStatusDto {
    /**
     * 名称列表
     */
    nameList: string[];
    /**
     * 文档oid列表
     */
    oidlist: string[];
    /**
     * 状态
     */
    enable: boolean;
}
