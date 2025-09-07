import React, { useMemo, useRef, useState } from 'react';
import { Box, Container, styled, Typography } from '@mui/material';

import { GalleryModal } from './containers/GalleryModal';
import { Gallery } from './containers/Gallery';
import { ChannelsSwitcher } from './components/ChannelsSwitcher';
import { useContent } from '../../api/hooks/useContent';
import { Loader } from '../../components/Loader';
import { ContentItemEntity } from '../../api/entities/ContentItemEntity';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { useGalleryModalNavigation } from './hooks/useGalleryModalNavigation';

const EmptyContent = styled(Typography)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  textTransform: "uppercase",
  fontSize: "2em",
  fontWeight: "bold",
  width: "100%",
  height: "100%",
}));

export const IndexPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number>();
  const [clickedItemIndex, setClickedItemIndex] = useState(0);
  const { items: contentItems = [], loadMore, hasMore, isLoading: isContentLoading } = useContent();

  const users = useMemo(() => {
    const map = new Map<number, string>();
    contentItems.forEach((contentItem) => map.set(contentItem.userId, contentItem.getUsername()));
    return Array.from(map.entries());
  }, [contentItems]);

  const filteredItems = useMemo(() => {
    if (selectedUserId === void 0) {
      return contentItems;
    }

    return contentItems.filter((contentItem) => contentItem.userId === selectedUserId);
  }, [contentItems, selectedUserId]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useInfiniteScroll({
    loadMore,
    hasMore,
    isLoading: isContentLoading,
    itemsLength: filteredItems.length, // Use filtered items to respect current filter
  });

  const { handleNext, handlePrev } = useGalleryModalNavigation({
    itemsLength: filteredItems.length,
    currentIndex: clickedItemIndex,
    loadMore,
    hasMore,
    isLoading: isContentLoading,
    setIndex: setClickedItemIndex,
  });

  if (contentItems.length === 0) {
    return <EmptyContent>No content loaded yet</EmptyContent>
  }

  const handleOpen = (index: number) => {
    setClickedItemIndex(index);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const clickedItem: ContentItemEntity | undefined = filteredItems[clickedItemIndex];

  return (
    <Container>
      <ChannelsSwitcher users={users} selectedUserId={selectedUserId} setSelectedUser={setSelectedUserId}  />

      <Box ref={containerRef}>
        <Gallery items={filteredItems} handleOpen={handleOpen} />
        {isContentLoading && <Box mt={5}><Loader inline={true} /></Box>}
        <div ref={loaderRef} style={{ height: 1 }} />
      </Box>
      
      {clickedItem && <GalleryModal
        currentItem={clickedItem}
        isOpen={open}
        onClose={handleClose}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />}
    </Container>
  );
};
