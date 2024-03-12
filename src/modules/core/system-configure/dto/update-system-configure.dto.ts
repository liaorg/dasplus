import {
    LoginSafetyDto,
    PasswordSafetyDto,
    PortStatusDto,
    RemoteDebugDto,
    ServerPortDto,
} from '@/modules/admin/security-configure/dto';
import { TimeConfigureDto } from '@/modules/admin/time-configure/dto';

export class UpdateeSystemConfigureDto {
    update_date?: number;
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
