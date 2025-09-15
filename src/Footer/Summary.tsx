import type * as React from 'react';
import Cell from './Cell';
import Row from './Row';

export interface SummaryProps {
  fixed?: boolean | 'top' | 'bottom';
}

/**
 * Syntactic sugar. Do not support HOC.
 */
const Summary: React.FC<React.PropsWithChildren<SummaryProps>> & {
  Row: typeof Row;
  Cell: typeof Cell;
} = props => {
  const { children } = props;
  return children;
};

Summary.Row = Row;
Summary.Cell = Cell;

export default Summary;
