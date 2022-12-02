import { Module } from '@nestjs/common';
// config
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import * as joi from 'joi';
// modules
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: joi.object({
        NODE_ENV: joi
          .string()
          .valid('development', 'staging', 'production')
          .default('development'),
      }),
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
