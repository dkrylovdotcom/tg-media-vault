import { useCallback } from 'react';
import { Dispatch, SetStateAction } from 'react';

export const useGalleryModalNavigation = ({
  itemsLength,
  currentIndex,
  loadMore,
  hasMore,
  isLoading,
  setIndex,
}: {
  itemsLength: number;
  currentIndex: number;
  loadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  setIndex: Dispatch<SetStateAction<number>>;
}) => {
  const handleNext = useCallback(() => {
    const isLast = currentIndex === itemsLength - 1;

    if (isLast && hasMore && !isLoading) {
      loadMore();
    }

    setIndex((prev) => (prev + 1) % itemsLength);
  }, [currentIndex, itemsLength, loadMore, hasMore, isLoading, setIndex]);

  const handlePrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + itemsLength) % itemsLength);
  }, [itemsLength, setIndex]);

  return { handleNext, handlePrev };
};
