import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AppService } from './app.service';
import { ApiSecurityAuth } from './common/decorators';

@ApiTags('测试')
@ApiSecurityAuth()
// @ApiBearerAuth()
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(@I18n() i18n: I18nContext): string {
        return this.appService.getHello() + i18n.t('api.hello');
    }
}
