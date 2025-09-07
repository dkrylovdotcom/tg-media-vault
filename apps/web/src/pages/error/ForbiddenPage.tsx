import React from 'react';
import { ErrorInfo } from './components/ErrorInfo';
import { Button } from '@mui/material';
import { generatePath } from 'react-router-dom';
import { RoutePaths } from '../../routing/route-paths.enum';

export const ForbiddenPage = (): React.JSX.Element => {
  return (
    <ErrorInfo
      name={'403'}
      title={'Access Forbidden'}
      description={'Oops! Access to the page you are looking for is forbidden.'}
      button={
        <Button variant={'contained'} href={generatePath(RoutePaths.INDEX_PAGE)}>
          Back Home
        </Button>
      }
    />
  );
}
