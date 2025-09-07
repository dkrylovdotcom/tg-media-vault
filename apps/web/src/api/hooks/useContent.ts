import useSWRInfinite from 'swr/infinite';
import { plainToInstance } from 'class-transformer';
import { useAxios } from './useAxios.ts';
import { ContentItemEntity } from '../entities/ContentItemEntity.ts';
import { ContentWithPagination } from '../interfaces/content-with-pagination.interface.ts';
import { DEFAULT_PAGE_ITEMS_COUNT } from '../../consts.ts';

export const useContent = (pageSize: number = DEFAULT_PAGE_ITEMS_COUNT) => {
  const axios = useAxios();
  const fetcher = (url: string) => axios.get<ContentWithPagination>(url).then(({ data }) => data);

  const getKey = (pageIndex: number, previousPageData: any) => {
    // NOTE:: If no data, then finish
    if (previousPageData && !previousPageData.items.length) {
      return null;
    }

    return `content?page=${pageIndex + 1}&limit=${pageSize}`;
  };

  const { data, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
  });

  // Merge all pages
  const items = data ? data.flatMap(page => page.items) : [];

  return {
    items: plainToInstance(ContentItemEntity, items),
    isLoading: !data && isValidating,
    loadMore: () => setSize(size + 1),
    hasMore: data ? data[data.length - 1]?.items.length === pageSize : false,
  };
}

