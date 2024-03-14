import { ApiResult, ApiSecurityAuth } from '@/common/decorators';
import { CreateFileDto, RequestUserDto } from '@/common/dto';
import { OperateLogEnum } from '@/common/enum';
import { DecryptPasswordInterceptor } from '@/common/interceptors/decrypt-password.interceptor';
import { AnyObject } from '@/common/interfaces';
import { createPath, formatDateTime, generateFileDowloadParam, success } from '@/common/utils';
import { RequestUserDecorator } from '@/modules/core/auth/decorators';
import { SystemConfigureService } from '@/modules/core/system-configure/system-configure.service';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ExportOperateLogDto, OperateLogDto, OperateLogListDto, QueryOperateLogDto } from './dto';
import { OperateLogService } from './operate-log.service';

/**
 * 操作日志内容填充具体规则:
 * 1. 添加、删除、停用等操作由于只涉及一个对象的一个状态，如：[添加]用户#1
 * 2. 批量操作可以被看成是多次对单个对象进行操作，也只涉及一个状态，如：[删除]用户#1、用户#1
 * 3. 修改：
 *   1. 针对有限内容（如下拉框、多选框、复选框等）可直接记录前后变化，如状态：将[状态]由[状态一]修改为[状态二]
 *   2. 针对短文本也可以直接记录编辑前和编辑后的内容，如名称：将[名称]由[名称一]修改为[名称二]
 *   3. 复杂的记录旧值和新值
 *
 * 自动清理
 *
 * 系统安全员角色组用户，只能查看系统审计员角色组用户的操作日志
 * 系统审计员角色组用户，可查看非系统审计员角色组用户的操作日志
 */

@ApiTags('日志管理-操作日志')
@ApiSecurityAuth()
@Controller('operate-log')
export class OperateLogController {
    private logMoudle = 'log.module';
    constructor(
        private readonly service: OperateLogService,
        private readonly systemConfigureService: SystemConfigureService,
    ) {}

    // 导出日志操作，异步先调用 POST operate-log 生成文件，创建生成文件任务
    // 再调用下载文件的操作
    @ApiOperation({ summary: '导出操作日志-生成文件-选中/全部' })
    @ApiResult({ type: CreateFileDto })
    // 密码解密
    @UseInterceptors(DecryptPasswordInterceptor)
    @Post('file')
    async createFile(
        @Body() post: ExportOperateLogDto,
        @RequestUserDecorator() loginUser: RequestUserDto,
        @I18n() i18n: I18nContext,
    ) {
        // 生成文件路径
        const { fileId, path, root, ext } = await createPath();
        // 创建文件
        await this.service.createFile(post, path, i18n, loginUser.roleGroupType);
        const moduleName = i18n.t(this.logMoudle) as string;
        const selectedLength = post?.ids?.length || 0;
        const password = post?.password;
        // 生成加密文件，返回文件下载参数
        const { content, filename } = await generateFileDowloadParam({
            i18n,
            moduleName,
            fileId,
            path,
            root,
            ext,
            selectedLength,
            password,
        });
        const log = {
            module: this.logMoudle,
            type: OperateLogEnum.export,
            operateDate: Date.now(),
            content,
            lanArgs: { num: selectedLength, name: moduleName },
        };
        // 创建带操作日志信息的返回数据
        return success({ fileId, filename }, log);
    }

    // @ApiOperation({ summary: '导出操作日志-选中/全部' })
    // @Get('file/:fileId')
    // async export(@Param('fileId') fileId: string, @Res() res: Response) {
    //     // dist 的上一级目录
    //     const { path } = await createPath({ fileId });
    //     // 下载文件
    //     return await downloadFile(path, res);
    // }

    @ApiOperation({ summary: '操作日志分页-查询' })
    @ApiResult({ type: OperateLogListDto, isPage: true })
    @Post('query')
    async findAll(
        @Body() query: QueryOperateLogDto,
        @RequestUserDecorator() loginUser: RequestUserDto,
    ): Promise<OperateLogListDto> {
        const { current, pageSize, sort } = query;
        // 获取分页参数
        const options = { current, pageSize };
        const where: AnyObject = this.service.createQueryWhere(query);
        const { list, total } = await this.service.findMany(
            where,
            loginUser.roleGroupType,
            options,
            sort,
        );
        // 获取时区配置
        const timeOpt = await this.systemConfigureService.getTimeConfig();
        // 处理多语言
        const logData = [];
        list.forEach(async (value) => {
            const temp: OperateLogDto = {
                _id: value._id,
                type: value.type,
                typeName: value.typeName,
                operateDate: formatDateTime({
                    date: value.operateDate * 1000,
                    timezone: timeOpt.timezone,
                }),
                content: value.content,
                operator: value.operator,
                operatorIp: value.operatorIp,
                actionOperate: value?.actionOperate,
            };
            logData.push(temp);
        });
        const data = { list: logData, current, pageSize, total };
        return data;
    }
}
