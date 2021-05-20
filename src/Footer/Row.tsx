import * as React from 'react';
import Cell from './Cell';

export interface FooterRowProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const SummaryScrollIndexContext = React.createContext<number>(null);

export default function FooterRow({ children, ...props }: FooterRowProps) {
  const scrollColumnIndex = React.useContext(SummaryScrollIndexContext);

  return (
    <tr {...props}>
      {children}
      {scrollColumnIndex !== null && <Cell index={scrollColumnIndex} />}
    </tr>
  );
}
