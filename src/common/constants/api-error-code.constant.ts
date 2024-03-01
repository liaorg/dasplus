// 客户端错误 400000+
// 服务端错误 500000+
// api 错误 400000 - 400999
// errorCode：错误码 langKeyword：多语言关键字，对应i18n中的字段

// 400000+ -- 400199
export const ApiError = {
    // 请求超时
    requestTimeout: { errorCode: -1, langKeyword: 'api.error.requestTimeout' },
    // 请求成功
    requestSuccess: { errorCode: 0, langKeyword: 'api.error.requestSuccess' },
    // 未知错误
    unknowError: { errorCode: 400000, langKeyword: 'api.error.unknowError' },
    // 错误的请求参数
    badParams: { errorCode: 400001, langKeyword: 'api.error.badParams' },
    // 文件不存在
    fileNotExisted: { errorCode: 400002, langKeyword: 'api.error.fileNotExisted' },
    // 创建文件失败
    createFileFailed: { errorCode: 400003, langKeyword: 'api.error.createFileFailed' },
    // 下载文件失败
    downloadFileFailed: { errorCode: 400004, langKeyword: 'api.error.downloadFileFailed' },
    // 写入文件失败
    writeFileFailed: { errorCode: 400005, langKeyword: 'api.error.writeFileFailed' },
    // 读取文件失败
    readFileFailed: { errorCode: 400006, langKeyword: 'api.error.readFileFailed' },
    // 复制文件失败
    copyFileFailed: { errorCode: 400007, langKeyword: 'api.error.copyFileFailed' },
    // 暂无数据
    noData: { errorCode: 400008, langKeyword: 'api.error.noData' },
    // 参数解密错误
    encryptError: { errorCode: 400009, langKeyword: 'api.error.encryptError' },
    // 参数签名错误
    signError: { errorCode: 400010, langKeyword: 'api.error.signError' },
    // objectId 错误
    objectIdError: { errorCode: 400011, langKeyword: 'api.error.objectIdError' },
    // 密码为弱密码 检测到当前密码容易被攻击，请重新设置
    weakPassword: { errorCode: 400012, langKeyword: 'api.error.weakPassword' },
    // 服务器错误
    serverError: { errorCode: 500001, langKeyword: 'api.error.serverError' },
};
