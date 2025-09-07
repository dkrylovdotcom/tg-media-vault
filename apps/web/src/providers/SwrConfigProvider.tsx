import { useNavigate, NavigateFunction } from 'react-router-dom';
import React, { PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';
import { AxiosError, HttpStatusCode } from 'axios';
import { RoutePaths } from '../routing/route-paths.enum';

const handleError = (err: unknown, navigate: NavigateFunction): void => {
  console.error(err);

  if (
    err instanceof AxiosError &&
    err.response?.status === HttpStatusCode.NotFound
  ) {
    return navigate(RoutePaths.NOT_FOUND);
  }

  if (
    err instanceof AxiosError &&
    err.response?.status === HttpStatusCode.Forbidden
  ) {
    return navigate(RoutePaths.FORBIDDEN);
  }

  if (err instanceof AxiosError && err.code === 'ERR_NETWORK') {
    return navigate(RoutePaths.NETWORK_CONNECTION_ERROR);
  }
};

export const SWRConfigProvider = (
  props: PropsWithChildren,
): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <SWRConfig
      value={{
        revalidateOnMount: true,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
        onError: (error) => handleError(error, navigate),
      }}
    >
      {props.children}
    </SWRConfig>
  );
};
