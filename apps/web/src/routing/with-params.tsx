import { useNavigate, useParams } from 'react-router-dom';
import React, { ComponentType } from 'react';
import { RoutePaths } from './route-paths.enum';

interface WithTenantProps<TParams extends string> {
  WrappedComponent: ComponentType<Readonly<Record<TParams, string>>>;
  requiredParams: TParams[];
}

export function WithParams<TParams extends string>(
  props: WithTenantProps<TParams>,
): React.JSX.Element | null {
  const params = useParams<Record<TParams, string>>();
  const navigate = useNavigate();
  const { WrappedComponent, requiredParams } = props;

  if (!allParamsAreDefined(params, requiredParams)) {
    navigate(RoutePaths.INDEX_PAGE);

    return null;
  }

  return <WrappedComponent {...params} />;
}

function allParamsAreDefined<TParams extends string>(
  params: Readonly<Partial<Record<TParams, string>>>,
  requiredParams: TParams[],
): params is Readonly<Record<TParams, string>> {
  return requiredParams.every((paramName) => paramName in params);
}
