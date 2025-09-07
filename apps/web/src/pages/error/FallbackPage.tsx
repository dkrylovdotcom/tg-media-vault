import React from 'react';
import type { FallbackProps } from 'react-error-boundary';

export const FallbackPage = (props: FallbackProps): React.JSX.Element => {
  const { error } = props;

  return (
    <div>
      <span>
        Oops! Something went wrong. {error.message}
      </span>
    </div>
  );
}
