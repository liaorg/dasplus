import {
    LoginSafetyDto,
    PasswordSafetyDto,
    PortStatusDto,
    RemoteDebugDto,
    ServerPortDto,
} from '@/modules/admin/security-configure/dto';
import { TimeConfigureDto } from '@/modules/admin/time-configure/dto';
import { ConfigTypeEnum } from '../enum';

export class CreateSystemConfigureDto {
    /**
     * 配置类型
     * @example 1
     */
    type: ConfigTypeEnum;

    /**
     * 配置信息
     * @example
     */
    content:
        | LoginSafetyDto
        | PasswordSafetyDto
        | PortStatusDto
        | ServerPortDto[]
        | RemoteDebugDto
        | TimeConfigureDto;
}
