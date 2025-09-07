import {
  Module,
} from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { DatabaseModule } from '@global-modules/database';
import { LoggerModule } from '@global-modules/logger/logger.module';

import { EnvironmentVariables } from './environment-variables';
import { DatabaseExceptionFilter } from './filters/database-exception.filter';
import { ContentModule } from './modules/content/content.module';
import { EnvironmentVariablesModule } from '@global-modules/environment-variables/environment-variables.module';
import { ConfigService } from '@global-modules/environment-variables/config.service';
import { validate } from '@global-modules/environment-variables/validate/validate';

@Module({
  imports: [
    EnvironmentVariablesModule.forRoot({
      process: validate(EnvironmentVariables),
    }),
    LoggerModule,
    DatabaseModule.registerAsync({
      imports: [EnvironmentVariablesModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables>) => ({
        enableLog: config.get('ENABLE_DB_LOG'),
      }),
    }),
    ContentModule.registerAsync({
      imports: [EnvironmentVariablesModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables>) => ({
        botToken: config.get('TELEGRAM_BOT_TOKEN'),
        channelId: config.get('TELEGRAM_CHANNEL_ID'),
        downloadsDir: config.get('DOWNLOAD_DIRECTORY_PATH'),
        queueInterval: config.get('QUEUE_INTERVAL'),
      }),
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
  ],
})
export class AppModule {}
