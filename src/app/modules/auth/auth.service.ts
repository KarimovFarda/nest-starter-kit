import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy'
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/user.entity';
import { UserLoginDto } from './dto/login.dto';
import { JwtService } from "@nestjs/jwt";
import { Enable2FAType } from './types';
import { UpdateResult } from "typeorm";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService) { }

    async login(loginDTO: UserLoginDto): Promise<{ accessToken: string } | { validate2FA: string, message: string }> {
        const user = await this.usersService.findOne(loginDTO);
        const payload: any = { email: user.email, userId: user.id };

        const passwordMatched = await bcrypt.compare(
            loginDTO.password,
            user.password
        )

        if (passwordMatched) {
            delete user.password;
            // return user;

            const payload = { email: user.email, sub: user.id } // sub can be replaced
            return {
                accessToken: await this.jwtService.signAsync(payload)
            }

        } else {
            throw new UnauthorizedException("Password does not match")
        }
    }

    async enable2FA(userId: number): Promise<Enable2FAType> {
        const user = await this.usersService.findById(userId);
        console.log(user)

        var counter42 = speakeasy.hotp({ secret: user.twoFASecret, counter: 45 });
        console.log(counter42)

        if (user.enable2FA) {
            return { secret: user.twoFASecret }
        }
        const secret = speakeasy.generateSecret();
        user.twoFASecret = secret.base32
        // console.log(secret.base32)

        await this.usersService.updateSecretKey(user.id, user.twoFASecret);
        // console.log(user.twoFASecret)
        return { secret: user.twoFASecret }
    }

    async validate2FAToken(
        userId: number,
        token: string
    ): Promise<{ verified: boolean }> {
        try {
            const user = await this.usersService.findById(userId)

            const verified = speakeasy.totp.verify({
                secret: user.twoFASecret,
                token: token,
                encoding: 'base32'
            })

            if (verified) {
                return { verified: true }
            } else {
                return { verified: false }
            }
        } catch (err) {
            throw new UnauthorizedException("Error verifiying token")
        }
    }

    async validateUserByApiKey(apiKey: string): Promise<UserEntity> {
        return this.usersService.findByApiKey(apiKey);
    }

    async disable2FA(userId: number): Promise<UpdateResult> {
        return this.usersService.disable2FA(userId)
    }

    getEnvVariables() {
        return {
            port: this.configService.get<number>("port"),
        };
    }
}