import { Backdrop, Box, CircularProgress } from "@mui/material";

interface Props {
  inline?: boolean;
}

export const Loader = (props: Props) => {
  if (props.inline) {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={2}>
        <CircularProgress color="inherit" /> Loading...
      </Box>
    );
  }

  return (
    <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
