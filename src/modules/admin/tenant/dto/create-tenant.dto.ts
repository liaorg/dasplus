// 注入验证 schema 对象
// @RequestValidationSchema(createTenantSchema)
export class CreateTenantDto {
    /**
     * 名称
     * @example xciovpmn
     */
    name: string;
    /**
     * 状态：0-停用|1-启用
     * @example 1
     */
    status?: number;

    /**
     * 描述
     * @example test
     */
    description?: string;

    /**
     * 电子邮件
     * @example test@test.com
     */
    email?: string;
    /**
     * 排序
     * @example 1
     */
    order?: number;
}
