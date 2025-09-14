import * as React from 'react';

export interface FooterRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string;
  style?: React.CSSProperties;
}

const FooterRow: React.FC<React.PropsWithChildren<FooterRowProps>> = props => {
  const { children, ...restProps } = props;
  return <tr {...restProps}>{children}</tr>;
};

export default FooterRow;
