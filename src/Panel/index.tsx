import * as React from 'react';

export interface TitleProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  style?: React.CSSProperties;
}

const Panel: React.FC<React.PropsWithChildren<TitleProps>> = props => {
  const { children, ...restProps } = props;
  return <div {...restProps}>{children}</div>;
};

export default Panel;
