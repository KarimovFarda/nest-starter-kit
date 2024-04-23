import { Body, Controller, Post, Get, UseGuards, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UpdateResult } from "typeorm";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { UserLoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { JWTAuthGuard } from "./guards/jwt.guard";
import { Enable2FAType } from "./types";
import { ValidateTokenDTO } from "./dto/validate-token.dto";
@Controller("auth")
@ApiTags('Authentication')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService) { }
    @Post("signup")
    @ApiOperation({ summary: "Register new user" })
    @ApiResponse({
        status: 201,
        description: "It will return the user in the response"
    })
    signup(
        @Body()
        userDTO: CreateUserDto
    ): Promise<UserEntity> {
        console.log(userDTO)
        return this.userService.create(userDTO);
    }

    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({
        status: 200,
        description: 'It will give you the access_token in the response',
    })
    @Post('login')
    login(@Body() loginDto: UserLoginDto) {
        return this.authService.login(loginDto)
    }

    @ApiOperation({ summary: 'Enable 2FA' })
    @ApiResponse({
        status: 200,
        description: 'It will activate two-factor authentication',
    })
    @Get('enable-2fa')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JWTAuthGuard)
    enable2FA(@Request() req): Promise<Enable2FAType> {
        return this.authService.enable2FA(req.user.userId)
    }

    @ApiOperation({ summary: 'Validate 2FA' })
    @ApiResponse({
        status: 200,
        description: 'It will validate two-factor authentication',
    })
    @Post('validate-2fa')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JWTAuthGuard) validate2FA(@Request() req, @Body() validateTokenDTO: ValidateTokenDTO): Promise<{ verified: boolean }> {
        return this.authService.validate2FAToken(
            req.user.userId,
            validateTokenDTO.token
        )
    }

    @ApiOperation({ summary: 'Disable 2FA' })
    @ApiResponse({
        status: 200,
        description: 'It will deactivate two-factor authentication',
    })
    @Get('disable-2fa')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JWTAuthGuard) disable2FA(@Request() req): Promise<UpdateResult> {
        return this.authService.disable2FA(req.user.userId)
    }


    @ApiOperation({ summary: 'Get Profile info' })
    @ApiResponse({
        status: 200,
        description: 'It will return active user profile information',
    })
    @Get('profile')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JWTAuthGuard)
    getProfile(
        @Request()
        req,
    ) {
        delete req.user.password
        return {
            msg: 'authenticated with api key',
            user: req.user,
        };
    }

    @ApiOperation({ summary: 'Config' })
    @ApiResponse({
        status: 200,
        description: 'It will return environment information',
    })
    @Get("getconfig")
    getEnv() {
        return this.authService.getEnvVariables();
    }
}