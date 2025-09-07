import 'reflect-metadata';

import * as React from 'react';
import { MainContent } from './containers/MainContent';
import { Routes } from './routing/routes';
import { SWRConfigProvider } from './providers/SwrConfigProvider';
import { BrowserRouter } from 'react-router-dom';

export const App = (): React.JSX.Element => {
  return (
    <BrowserRouter>
      <SWRConfigProvider>
        <MainContent routesList={Routes} />
      </SWRConfigProvider>
    </BrowserRouter>
  );
};
