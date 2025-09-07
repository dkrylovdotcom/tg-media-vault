import { Controller, Get, Query } from '@nestjs/common';
import { ContentService } from '../services/content.service';
import { ContentWithPagination } from '../interfaces/content-with-pagination.interface';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  public getAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<ContentWithPagination> {
    return this.contentService.getAll(page, limit);
  }
}
