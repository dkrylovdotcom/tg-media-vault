import { LoggerService } from '@nestjs/common';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import fs from 'fs';
import https from 'https';
import path from 'path';
import { TelegramPollingError } from '../interfaces/telegram-polling-error.interface';

export class TelegramBotProvider {
  private readonly bot: TelegramBot;
  private readonly telegramApiUrl = 'https://api.telegram.org';

  constructor(
    private readonly logger: LoggerService,
    private readonly botToken: string,
    private readonly channelId: number,
    private readonly initialOffset: number,
  ) {
    if (!this.botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined');
    }

    this.bot = new TelegramBot(this.botToken, {
      polling: {
        autoStart: true,
        params: {
          offset: this.initialOffset,
        },
      },
      request: {
        // NOTE:: Resolves "Polling Error: {"code":"EFATAL","message":"EFATAL: Error: read ECONNRESET"}"
        agentOptions: {
          keepAlive: true,
          family: 4,
        },
        url: this.telegramApiUrl,
      },
    });
    this.bot.on('polling_error', async (errorMessage) => {
      this.logger.error(`Polling Error: ${JSON.stringify(errorMessage)}`);

      // NOTE:: Resolves "Polling Error: ("code":"EFATAL", 'message": "EFATAL: Error: read ECONNRESET"}"
      if (this.shouldBeRestarted(errorMessage as unknown as TelegramPollingError)) {
        await this.restartPolling();
      }
    });
    this.logger.log('🤖 Telegram bot initialized');
  }

  public getBot(): TelegramBot {
    return this.bot;
  }

  public async restartPolling(): Promise<void> {
    await this.bot.stopPolling();
    await this.bot.startPolling();
  }


  public getCurrentOffset(): number {
    // NOTE:: Workaround. There is no way to get offset, coz no events catched from "on('update', () => {})" in node-telegram-bot-api library
    return (this.bot as any)._polling?.options?.params?.offset || 0;
  }

  public onChannelMessage(handler: (msg: Message) => void) {
    this.bot.on('message', (msg: Message) => {
      if (msg.chat.id !== this.channelId) return;
      handler(msg);
    });
  }

  public async sendOkReaction(channelId: number, messageId: number): Promise<void> {
    await this.bot.setMessageReaction(
      channelId,
      messageId,
      {
        reaction: [{
          type: 'emoji',
          emoji: '👌',
        }],
      }
    );
  }

  public async downloadFile(fileId: string, outputDir: string, filename: string): Promise<void> {
    const file = await this.bot.getFile(fileId);

    if (!file.file_path) {
      throw new Error(`File path not found for fileId: ${fileId}`);
    }

    const fileUrl = `${this.telegramApiUrl}/file/bot${this.botToken}/${file.file_path}`;
    const savePath = path.join(outputDir, filename);

    await new Promise<void>((resolve, reject) => {
      const fileStream = fs.createWriteStream(savePath);
      https.get(fileUrl, (res) => {
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          this.logger.debug!(`✅ File saved: ${filename}`);
          resolve();
        });
      }).on('error', reject);
    });
  }

  private shouldBeRestarted(errorMessage: TelegramPollingError): boolean {
    return errorMessage.code === 'EFATAL' ||
          errorMessage.message.includes('ENOTFOUND') ||
          errorMessage.message.includes('ECONNRESET');
  }
}
