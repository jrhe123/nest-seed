import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// winston logger
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// global http exception filter
import { AllExceptionFilter } from './filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // NESTJS log
    // logger: false,
    // logger: ['log', 'debug', 'warn', 'error', 'verbose'],
    // bufferLogs: true,
    // WINSTON
    // logger,
    cors: true,
  });
  // api prefix
  app.setGlobalPrefix('/api');
  // winston logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // NOTE: only one global filter applied
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));
  // run app
  const port = 3000;
  await app.listen(port);

  // webpack hot reload
  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }
}
bootstrap();
