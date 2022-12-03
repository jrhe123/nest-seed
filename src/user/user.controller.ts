import { Controller, Get } from '@nestjs/common';

// config
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';

@Controller('user')
export class UserController {
  constructor(private configService: ConfigService) {}

  @Get()
  getUsers(): any {
    const env = process.env;
    const db = this.configService.get(ConfigEnum.DB_DATABASE);
    return {
      msg: 'ok',
      db,
      env,
    };
  }
}
