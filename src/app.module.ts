import { Global, Module, Logger } from '@nestjs/common';
// config
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
// modules
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { LogModule } from './log/log.module';
// mysql
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionParams } from '../ormconfig';
// mongoose
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConnectionParams } from '../mongoconfig';
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
          Joi.string(),
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
          Joi.string(),
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
    // MYSQL
    TypeOrmModule.forRoot(connectionParams),
    // MONGO
    MongooseModule.forRootAsync({
      useFactory: () => mongoConnectionParams,
    }),
    // modules
    UserModule,
    SharedModule,
    LogModule,
  ],
  controllers: [],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
