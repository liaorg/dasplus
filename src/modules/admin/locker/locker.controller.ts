import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import { PublicDecorator } from '@/modules/shared/auth/decorators';
import { LockerError } from '@/common/constants';
import { ApiResult, ApiSecurityAuth } from '@/common/decorators';
import { PaginationDto } from '@/common/dto';
import { OperateLogEnum } from '@/common/enum';
import { success } from '@/common/utils';
import { LockerDto, LockerListDto, UnLockingDto } from './dto';
import { LockerException } from './locker.exception';
import { LockerService } from './locker.service';

// -- swagger 设置 --begain
// 设置标题
@ApiTags('系统配置-系统安全配置-锁定客户端')
// token 参数设置
@ApiSecurityAuth()
// -- swagger 设置 --end
@Controller('locker')
export class LockerController {
    private logMoudle = 'role.module';
    private logType = OperateLogEnum.systemAdmin;
    constructor(private readonly service: LockerService) {}

    @ApiOperation({ summary: '锁定客户端-查询' })
    @ApiResult({ type: LockerListDto })
    @Post('query')
    async findAll(@Body() query: PaginationDto<LockerDto>) {
        const { current, pageSize, sort } = query;
        const filter = { status: 1 };
        const [doc, total] = await this.service.findPagination({ filter, current, pageSize, sort });
        const list = doc?.map((item) => {
            const temp = { ...item } as LockerDto;
            const now = Date.now();
            const diffTime = now - item.seconds * 1000;
            if (item.update_date > diffTime) {
                // 更新时间大于现在时间 - 时间差
                temp.left_time = Math.ceil((item.update_date - diffTime) / 1000);
            } else {
                temp.left_time = 0;
            }
            return temp;
        });
        return { list, current, pageSize, total };
    }

    @ApiOperation({ summary: '解锁客户端' })
    @ApiResult({ type: Boolean })
    @Patch('unlocking')
    async removeByAddress(@Body() data: UnLockingDto) {
        const address = data.address;
        const addressStr = address?.join(',');
        const deleted = await this.service.modifyByAddress(address);
        if (!deleted) {
            const error = {
                ...LockerError.unLockFailed,
                args: { address: addressStr },
            };
            throw new LockerException(error);
        }
        // 日志
        const log = {
            module: this.logMoudle,
            type: this.logType,
            content: 'locker.unlock',
            lanArgs: { address: addressStr },
        };
        // 创建带操作日志信息的返回数据
        return success<boolean>(true, log);
    }

    // @ApiOperation({ summary: '添加锁定客户端-测试用' })
    // @Post()
    // async create(@Body() post: CreateLockerDto) {
    //     const added = await this.service.insertMany({ doc: post });
    //     const { address } = post;
    //     if (!added) {
    //         const error = {
    //             ...LockerError.addFailed,
    //             args: { address },
    //         };
    //         throw new LockerException(error);
    //     }
    //     // 日志
    //     const log = {
    //         module: this.logMoudle,
    //         type: this.logType,
    //         content: 'adminHost.add',
    //         lanArgs: { address },
    //     };
    //     // 创建带操作日志信息的返回数据
    //     return success<boolean>(true, log);
    // }
}
