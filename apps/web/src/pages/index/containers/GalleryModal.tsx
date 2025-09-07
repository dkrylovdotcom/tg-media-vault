import { Box, Dialog, IconButton, Typography } from '@mui/material';

import CloseIcon from "@mui/icons-material/Close";
import { ContentItemEntity } from '../../../api/entities/ContentItemEntity';
import { API_URL } from '../../../consts';
import { GaleryNavigation } from '../components/GaleryNavigation';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

interface Props {
  currentItem: ContentItemEntity;
  isOpen: boolean;
  onClose: () => void;
  handlePrev: () => void;
  handleNext: () => void;
}

export const GalleryModal = (props: Props) => {
  const { currentItem, isOpen, onClose, handlePrev, handleNext } = props;
  const fileUrl = new URL(currentItem.filePath, API_URL);

  // NOTE:: Ability to trigger next/prev by keyboard left/right buttons
  useKeyboardNavigation({
    active: isOpen,
    onLeft: handlePrev,
    onRight: handleNext,
    onEscape: onClose,
  });

  return (
    <Dialog fullScreen open={isOpen} onClose={onClose}>
      <Box sx={{ position: "relative", height: "100vh", bgcolor: "black" }}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 16, right: 16, zIndex: 2, color: "white" }}
          aria-label="Close"
        >
          <CloseIcon fontSize="large" />
        </IconButton>

        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 4,
          }}
        >
          {currentItem.isImage() ? (
            <img
              src={fileUrl.toString()}
              alt={currentItem.getTitle()}
              style={{ maxHeight: "90vh", maxWidth: "100%", objectFit: "contain" }} />
          ) : (
            <video
              src={fileUrl.toString()}
              controls
              autoPlay
              style={{ maxHeight: "90vh", maxWidth: "100%" }} />
          )}
        </Box>

        <GaleryNavigation handleNext={handleNext} handlePrev={handlePrev} />

        <Typography
          variant="h6"
          sx={{ position: "absolute", bottom: 24, left: 24, color: "white", fontWeight: 500 }}
        >
          {currentItem.getTitle()}
        </Typography>
      </Box>
    </Dialog>
  );
};
