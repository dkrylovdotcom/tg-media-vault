import React from 'react';
import { generatePath } from 'react-router-dom';
import { ErrorInfo } from './components/ErrorInfo';
import { Button } from '@mui/material';
import { RoutePaths } from '../../routing/route-paths.enum';

export const NetworkConnectionErrorPage = (): React.JSX.Element => {
  return (
    <ErrorInfo
      name={'503'}
      title={'Server Connection Error'}
      description={
        "Oops! Couldn't request the server. Please, try again later."
      }
      button={
        <Button variant={'contained'} href={generatePath(RoutePaths.INDEX_PAGE)}>
          Back Home
        </Button>
      }
    />
  );
};
