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

  async findUserLogsByGroup(id: number) {
    // select log.result as result, COUNT(log.result) as count from log
    // left join user on user.id = log.userId
    // where user.id = 1
    // group by log.result
    // order by result desc
    // limit 10 offset 0
    return await this.logRepository
      .createQueryBuilder('log')
      .select('log.result', 'result')
      .addSelect('COUNT(log.result)', 'count')
      .leftJoinAndSelect('log.user', 'user')
      .where('user.id = :id', { id })
      .groupBy('log.result')
      .orderBy('count', 'DESC')
      .addOrderBy('result', 'DESC')
      .limit(10)
      .offset(0)
      .getRawMany();
  }

  async findUserLogsByGroupV2(id: number) {
    // select log.result as result, COUNT(log.result) as count from log
    // left join user on user.id = log.userId
    // where user.id = 1
    // group by log.result
    // order by result desc
    // limit 10, offset 0
    const sql =
      'select log.result as result, COUNT(log.result) as count from log' +
      ' left join user on user.id = log.userId' +
      ' where user.id = ?' +
      ' group by log.result' +
      ' order by result desc' +
      ' limit 10 offset 0';
    return await this.logRepository.query(sql, [id]);
  }
}
