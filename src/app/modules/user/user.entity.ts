import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: "janedoe",
        description: "Provide the user name of the user",
    })
    @Column()
    userName: string;

    @ApiProperty({
        example: "jane_doe@gmail.com",
        description: "Provide the email of the user",
    })
    @Column({ unique: true })
    email: string;

    @ApiProperty({
        example: "test123#@",
        description: "Provide the password of the user",
    })
    @Column()
    @Exclude()
    password: string;

    @Column({ nullable: true, type: 'text' })
    twoFASecret: string;

    @Column({ default: false, type: 'boolean' })
    enable2FA: boolean;

    @Column({ type: 'text' })
    apiKey: string;
}