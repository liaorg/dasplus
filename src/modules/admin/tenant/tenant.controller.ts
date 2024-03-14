import { TenantError } from '@/common/constants';
import { ApiResult, ApiSecurityAuth } from '@/common/decorators';
import { OperateLogEnum } from '@/common/enum';
import { success } from '@/common/utils';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryTenantDto, TenantListDto } from './dto';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { TenantException } from './tenant.exception';
import { TenantService } from './tenant.service';

// -- swagger 设置 --begain
// 设置标题
@ApiTags('系统管理-租户管理')
// token 参数设置
@ApiSecurityAuth()
// -- swagger 设置 --end
@Controller('tenant')
export class TenantController {
    private logMoudle = 'tenant.module';
    private logType = OperateLogEnum.systemAdmin;
    constructor(private readonly service: TenantService) {}

    @ApiOperation({ summary: '获取租户列表' })
    @ApiResult({ type: TenantListDto, isPage: true })
    @Post('query')
    async findAll(@Body() query: QueryTenantDto) {
        const { current, pageSize, sort } = query;
        const filter = this.service.createQueryWhere(query);
        const [list, total] = await this.service.findPagination({ filter, sort, current, pageSize });
        return { list, current, pageSize, total };
    }

    @ApiOperation({ summary: '新建租户' })
    @ApiResult({ type: Boolean })
    @Post()
    async create(@Body() post: CreateTenantDto) {
        const added = await this.service.addTenant(post);
        if (!added) {
            const error = {
                ...TenantError.addFailed,
            };
            throw new TenantException(error);
        }
        // 日志
        const log = {
            module: this.logMoudle,
            type: this.logType,
            content: 'tenant.add',
            lanArgs: { id: added.tenant_id },
        };
        // 创建带操作日志信息的返回数据
        return success(added, log);
    }
}
