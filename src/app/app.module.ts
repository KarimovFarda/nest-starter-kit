import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SharedModule } from './modules/shared/shared.module';
import { AuthenticationGuard } from './modules/auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import configuration from '../config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from 'src/database/data-source';
import { ExampleModule } from './modules/example/example.module';
import { ThrottlerModule } from '@nestjs/throttler';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`],
      isGlobal: true,
      load: [configuration],
      // validate: validate
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('THROTTLE_TTL'),
          limit: config.get('THROTTLE_LIMIT'),
        },
      ],
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    UserModule,
    SharedModule,
    ExampleModule
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: AuthenticationGuard
  //   }
  // ]
})
export class AppModule { }