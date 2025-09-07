import { ContentItemEntity } from "../entities/ContentItemEntity";

export interface ContentWithPagination {
  items: ContentItemEntity[];
  total: number;
}
