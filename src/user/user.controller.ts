import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers() {
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
}
