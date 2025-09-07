import { Injectable } from '@nestjs/common';
import { ContentRepository } from '../repositories/content.repository';
import { ConfigService } from '@global-modules/environment-variables/config.service';
import { EnvironmentVariables } from '../../../environment-variables';
import path from 'path';
import { ContentWithPagination } from '../interfaces/content-with-pagination.interface';
import { serializeBigintToString } from '../../../tools/serialize-bigint-to-string';

@Injectable()
export class ContentService {
  constructor(
    private readonly config: ConfigService<EnvironmentVariables>,
    private readonly contentRepository: ContentRepository,
  ) {}

  public async getAll(page: number, limit: number): Promise<ContentWithPagination> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const [contentItems, total] = await Promise.all([
      this.contentRepository.findAll(skip, take),
      this.contentRepository.totalCount(),
    ]);

    const downloadsEndpoint = this.config.get('DOWNLOAD_ENDPOINT');
    for (const contentItem of contentItems) {
      contentItem.filePath = path.join(downloadsEndpoint, contentItem.filePath);
    }

    return {
      items: serializeBigintToString(contentItems),
      total,
    };
  }
}
