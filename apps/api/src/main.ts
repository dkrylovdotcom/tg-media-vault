import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';

import { Database } from '@global-modules/database/database';

import { AppModule } from './app.module';
import { EnvironmentVariables } from './environment-variables';
import { ConfigService } from '@global-modules/environment-variables/config.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService<EnvironmentVariables>>(ConfigService);

  const downloadsDir = config.get('DOWNLOAD_DIRECTORY_PATH');
  const downloadsEndpoint = config.get('DOWNLOAD_ENDPOINT');
  app.use(downloadsEndpoint, express.static(downloadsDir));

  const db = app.get(Database);
  await db.enableShutdownHooks(app);

  app.enableCors({
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(config.get('PORT'), '0.0.0.0');
}

bootstrap();
