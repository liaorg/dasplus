// // mongodb生成的默认 _id验证的参数
export const arrayObjectIdSchema = {
    type: 'array',
    uniqueItemsBlur: true,
    items: { mongodbObjectId: true },
    errorMessage: {
        type: 'api.validate.array',
        uniqueItemsBlur: 'api.validate.uniqueItemsBlur',
        items: ['api.validate.objectIdError'],
    },
};

export const objectIdSchema = {
    type: 'string',
    mongodbObjectId: true,
    errorMessage: {
        type: 'api.validate.string',
        mongodbObjectId: 'api.validate.objectIdError',
    },
};
