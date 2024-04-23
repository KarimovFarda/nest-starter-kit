import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value.toLowerCase())
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    userName: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(8, { message: 'password should be minimmum 8' })
    @MaxLength(50, { message: 'password should be maximium 50' })
    password: string;
}
