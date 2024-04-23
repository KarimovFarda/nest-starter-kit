import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository, UpdateResult } from "typeorm";
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from "./dto/create-user.dto";
import { v4 as uuid4 } from "uuid";
@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) { }

    async create(userDto: CreateUserDto): Promise<UserEntity> {
        const user = new UserEntity();

        user.userName = userDto.userName;
        user.email = userDto.email;
        user.apiKey = uuid4();
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(userDto.password, salt);
        const savedUser = await this.userRepository.save(user);
        delete savedUser.password;
        console.log(savedUser)
        return savedUser;
    }

    async findOne(data: Partial<UserEntity>): Promise<UserEntity> {
        const user = await this.userRepository.findOneBy({ email: data.email });
        if (!user) {
            throw new UnauthorizedException("Could not find user")
        }
        return user
    }

    async findByApiKey(apiKey: string): Promise<UserEntity> {
        return this.userRepository.findOneBy({ apiKey });
    }
    async findById(id: number): Promise<UserEntity> {
        return this.userRepository.findOneBy({ id })
    }

    async updateSecretKey(userId: number, secret: string): Promise<UpdateResult> {
        return this.userRepository.update({
            id: userId
        },
            {
                twoFASecret: secret,
                enable2FA: true
            })
    }

    async disable2FA(userId: number): Promise<UpdateResult> {
        return this.userRepository.update({
            id: userId
        }, {
            enable2FA: false,
            twoFASecret: null
        })
    }
}