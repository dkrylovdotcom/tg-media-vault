import { useEffect, useRef } from 'react';

interface Props {
  loadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  itemsLength: number;
  containerRef?: React.RefObject<HTMLElement>; // optional container for ResizeObserver
}

export const useInfiniteScroll = ({
  loadMore,
  hasMore,
  isLoading,
  itemsLength,
  containerRef,
}: Props) => {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loaderRef.current || !hasMore || itemsLength === 0) return;

    let timeoutId: number | null = null;
    let didInitialRender = false;

    // IntersectionObserver callback triggers when loader enters viewport
    const observer = new IntersectionObserver(
      (entries, obs) => {
        const entry = entries[0];

        if (entry.isIntersecting && !isLoading) {
          if (!didInitialRender) {
            // Skip first trigger after initial render
            didInitialRender = true;
            return;
          }

          if (timeoutId) clearTimeout(timeoutId);

          // Debounce loadMore call
          timeoutId = window.setTimeout(() => {
            loadMore();
            obs.unobserve(entry.target); // Stop observing until next render
          }, 500);
        }
      },
      {
        rootMargin: '200px', // Trigger slightly before reaching loader
        threshold: 0.1,      // Trigger when at least 10% of loader is visible
      }
    );

    observer.observe(loaderRef.current);

    // Optional: handle dynamic container height changes
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef?.current) {
      resizeObserver = new ResizeObserver(() => {
        // Re-observe the loader after container resize
        if (loaderRef.current) observer.observe(loaderRef.current);
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [loadMore, hasMore, isLoading, itemsLength, containerRef]);

  return loaderRef;
};
