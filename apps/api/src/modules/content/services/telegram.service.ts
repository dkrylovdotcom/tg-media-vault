import { Injectable, OnModuleInit, Inject, LoggerService } from '@nestjs/common';
import { LOGGER } from '@global-modules/logger/consts';
import { TelegramBotProvider } from '../components/telegram-bot.provider';
import { ChannelMessageEntity } from '../../content/entities/channel-message.entity';
import { TelegramChannelMessage } from '../../content/interfaces/channel-message.interface';
import { ContentRepository } from '../repositories/content.repository';
import { ContentItemEntity } from '../entities/content-item.entity';
import fs from 'fs';
import path from 'path';
import PQueue from "p-queue";
import { MODULE_OPTIONS_TOKEN } from '../content.module-definition';
import { ContentModuleConfig } from '../interfaces/content-module-config.interface';

const VIDEOS_DIRECTORY_NAME = 'videos';
const IMAGES_DIRECTORY_NAME = 'images';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly downloadsDir: string;
  private readonly queue: PQueue;

  constructor(
    @Inject(LOGGER)
    private readonly logger: LoggerService,
    private readonly botProvider: TelegramBotProvider,
    private readonly contentRepository: ContentRepository,
    @Inject(MODULE_OPTIONS_TOKEN)
    protected readonly config: ContentModuleConfig,
  ) {
    this.queue = new PQueue({
      interval: config.queueInterval,
      intervalCap: 1,
      carryoverConcurrencyCount: true
    });
    let count = 0;
    this.queue.on('active', () => {
      this.logger.debug!(`[QUEUE] Working on item #${++count}. Size: ${this.queue.size} | Pending: ${this.queue.pending}`);
    });
    this.downloadsDir = config.downloadsDir;
  }

  public onModuleInit(): void {
    this.createDirectoryIfNotExists(this.downloadsDir);

    this.botProvider.onChannelMessage((msg) => {
      this.logger.debug!(`📥 New message from channel: ${msg.message_id}. Offset: ${this.botProvider.getCurrentOffset()}`);
      const channelMessage = new ChannelMessageEntity(msg as TelegramChannelMessage);

      if (!channelMessage.isContentUpload()) {
        this.logger.debug!(`📥 Is not content upload: ${channelMessage.getMessageId()}. Skipping`);
        return;
      }

      this.queue.add(async () => {
        await this.handleMessage(channelMessage);
      });
    });
  }

  private async handleMessage(channelMessage: ChannelMessageEntity): Promise<void> {
    const messageId = channelMessage.getMessageId();
    const existingContentItem = await this.contentRepository.findOne(messageId);
    if (existingContentItem) {
      this.logger.debug!(`Message already exists: ${messageId}`);
      return;
    }

    let contentItem = ContentItemEntity.create(
      this.botProvider.getCurrentOffset(),
      channelMessage.getChannelId(),
      channelMessage.getUserId(),
      messageId,
    );
    contentItem.setChannelMessage(channelMessage);
    contentItem = await this.contentRepository.save(contentItem);
    this.logger.debug!(`✅ Message saved: ${contentItem.messageId}`);

    await this.downloadContent(contentItem);
  }

  private async downloadContent(contentItem: ContentItemEntity): Promise<void> {
    const { channelMessage } = contentItem;

    try {
      const downloadsDir = this.getDownloadsDirForMessage(channelMessage);
      this.createDirectoryIfNotExists(downloadsDir);

      const fileId = channelMessage.getFileId();
      const fileName = channelMessage.getFileName();

      await this.downloadWithRetry(() => this.botProvider.downloadFile(fileId, downloadsDir, fileName));

      const filePath = `${downloadsDir.replace(this.downloadsDir, '')}/${fileName}`;
      contentItem.downloadSuccess(filePath);
      this.logger.debug!(`✅ Message download success: ${channelMessage.getMessageId()}`);

      await this.botProvider.sendOkReaction(
        channelMessage.getChannelId(),
        channelMessage.getMessageId(),
      );
    } catch (e) {
      this.logger.debug!(`❌ Message download failed: ${channelMessage.getMessageId()}`);
      contentItem.downloadFail(JSON.stringify(e));
    } finally {
      await this.contentRepository.save(contentItem);
    }
  }

  private async downloadWithRetry(
    fn: () => Promise<void>,
    retries = 5
  ): Promise<void> {
    const getRetryDelayFromTelegramError = (errorMessage: string): number => {
      let retryAfter = 5; // default
      const parts = errorMessage.split('retry after ');

      if (parts.length > 1) {
        const seconds = parseInt(parts[1], 10);

        if (!isNaN(seconds)) {
          retryAfter = seconds + retryAfter; // Retry with additional delay of default retryAfter value
        }
      }

      return retryAfter;
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await fn();
        return; // success
      } catch (err: any) {
        const isTooManyRequestsError = err?.code === "ETELEGRAM" && /429/.test(err.message);

        if (isTooManyRequestsError) {
          const retryAfter = getRetryDelayFromTelegramError(err.message);
          this.logger.warn!(`[RETRY] Attempt ${attempt} failed due to rate limit. Retrying after ${retryAfter}s.`);
          await new Promise(res => setTimeout(res, retryAfter * 1000));
        } else {
          throw err; // other errors
        }
      }
    }

    throw new Error(`Download failed after maximum retries: ${retries}.`);
  }

  private getDownloadsDirForMessage(channelMessage: ChannelMessageEntity): string {
    let downloadsDir = this.downloadsDir;

    // NOTE:: /downloads/my_channel_name
    const channelNameForDirectory = this.sanitizeChannelName(channelMessage.getChannelName());
    downloadsDir = path.join(downloadsDir, channelNameForDirectory);
    
    // NOTE:: /downloads/my_channel_name/videos or /downloads/my_channel_name/images
    if (channelMessage.isVideo()) {
      downloadsDir = path.join(downloadsDir, VIDEOS_DIRECTORY_NAME);
    } else if (channelMessage.isImage()) {
      downloadsDir = path.join(downloadsDir, IMAGES_DIRECTORY_NAME);
    }

    // NOTE:: /downloads/my_channel_name/videos/2025 or /downloads/my_channel_name/images/2025
    const currentYear = new Date().getFullYear().toString();
    downloadsDir = path.join(downloadsDir, currentYear);

    // NOTE:: /downloads/my_channel_name/videos/2025/8 or /downloads/my_channel_name/images/2025/8
    const currentMonth = (new Date().getMonth() + 1).toString();
    downloadsDir = path.join(downloadsDir, currentMonth);

    return downloadsDir;
  }
  
  private createDirectoryIfNotExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  // NOTE:: Transforms channel name to correct directory name
  // e.g. "My/Weird:Channel?Name" to "my_weird_channel_mame"
  private sanitizeChannelName(channelName: string): string {
    if (!channelName) return "unknown_channel";

    // NOTE:: Remove forbidden characters for file systems
    let sanitized = channelName.replace(/[\/\\?%*:|"<>]/g, "_");

    // NOTE:: Replace spaces with underscores
    sanitized = sanitized.replace(/\s+/g, "_");

    // NOTE:: Trim the name so it's not too long (e.g., 50 characters)
    sanitized = sanitized.substring(0, 50);

    // NOTE:: If the name is empty after sanitization
    if (!sanitized) return "unknown_channel";

    return sanitized.toLowerCase();
}
}
