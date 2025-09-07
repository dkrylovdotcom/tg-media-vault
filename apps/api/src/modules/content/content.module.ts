import {
  Logger,
  Module,
} from '@nestjs/common';
import { ContentController } from './controllers/content.controller';
import { ContentRepository } from './repositories/content.repository';
import { TelegramService } from './services/telegram.service';
import { TelegramBotProvider } from './components/telegram-bot.provider';
import { LOGGER } from '@global-modules/logger/consts';
import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } from './content.module-definition';
import { ContentConfig } from './interfaces/content-config.interface';
import { ContentService } from './services/content.service';


@Module({
  controllers: [ContentController],
  providers: [
    {
      provide: TelegramBotProvider,
      useFactory: async (
        logger: Logger,
        config: ContentConfig,
        contentRepository: ContentRepository,
      ) => {
        const { botToken, channelId } = config;
        const lastOffset = await contentRepository.getOffset();

        return new TelegramBotProvider(logger, botToken, channelId, lastOffset);
      },
      inject: [LOGGER, MODULE_OPTIONS_TOKEN, ContentRepository]
    },
    ContentService,
    TelegramService,
    ContentRepository,
  ],
})
export class ContentModule extends ConfigurableModuleClass {}
