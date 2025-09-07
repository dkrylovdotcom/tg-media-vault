import { Button } from '@mui/material';
import React from 'react';
import { ErrorInfo } from './components/ErrorInfo';
import { generatePath } from 'react-router-dom';
import { RoutePaths } from '../../routing/route-paths.enum';

export const NotFoundPage = (): React.JSX.Element => {
  return (
    <ErrorInfo
      name={'404'}
      title={'Page not found'}
      description={
        'Oops! The page you are looking for does not exist. It might have been oved or deleted.'
      }
      button={
        <Button variant={'contained'} href={generatePath(RoutePaths.INDEX_PAGE)}>
          Back Home
        </Button>
      }
    />
  );
};
