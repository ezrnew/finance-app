import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

import * as dotenv from 'dotenv';
import { resolve } from 'path';

declare const module: any;

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());

  app.enableCors({ credentials: true, origin: true });
  await app.listen(2137);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
