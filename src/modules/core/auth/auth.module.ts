import { isDev } from '@/config';
import { LockerModule } from '@/modules/admin/locker/locker.module';
import { UserModule } from '@/modules/admin/user/user.module';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { SystemConfigureModule } from '../system-configure/system-configure.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessToken, AccessTokenSchema, RefreshToken, RefreshTokenSchema } from './schemas';
import { TokenService } from './services';
import { JwtStrategy, LocalStrategy } from './strategies';

const providers = [AuthService, TokenService];
const strategies = [LocalStrategy, JwtStrategy];

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AccessToken.name, schema: AccessTokenSchema },
            { name: RefreshToken.name, schema: RefreshTokenSchema },
        ]),
        PassportModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => {
                const { secret, tokenExpired } = configService.get('appConfig.jwt');
                return {
                    global: true,
                    secret,
                    signOptions: {
                        // algorithm: 'HS512',
                        expiresIn: `${tokenExpired}s`, // 有效时长
                    },
                    ignoreExpiration: isDev,
                };
            },
            inject: [ConfigService],
        }),
        forwardRef(() => UserModule),
        SystemConfigureModule,
        LockerModule,
    ],
    controllers: [AuthController],
    providers: [...strategies, ...providers],
    exports: [MongooseModule, JwtModule, ...providers],
})
export class AuthModule {}
