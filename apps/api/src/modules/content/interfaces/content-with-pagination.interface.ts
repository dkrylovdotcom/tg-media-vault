import { ContentItemEntity } from "../entities/content-item.entity";

export interface ContentWithPagination {
  items: ContentItemEntity[];
  total: number;
}

