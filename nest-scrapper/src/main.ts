import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

import * as config from '../config.json'

declare const module: any;

async function bootstrap() {
  console.log("KONFIG",config)

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
