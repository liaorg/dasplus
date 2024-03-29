import { AdapterResponse } from '@/common/adapters';
import { RequestUserDto } from '@/common/dto';
import { ObjectIdType } from '@/common/interfaces';
import { getUTCTime, isEmpty, toObjectId } from '@/common/utils';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Dayjs } from 'dayjs';
import { ClientSession, FlattenMaps, Model } from 'mongoose';
import { nanoid } from 'nanoid/async';
import { TokenPayloadDto } from '../dto';
import { AccessToken, AccessTokenDocument, RefreshToken } from '../schemas';

/**
 * 自定义中间件
 * 令牌服务
 */
@Injectable()
export class TokenService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        @InjectModel(AccessToken.name) private readonly accessTokenModel: Model<AccessToken>,
        @InjectModel(RefreshToken.name) private readonly refreshTokenModel: Model<RefreshToken>,
    ) {}
    /**
     * 根据accessToken刷新AccessToken与RefreshToken
     * @param accessToken
     * @param response
     * @returns
     */
    async refreshToken(
        accessToken: FlattenMaps<AccessToken> & { _id: ObjectIdType },
        response: AdapterResponse,
    ) {
        const { user, _id, role, login_ip } = accessToken;
        const refreshToken = await this.getRefreshTokenByAccessToken(_id);
        if (refreshToken) {
            const now = getUTCTime();
            // 判断 refreshToken 是否过期
            if (now.isAfter(refreshToken.expiredAt)) return null;
            // 如果没过期则生成新的 accessToken 和 refreshToken
            const loginUser: RequestUserDto = { _id: user.toString(), roleId: role.toString() };
            const token = await this.generateAccessToken(loginUser, login_ip);
            // 删除旧的 token
            await this.accessTokenModel.deleteOne({ _id });
            response.header('token', token.accessToken.value);
            return token;
        }
        return null;
    }
    /**
     * 根据荷载签出新的AccessToken并存入数据库
     * 且自动生成新的Refresh也存入数据库
     *
     * @param loginUser
     * @param ip
     * @returns
     * @memberof TokenService
     */
    async generateAccessToken(loginUser: RequestUserDto, ip: string) {
        const { _id: userId, roleId } = loginUser;
        // 获取登录安全配置
        const now = getUTCTime();
        const accessTokenPayload: TokenPayloadDto = {
            $id: await nanoid(),
            sub: userId,
            iat: now.unix(),
        };
        const { secret, tokenExpired } = this.configService.get('appConfig.jwt');
        const signed = await this.jwtService.signAsync(accessTokenPayload, { secret });
        const accessToken = new this.accessTokenModel({
            value: signed,
            login_ip: ip,
            user: userId,
            role: roleId,
            expiredAt: now.add(tokenExpired, 'second').unix(),
        });
        // accessToken 存入数据库
        await accessToken.save();
        // await this.accessTokenModel.insertMany({ doc: accessToken });

        // 生成刷新令牌
        const refreshToken = await this.generateRefreshToken(accessToken, getUTCTime());
        return { accessToken, refreshToken };
    }
    /**
     * 生成新的RefreshToken并存入数据库
     *
     * @param accessToken
     * @param now
     * @returns
     */
    async generateRefreshToken(accessToken: AccessTokenDocument, now: Dayjs): Promise<RefreshToken> {
        const refreshTokenPayload: TokenPayloadDto = {
            $id: await nanoid(),
            iat: now.unix(),
        };
        const { secret, refreshTokenExpired } = this.configService.get('appConfig.jwt');
        const signed = await this.jwtService.signAsync(refreshTokenPayload, { secret });
        const refreshToken = new this.refreshTokenModel({
            value: signed,
            accessToken: accessToken._id,
            expiredAt: now.add(refreshTokenExpired, 'second').unix(),
        });
        // refreshToken 存入数据库
        await refreshToken.save();
        return refreshToken;
    }
    /**
     * 根据 accessTokenId 获取 refreshToken
     *
     * @param {string} accessTokenId
     * @returns
     */
    async getRefreshTokenByAccessToken(accessTokenId: ObjectIdType): Promise<RefreshToken> {
        const aid = toObjectId(accessTokenId);
        return await this.refreshTokenModel.findOne({ accessToken: aid });
    }

    /**
     * 检查accessToken是否存在
     *
     * @param value token值
     * @returns
     */
    async checkAccessToken(value: string) {
        return await this.accessTokenModel.findOne({ value });
    }

    /**
     * 移除AccessToken且自动移除关联的RefreshToken
     *
     * @param {string} value
     */
    async removeAccessToken(value: string) {
        const accessToken = await this.accessTokenModel.findOne({ value });
        if (accessToken) {
            await Promise.all([
                // 删除 RefreshToken
                this.refreshTokenModel.findOneAndDelete({ accessToken: accessToken._id }),
                // 删除 AccessToken
                this.refreshTokenModel.deleteOne({ _id: accessToken._id }),
            ]);
        }
    }

    /**
     * 强制退出已经登录的用户
     * 把已经登录用户的 refresh_token access_token 清除
     * 这异步操作可以不用等待
     * @param userIds
     * @returns
     */
    async clearAccessToken(userIds: ObjectIdType[], session?: ClientSession) {
        // 先查询
        const uids = toObjectId(userIds);
        const accessToken = await this.accessTokenModel.find({ user: { $in: uids } }, null, { session });
        const accessTokenIds = [];
        !isEmpty(accessToken) &&
            accessToken.forEach((value) => {
                accessTokenIds.push(value._id);
            });
        if (accessTokenIds.length) {
            await Promise.all([
                // 删除 RefreshToken
                this.refreshTokenModel.deleteMany({
                    accessToken: { $in: accessTokenIds },
                }),
                // 删除 AccessToken
                this.refreshTokenModel.deleteMany({ _id: { $in: accessTokenIds } }),
            ]);
        }
        return true;
    }

    /**
     * 修改或删除角色时强制退出已经登录的用户
     * 把已经登录用户的 refresh_token access_token 清除
     * 这异步操作可以不用等待
     * @param roleIds
     * @returns
     */
    async clearAccessTokenByRoleId(roleIds: ObjectIdType[]) {
        // 先查询
        const rids = toObjectId(roleIds);
        const accessToken = await this.accessTokenModel.find({ role: { $in: rids } });
        const accessTokenIds = [];
        !isEmpty(accessToken) &&
            accessToken.forEach((value) => {
                accessTokenIds.push(value._id);
            });
        if (accessTokenIds.length) {
            await Promise.all([
                // 删除 RefreshToken
                this.refreshTokenModel.deleteMany({
                    accessToken: { $in: accessTokenIds },
                }),
                // 删除 AccessToken
                this.refreshTokenModel.deleteMany({ _id: { $in: accessTokenIds } }),
            ]);
        }
        return true;
    }

    /**
     * 根据 userId ip 修改 accessToken 的时间
     *
     * @param userId
     * @param ip 登录ip
     * @returns
     */
    async updateAccessTokenByUserid(userId: ObjectIdType, ip: string) {
        // 更新 token，实际为更新 create_date update_date
        const now = Date.now();
        const doc = {
            create_date: now,
            update_date: now,
        };
        return await this.accessTokenModel.updateOne({ user: userId, login_ip: ip }, doc);
    }

    /**
     * 验证Token是否正确,如果正确则返回所属用户对象
     * @param token
     */
    async verifyAccessToken(token: string) {
        return this.jwtService.verify(token);
    }
}
