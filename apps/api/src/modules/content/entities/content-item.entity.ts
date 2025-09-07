import { DefaultValue } from '@decorators/default-value.decorator';
import { Expose } from 'class-transformer';
import { ContentItemStatus } from '../enums/content-item-status.enum';
import { ChannelMessageEntity } from './channel-message.entity';
import { JsonColumnTransformer } from '../transformers/json-column.transformer';

export class ContentItemEntity {
  @Expose()
  id: number;

  @Expose()
  offset: number;

  @Expose()
  channelId: number;

  @Expose()
  userId: number;

  @Expose()
  messageId: number;

  @Expose()
  filePath: string;

  @Expose()
  status: ContentItemStatus;

  @Expose()
  @DefaultValue(null)
  statusMessage: string | null;

  @Expose()
  @DefaultValue(null)
  downloadedAt: Date | null;

  @Expose()
  @JsonColumnTransformer(ChannelMessageEntity)
  channelMessage: ChannelMessageEntity;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  public static create(
    offset: number,
    channelId: number,
    userId: number,
    messageId: number,
  ): ContentItemEntity {
    const content = new ContentItemEntity();
    content.offset = offset;
    content.channelId = channelId;
    content.userId = userId;
    content.messageId = messageId;
    content.status = ContentItemStatus.CREATED;

    return content;
  }

  public downloadFail(statusMessage: string): void {
    this.downloadedAt = new Date();
    this.status = ContentItemStatus.DOWNLOAD_FAIL;
    this.statusMessage = statusMessage;
  }

  public downloadSuccess(filePath: string): void {
    this.filePath = filePath;
    this.downloadedAt = new Date();
    this.status = ContentItemStatus.DOWNLOAD_SUCCESS;
  }

  public setChannelMessage(channelMessage: ChannelMessageEntity): void {
    this.channelMessage = channelMessage;
  }
}
