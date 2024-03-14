/*
https://docs.nestjs.com/guards#guards
*/

import { AdapterRequest } from '@/common/adapters';
import { AuthError } from '@/common/constants';
import { emptyCallback } from '@/common/utils';
import { LockerService } from '@/modules/admin/locker/locker.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SystemConfigureService } from '../../system-configure/system-configure.service';
import { AuthException } from '../auth.exception';

/**
 * 客户端锁定守卫
 * 验证请求参数
 * @export
 * @class LockerGuard
 */
@Injectable()
export class LockerGuard implements CanActivate {
    constructor(
        private readonly lockerService: LockerService,
        private readonly systemConfigureService: SystemConfigureService,
    ) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        // 检查请求 ip 是否被锁定
        return await this.validateLocker(request);
    }

    // 验证
    async validateLocker(request: AdapterRequest): Promise<boolean> {
        // 获取登录安全配置
        const loginSafety = await this.systemConfigureService.getLoginSafety();
        // 登录失败次数
        const maxLoginFailed = loginSafety.numOfLoginFailedToLocked;
        // 查询锁定客户端
        const filter = {
            address: request.ip,
            status: 1,
            times: maxLoginFailed,
        };
        const data = await this.lockerService.getCacheDataByFilter(filter);
        const locker = data[0];
        if (locker) {
            // 剩余登录失败次数
            // const leftTimes = (locker?.times || 0) - maxLoginFailed - 1;
            // 判断是否已到锁定时间
            const seconds = locker?.seconds || loginSafety.timeOfLoginFailedToLocked * 60;
            // 剩余锁定时间
            const letLockedTimes = Date.now() - locker.update_date - seconds * 1000;
            if (letLockedTimes < 0) {
                const minutes = Math.floor(seconds / 60);
                const error = {
                    statusCode: 403,
                    ...AuthError.lockedClient,
                    args: { minutes },
                };
                throw new AuthException(error);
            }
            // 过了超时时间更新状态为 0
            const updateLocker = {
                status: 0,
                times: 0,
            };
            this.lockerService.update(request.ip, updateLocker).catch(emptyCallback);
        }
        return true;
    }
}
