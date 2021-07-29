import * as React from 'react';

export interface FooterRowProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function FooterRow({ children, ...props }: FooterRowProps) {
  return <tr {...props}>{children}</tr>;
}
