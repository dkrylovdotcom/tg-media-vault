import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface Props {
  handlePrev: () => void;
  handleNext: () => void;
}

export const GaleryNavigation = (props: Props) => {
  const { handlePrev, handleNext } = props;

  return (
    <>
      <IconButton
        onClick={handlePrev}
        sx={{ position: "absolute", top: "50%", left: 16, transform: "translateY(-50%)", color: "white" }}
        aria-label="Prev"
      >
        <ArrowBackIosNewIcon fontSize="large" />
      </IconButton>
      <IconButton
        onClick={handleNext}
        sx={{ position: "absolute", top: "50%", right: 16, transform: "translateY(-50%)", color: "white" }}
        aria-label="Next"
      >
        <ArrowForwardIosIcon fontSize="large" />
      </IconButton>
    </>
  );
};
