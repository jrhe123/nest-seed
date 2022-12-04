import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/shared/abstract.service';
import { Repository } from 'typeorm';
//
import { User } from './user.entity';
import { Log } from '../log/log.entity';

@Injectable()
export class UserService extends AbstractService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Log) private readonly logRepository: Repository<Log>,
  ) {
    super(userRepository);
  }

  async findUserProfile(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['profile'],
    });
  }

  async findUserLogs(id: number) {
    const userRes = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    return this.logRepository.find({
      where: {
        user: userRes,
      },
    });
  }
}
