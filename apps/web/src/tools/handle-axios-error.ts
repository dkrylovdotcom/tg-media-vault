import { AlertColor } from '@mui/material';
import axios from 'axios';
import { isArray } from 'class-validator';

const openErrorNotification = (
  showNotification: (message: string, severity?: AlertColor) => void,
  errorMessage?: string | string[],
): void => {
  if (!errorMessage) {
    return;
  }
  if (isArray(errorMessage)) {
    for (const message of errorMessage) {
      showNotification(message, 'error');
    }

    return;
  }

  showNotification(errorMessage, 'error');
};

export const handleAxiosError = (showNotification: (message: string, severity?: AlertColor) => void, err: unknown): void => {
  console.error(err);

  if (axios.isAxiosError(err)) {
    openErrorNotification(showNotification, err?.response?.data.message);
  } else {
    openErrorNotification(showNotification);
  }
};
