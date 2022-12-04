import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
// entity
import { Log } from 'src/log/log.entity';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Log])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
