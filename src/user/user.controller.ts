import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  // Logger,
  LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UserService } from './user.service';
// pino logger
// import { Logger } from 'nestjs-pino';

@Controller('user')
export class UserController {
  // NESTJS logger
  // private logger = new Logger(UserController.name);
  // PINO logger
  // private logger: Logger,
  // WINSTON logger (from @nestjs/common)
  // private logger: Logger,

  constructor(
    private userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: LoggerService,
  ) {
    this.logger.log('UserController init');
  }

  @Get()
  async getUsers() {
    this.logger.log('UserController init');
    this.logger.warn('UserController init');
    this.logger.error('UserController init');
    this.logger.debug('UserController init');
    this.logger.verbose('UserController init');
    // throw new HttpException('User is forbidden now', HttpStatus.FORBIDDEN);

    const users = await this.userService.find(
      {},
      {
        profile: true,
      },
    );
    return {
      msg: 'ok',
      data: users,
    };
  }

  @Get('/profile')
  async getUserProfile() {
    const userProfile = await this.userService.findUserProfile(1);
    return {
      msg: 'ok',
      data: userProfile,
    };
  }

  @Get('/logs')
  async getUserLogs() {
    const userLogs = await this.userService.findUserLogs(1);
    return {
      msg: 'ok',
      data: userLogs,
    };
  }

  @Get('/logsByGroup')
  async getUserLogsByGroup() {
    const userLogs = await this.userService.findUserLogsByGroupV2(1);
    return {
      msg: 'ok',
      data: userLogs.map((ul) => ({
        result: ul.result,
        count: ul.count,
      })),
    };
  }
}
