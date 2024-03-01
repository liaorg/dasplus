/**
 * 成功/失败
 */
export class OpenApiResponseDto {
    /**
     * HTTP 状态码 200 为成功，其他值为失败
     */
    statusCode: number;
    /**
     * 业务错误码 默认为 0, statusCode 不为 200 时显示对应的错误码
     */
    errorCode: number;
    /**
     * 请求方式
     */
    method: string;
    /**
     * 请求URL路径
     */
    path: string;
    /**
     * 请求时间
     */
    date: string;
    /**
     * 请求成功/错误消息
     */
    message?: string;
    /**
     * 上传文件错误消息
     */
    uploadMessage?: string;
    /**
     * 具体错误消息
     */
    detailMessage?: any;
    /**
     * 请求返回数据
     */
    data?: any;
}
