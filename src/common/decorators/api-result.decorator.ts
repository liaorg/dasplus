import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { OpenApiResponseDto } from '../dto';

const baseTypeNames = ['String', 'Number', 'Boolean'];

function genBaseProp(type: Type<any>) {
    if (baseTypeNames.includes(type.name)) return { type: type.name.toLocaleLowerCase() };
    else return { $ref: getSchemaPath(type) };
}

/**
 * @description: 生成返回结果装饰器
 */
export function ApiResult<TModel extends Type<any>>({
    type,
    isPage,
    status = HttpStatus.OK,
}: {
    type?: TModel | TModel[];
    isPage?: boolean;
    status?: HttpStatus;
}) {
    let prop = null;

    if (Array.isArray(type)) {
        if (isPage) {
            prop = {
                type: 'object',
                properties: {
                    items: {
                        type: 'array',
                        list: { $ref: getSchemaPath(type[0]) },
                    },
                    meta: {
                        type: 'object',
                        properties: {
                            total: { type: 'number', default: 0 },
                            pageSize: { type: 'number', default: 0 },
                            current: { type: 'number', default: 0 },
                        },
                    },
                },
            };
        } else {
            prop = {
                type: 'array',
                items: genBaseProp(type[0]),
            };
        }
    } else if (type) {
        prop = genBaseProp(type);
    } else {
        prop = { type: 'null', default: null };
    }

    const model = Array.isArray(type) ? type[0] : type;

    return applyDecorators(
        ApiExtraModels(model),
        ApiResponse({
            status,
            schema: {
                allOf: [
                    { $ref: getSchemaPath(OpenApiResponseDto) },
                    {
                        properties: {
                            data: prop,
                        },
                    },
                ],
            },
        }),
    );
}
