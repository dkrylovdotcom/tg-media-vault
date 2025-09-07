import React from 'react';

interface Props {
  text?: string;
  name?: string;
}

export const ComponentError = (props: Props): React.JSX.Element => (
  <>{props.text || `Component ${props.name} can't be rendered`}</>
);

