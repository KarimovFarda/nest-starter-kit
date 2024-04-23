import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UserLoginDto {
    @ApiProperty()
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.toLowerCase())
    email: string;

    @ApiProperty({ description: 'password should be', minimum: 6, maximum: 30 })
    @IsNotEmpty()
    @MinLength(8, { message: 'password should be minimum 8 ' })
    @MaxLength(50, { message: 'password should be maximum 50 ' })
    password: string;
}
