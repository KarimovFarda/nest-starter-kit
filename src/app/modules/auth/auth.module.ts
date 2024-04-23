import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { ApiKeyStrategy } from './strategies/api-key.strategy';
@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
        SharedModule,
        UserModule,
    ],
    providers: [AuthService, JwtStrategy, ApiKeyStrategy],
    controllers: [AuthController],
})
export class AuthModule { }
