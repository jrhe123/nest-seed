import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// winston
import { WinstonModule, WinstonModuleOptions, utilities } from 'nest-winston';
import * as winston from 'winston';
import { Console, DailyRotateFile } from 'winston/lib/winston/transports';
import 'winston-daily-rotate-file';
import { LogEnum } from 'src/enum/config.enum';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const consoleTransports = new Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            utilities.format.nestLike(),
          ),
        });
        const dailyTransports = new DailyRotateFile({
          level: 'warn',
          dirname: 'logs',
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
          ),
        });
        const dailyInfoTransports = new DailyRotateFile({
          level: configService.get(LogEnum.LOG_LEVEL),
          dirname: 'logs',
          filename: 'info-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
          ),
        });

        return {
          transports: [
            consoleTransports,
            ...(configService.get(LogEnum.LOG_ON)
              ? [dailyTransports, dailyInfoTransports]
              : []),
          ],
        } as WinstonModuleOptions;
      },
    }),
  ],
})
export class LogModule {}
