import {
  ExceptionFilter,
  HttpAdapterHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import * as requestIp from 'request-ip';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private logger = new Logger(AllExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const msg: unknown = exception['response'] || 'Internal Server Error';

    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      ip: requestIp.getClientIp(request),
      exceptioin: exception['name'],
      error: msg,
    };

    this.logger.error('[nest-seed]', responseBody);
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
