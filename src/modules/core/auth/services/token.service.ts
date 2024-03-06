import { ObjectIdType } from '@/common/interfaces';
import { MongoDbService } from '@/common/services';
import { getUTCTime, isEmpty, toObjectId } from '@/common/utils';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Dayjs } from 'dayjs';
import { FastifyReply } from 'fastify';
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
    private readonly accessTokenService: MongoDbService<AccessToken>;
    private readonly refreshTokenService: MongoDbService<RefreshToken>;
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        @InjectModel(AccessToken.name) private readonly accessTokenModel: Model<AccessToken>,
        @InjectModel(RefreshToken.name) private readonly refreshTokenModel: Model<RefreshToken>,
    ) {
        this.accessTokenService = new MongoDbService(this.accessTokenModel);
        this.refreshTokenService = new MongoDbService(this.refreshTokenModel);
    }
    /**
     * 根据accessToken刷新AccessToken与RefreshToken
     * @param accessToken
     * @param response
     * @returns
     */
    async refreshToken(
        accessToken: FlattenMaps<AccessToken> & { _id: ObjectIdType },
        response: FastifyReply,
    ) {
        const { user, _id, role, login_ip } = accessToken;
        const refreshToken = await this.getRefreshTokenByAccessToken(_id);
        if (refreshToken) {
            const now = getUTCTime();
            // 判断 refreshToken 是否过期
            if (now.isAfter(refreshToken.expiredAt)) return null;
            // 如果没过期则生成新的 accessToken 和 refreshToken
            const token = await this.generateAccessToken(
                user as ObjectIdType,
                role as ObjectIdType,
                login_ip,
            );
            // 删除旧的 token
            await this.accessTokenService.deleteOne({ filter: { _id } });
            response.header('token', token.accessToken.value);
            return token;
        }
        return null;
    }
    /**
     * 根据荷载签出新的AccessToken并存入数据库
     * 且自动生成新的Refresh也存入数据库
     *
     * @param userId
     * @param roleId
     * @returns
     * @memberof TokenService
     */
    async generateAccessToken(userId: ObjectIdType, roleId: ObjectIdType, ip?: string) {
        // 获取登录安全配置
        const now = getUTCTime();
        const accessTokenPayload: TokenPayloadDto = {
            sub: userId.toString(),
            iat: now.unix(),
            $id: await nanoid(),
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
        await this.accessTokenService.insert({ doc: accessToken });

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
            sub: await nanoid(),
            iat: now.unix(),
            $id: await nanoid(),
        };
        const { secret, refreshTokenExpired } = this.configService.get('appConfig.jwt');
        const signed = await this.jwtService.signAsync(refreshTokenPayload, { secret });
        const refreshToken = new this.refreshTokenModel({
            value: signed,
            accessToken: accessToken._id,
            expiredAt: now.add(refreshTokenExpired, 'second').unix(),
        });
        // refreshToken 存入数据库
        await this.refreshTokenService.insert({ doc: refreshToken });
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
        return await this.refreshTokenService.findOne({ filter: { accessToken: aid } });
    }

    /**
     * 检查accessToken是否存在
     *
     * @param value token值
     * @returns
     */
    async checkAccessToken(value: string) {
        return await this.accessTokenService.findOne({
            filter: { value },
        });
    }

    /**
     * 移除AccessToken且自动移除关联的RefreshToken
     *
     * @param {string} value
     */
    async removeAccessToken(value: string) {
        const accessToken = await this.accessTokenService.findOne({ filter: { value } });
        if (accessToken) {
            await Promise.all([
                // 删除 RefreshToken
                this.refreshTokenService.findOneAndDelete({ filter: { accessToken: accessToken._id } }),
                // 删除 AccessToken
                this.accessTokenService.deleteOne({ filter: { _id: accessToken._id } }),
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
        const accessToken = await this.accessTokenService.find({
            filter: { user: { $in: uids } },
            options: { session },
        });
        const accessTokenIds = [];
        !isEmpty(accessToken) &&
            accessToken.forEach((value) => {
                accessTokenIds.push(value._id);
            });
        if (accessTokenIds.length) {
            await Promise.all([
                // 删除 RefreshToken
                this.refreshTokenService.deleteMany({
                    filter: { accessToken: { $in: accessTokenIds } },
                }),
                // 删除 AccessToken
                this.accessTokenService.deleteMany({ filter: { _id: { $in: accessTokenIds } } }),
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
        const accessToken = await this.accessTokenService.find({ filter: { role: { $in: rids } } });
        const accessTokenIds = [];
        !isEmpty(accessToken) &&
            accessToken.forEach((value) => {
                accessTokenIds.push(value._id);
            });
        if (accessTokenIds.length) {
            await Promise.all([
                // 删除 RefreshToken
                this.refreshTokenService.deleteMany({
                    filter: { accessToken: { $in: accessTokenIds } },
                }),
                // 删除 AccessToken
                this.accessTokenService.deleteMany({ filter: { _id: { $in: accessTokenIds } } }),
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
        return await this.accessTokenService.updateOne({
            filter: { user: userId, login_ip: ip },
            doc,
        });
    }

    /**
     * 验证Token是否正确,如果正确则返回所属用户对象
     * @param token
     */
    async verifyAccessToken(token: string) {
        return this.jwtService.verify(token);
    }
}
