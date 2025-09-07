import { Expose, Type } from 'class-transformer';
import { getRelativeTime } from '../../tools/date';
import { ContentItemStatus } from '../enums/ContentItemStatus';
import { ChannelMessageEntity } from './ChannelMessageEntity';

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
  statusMessage: string | null;

  @Expose()
  downloadedAt: Date | null;

  @Expose()
  @Type(() => ChannelMessageEntity)
  channelMessage: ChannelMessageEntity;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  public getTitle(): string {
    const channelName = this.getChannelName();
    const username = this.getUsername();

    return  `Channel: ${channelName} / User: ${username} / ${this.getUploadDate()}`;
  }

  public isImage(): boolean {
    return this.channelMessage.isImage();
  }

  public isVideo(): boolean {
    return this.channelMessage.isVideo();
  }

  public getUsername(): string {
    return this.channelMessage.getUsername();
  }

  public getChannelName(): string {
    return this.channelMessage.getChannelName();
  }

  public getUploadDate() {
    return getRelativeTime(this.channelMessage.date);
  }
}
