import { ConfigModule, ConfigService } from "@nestjs/config";
import {
    TypeOrmModuleAsyncOptions,
    TypeOrmModuleOptions,
} from "@nestjs/typeorm";
import { UserEntity } from "src/app/modules/user/user.entity";
import "dotenv/config"


//LOAD Environment Variables
require('dotenv').config();

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (
        configService: ConfigService,
    ): Promise<TypeOrmModuleOptions> => {
        console.log(configService.get<string>('dbHost'))
        return {
            type: 'postgres',
            host: configService.get<string>('dbHost'),
            port: configService.get<number>('dbPort'),
            username: configService.get<string>('username'),
            database: configService.get<string>('dbName'),
            password: configService.get<string>('password'),
            entities: [UserEntity],
            synchronize: false,
            migrations: ['dist/db/migrations/*.js'],
        };
    },
};