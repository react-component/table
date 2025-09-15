import * as React from 'react';

export interface FooterRowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLTableRowElement>;
}

const FooterRow: React.FC<React.PropsWithChildren<FooterRowProps>> = props => {
  const { children, ...restProps } = props;
  return <tr {...restProps}>{children}</tr>;
};

export default FooterRow;
