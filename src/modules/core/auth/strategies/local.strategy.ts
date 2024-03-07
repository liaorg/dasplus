import { AdapterRequest } from '@/common/adapters';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { AuthStrategy } from '../constants';

// 本地策略
// 根据项目的需求来决定是否需要本地策略
// 验证用户登录等
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, AuthStrategy.LOCAL) {
    constructor(private authService: AuthService) {
        // private readonly systemConfigureService: SystemConfigureService, // private readonly lockerService: LockerService, // private readonly userService: UserService,
        super({
            passReqToCallback: true,
        });
    }

    /**
     * 这边的返回将写入 AdapterRequest 对象中
     * 其它服务可由 @RequestUserDecorator() loginUser: RequestUserDto 调取
     */
    async validate(request: AdapterRequest, username: string, password: string) {
        const user = await this.authService.validateLoginUser(request, username, password);
        return user;
        // TODO 查询验证多因子
        // const [loginSafety, lockerOld] = await Promise.all([
        //     // 获取登录安全配置
        //     this.systemConfigureService.getLoginSafety(),
        //     // 查询锁定客户端
        //     this.lockerService.findOne({ filter: { address: request.ip } }),
        // ]);
        // // 获取登录安全参数
        // // 登录失败次数
        // const maxLoginFailed = loginSafety.numOfLoginFailedToLocked;
        // // 登录失败锁定时间/分钟 => 转换成秒
        // const lockedTime = loginSafety.timeOfLoginFailedToLocked * 60;
        // const maxTimes = maxLoginFailed - 1;
        // // 验证码
        // if (loginSafety.statusOfcaptcha) {
        //     // 判断验证码是否存在
        //     if (request?.body?.captcha) {
        //         // 解密验证码
        //         const [error, _captcha] = await catchAwait(
        //             sm4Decrypt(request.body.captcha, appConfig.sm4.key, appConfig.sm4.iv),
        //         );
        //         if (error !== undefined) {
        //             // 验证失败
        //             this.checkLeftTimes({
        //                 lockerOld,
        //                 lockedTime,
        //                 maxTimes,
        //                 ip: request.ip,
        //                 name,
        //                 captchaError: true,
        //             });
        //         }
        //     } else {
        //         // 如果开启了验证码
        //         const error = {
        //             statusCode: 400,
        //             ...AuthError.mastCaptcha,
        //         };
        //         // 生成验证 token
        //         // 私钥加密，公钥解密是签名的过程
        //         const tnoce = await nanoid();
        //         const newCaptcha = await sm4Encrypt(tnoce, appConfig.sm4.key, appConfig.sm4.iv);
        //         throw new AuthException(error, {
        //             rep: { err_msg: { loginSafety, captcha: newCaptcha } },
        //         });
        //     }
        // }
        // // 查询用户并比较密码
        // const loginUser = await this.userService.validateUser(name, password);
        // if (!loginUser) {
        //     this.checkLeftTimes({
        //         lockerOld,
        //         lockedTime,
        //         maxTimes,
        //         ip: request.ip,
        //         name,
        //     });
        // }
        // // 验证成功，恢复锁定客户端状态
        // const updateLocker = {
        //     status: 0,
        //     times: 0,
        // };
        // if (lockerOld) {
        //     this.lockerService.update(request.ip, updateLocker).catch(emptyCallback);
        // }
        // if (loginUser.status !== 1) {
        //     const error = {
        //         ...AuthError.disabledUser,
        //     };
        //     throw new AuthException(error);
        // }
        // // 这边的返回将写入 @RequestUserDecorator() loginUser: RequestUserDto
        // const user = user2requestUser(loginUser);
        // return user;
    }

    // 验证登录失败次数
    // checkLeftTimes(param: {
    //     lockerOld: LockerDocument;
    //     lockedTime: number;
    //     maxTimes: number;
    //     ip: string;
    //     name: string;
    //     captchaError?: boolean;
    // }) {
    //     const { lockerOld, lockedTime, ip, name, maxTimes, captchaError } = param;
    //     // 剩余登录失败次数
    //     let leftTimes = maxTimes;
    //     if (lockerOld) {
    //         leftTimes = (lockerOld?.times || 0) - maxTimes;
    //         // 登录失败，更新登录失败次数
    //         const updateLocker = {
    //             times: lockerOld.times + 1,
    //             status: 1,
    //             seconds: lockedTime,
    //         };
    //         this.lockerService.update(ip, updateLocker).catch(emptyCallback);
    //     } else {
    //         // 登录失败，记录登录失败次数
    //         const newLocker = {
    //             username: name,
    //             address: ip,
    //             seconds: lockedTime,
    //         };
    //         this.lockerService.create(newLocker).catch(emptyCallback);
    //     }
    //     if (leftTimes) {
    //         const times = Math.abs(leftTimes);
    //         let error: ApiErrorInterface;
    //         if (captchaError) {
    //             error = {
    //                 ...AuthError.wrongCaptcha,
    //                 args: { times },
    //             };
    //         } else {
    //             error = {
    //                 ...AuthError.wrongUserOrPassword,
    //                 args: { times },
    //             };
    //         }
    //         throw new AuthException(error, { rep: { err_msg: { times } } });
    //     } else {
    //         const minutes = Math.floor(lockerOld.seconds / 60);
    //         const error = {
    //             ...AuthError.localLockedClient,
    //             args: { minutes },
    //         };
    //         throw new AuthException(error, { rep: { err_msg: { minutes } } });
    //     }
    // }
}
