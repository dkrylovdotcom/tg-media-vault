import React from 'react';
import { Card, CardContent, Typography, Stack, Box } from '@mui/material';

interface Props {
  name: string;
  title: string;
  description: string;
  button: React.JSX.Element;
}

export const ErrorInfo = ({ name, title, description, button }: Props): React.JSX.Element => {
  return (
    <Card variant="outlined" sx={{ maxWidth: 480, mx: "auto" }}>
      <CardContent>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Typography variant="h6" color="text.secondary">
            {name}
          </Typography>

          <Typography variant="h5" component="div" fontWeight="bold">
            {title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>

          <Box mt={2}>
            {button}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
