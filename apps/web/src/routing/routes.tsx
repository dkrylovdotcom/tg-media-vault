import { RouteObject } from 'react-router-dom';
import { RoutePaths } from './route-paths.enum.ts';
import { ForbiddenPage } from '../pages/error/ForbiddenPage.tsx';
import { NetworkConnectionErrorPage } from '../pages/error/NetworkConnectionErrorPage.tsx';
import { NotFoundPage } from '../pages/error/NotFoundPage.tsx';
import { IndexPage } from '../pages/index/IndexPage.tsx';

export const Routes: RouteObject[] = [
  {
    path: RoutePaths.INDEX_PAGE,
    element: <IndexPage />,
  },
  {
    path: RoutePaths.NETWORK_CONNECTION_ERROR,
    element: <NetworkConnectionErrorPage />,
  },
  {
    path: RoutePaths.NOT_FOUND,
    element: <NotFoundPage />,
  },
  {
    path: RoutePaths.FORBIDDEN,
    element: <ForbiddenPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
