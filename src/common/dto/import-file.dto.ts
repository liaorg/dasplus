/**
 * 导入文件
 */
export class ImportFileDto {
    /**
     * 状态 0失败 1成功
     */
    status: number;
    /**
     * 花费时间
     */
    spentTime?: number;
    /**
     * 文件后辍，文件名为 `${md5(hash)}.${ext}`
     */
    ext: string;
    /**
     * 文件 hash，文件名为 `${md5(hash)}.${ext}`
     */
    hash: string;
    /**
     * 文件真实类型
     */
    actualType: string;
}
