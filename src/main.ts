import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // NESTJS log
    // logger: false,
    logger: ['log', 'debug', 'warn', 'error', 'verbose'],
  });
  app.setGlobalPrefix('/api');
  const port = 3000;
  await app.listen(port);

  // webpack hot reload
  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }
}
bootstrap();
