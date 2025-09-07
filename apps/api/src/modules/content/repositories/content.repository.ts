import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { Database } from '@global-modules/database/database';
import { ContentItemEntity } from '../entities/content-item.entity';
import { ContentItemStatus } from '../enums/content-item-status.enum';

@Injectable()
export class ContentRepository {
  private readonly orderBy: Prisma.ContentOrderByWithRelationInput[] = [
    {
      id: 'asc',
    },
  ];

  constructor(private readonly db: Database) {}

  public async getOffset(): Promise<number> {
    const data = await this.db.client.content.findFirst({
      orderBy: {
        offset: 'desc',
      },
    });
    if (!data) {
      return 0;
    }

    return data.offset;
  }

  public async findAll(skip: number, take: number): Promise<ContentItemEntity[]> {
    const data = await this.db.client.content.findMany({
      where: {
        status: ContentItemStatus.DOWNLOAD_SUCCESS,
      },
      orderBy: this.orderBy,
      skip,
      take,
    });

    return this.buildModels(data);
  }

  public async totalCount(): Promise<number> {
    return this.db.client.content.count({
      where: {
        status: ContentItemStatus.DOWNLOAD_SUCCESS,
      },
    });
  }

  public async findAllCreated(): Promise<ContentItemEntity[]> {
    const data = await this.db.client.content.findMany({
      where: {
        status: ContentItemStatus.CREATED,
      },
      orderBy: this.orderBy,
    });

    return this.buildModels(data);
  }

  public async findOne(messageId: number): Promise<ContentItemEntity> {
    const data = await this.db.client.content.findFirst({
      where: {
        messageId,
      },
    });

    return this.buildModel(data);
  }

  public async save(item: ContentItemEntity): Promise<ContentItemEntity> {
    const createdContent = await this.db.client.content.upsert({
      where: {
        id: item.id || 0,
      },
      create: {
        offset: item.offset,
        userId: item.userId,
        channelId: item.channelId,
        messageId: item.messageId,
        status: item.status,
        statusMessage: item.statusMessage,
        channelMessage: JSON.stringify(item.channelMessage),
      },
      update: {
        filePath: item.filePath,
        downloadedAt: item.downloadedAt,
        status: item.status,
        statusMessage: item.statusMessage,
      },
    });

    return this.buildModel(createdContent);
  }

  private buildModel(data: unknown): ContentItemEntity {
    return plainToInstance(ContentItemEntity, data, {
      excludeExtraneousValues: true,
    });
  }

  private buildModels(data: unknown[]): ContentItemEntity[] {
    return plainToInstance(ContentItemEntity, data, {
      excludeExtraneousValues: true,
    });
  }
}
