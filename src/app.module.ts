import { Global, Module, Logger } from '@nestjs/common';
// config
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigEnum, LogEnum } from 'src/enum/config.enum';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
// modules
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
// mysql
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
// mongoose
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
// entity
import { User } from './user/user.entity';
import { Profile } from './user/profile.entity';
import { Role } from './role/role.entity';
import { Log } from './log/log.entity';
// env file
const envFilePath = `.env.${process.env.NODE_ENV || `development`}`;

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'staging', 'production')
          .default('development'),
        // mysql
        DB_PORT: Joi.number().default(3306),
        DB_HOST: Joi.alternatives().try(
          Joi.string().ip(),
          Joi.string().domain(),
        ),
        DB_TYPE: Joi.string().valid('mysql').default('mysql'),
        DB_DATABASE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
        // mongoose
        MONGO_DB_HOST: Joi.alternatives().try(
          Joi.string().ip(),
          Joi.string().domain(),
        ),
        MONGO_DB_PORT: Joi.number().default(27017),
        MONGO_DB_DATABASE: Joi.string().required(),
        MONGO_DB_USERNAME: Joi.string().required(),
        MONGO_DB_PASSWORD: Joi.string().required(),
        // logging
        LOG_ON: Joi.boolean(),
        LOG_LEVEL: Joi.string(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logFlag = configService.get(LogEnum.LOG_ON) === 'true';
        return {
          type: configService.get(ConfigEnum.DB_TYPE),
          host: configService.get(ConfigEnum.DB_HOST),
          port: configService.get(ConfigEnum.DB_PORT),
          username: configService.get(ConfigEnum.DB_USERNAME),
          password: configService.get(ConfigEnum.DB_PASSWORD),
          database: configService.get(ConfigEnum.DB_DATABASE),
          entities: [User, Profile, Role, Log],
          synchronize: true,
          logging: logFlag && process.env.NODE_ENV === 'development',
        } as TypeOrmModuleOptions;
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get(ConfigEnum.MONGO_DB_HOST);
        const port = configService.get(ConfigEnum.MONGO_DB_PORT);
        const username = configService.get(ConfigEnum.MONGO_DB_USERNAME);
        const password = configService.get(ConfigEnum.MONGO_DB_PASSWORD);
        const database = configService.get(ConfigEnum.MONGO_DB_DATABASE);
        const uri = username
          ? `mongodb://${username}:${password}@${host}:${port}/${database}`
          : `mongodb://${host}:${port}/${database}`;
        return {
          uri,
          retryAttempts: Infinity,
          retryDelay: 5000,
        } as MongooseModuleOptions;
      },
    }),
    UserModule,
    SharedModule,
  ],
  controllers: [],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
