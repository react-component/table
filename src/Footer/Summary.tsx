import type * as React from 'react';
import Cell from './Cell';
import Row from './Row';

export interface SummaryProps {
  fixed?: boolean | 'top' | 'bottom';
  children?: React.ReactNode;
}

/**
 * Syntactic sugar. Do not support HOC.
 */
function Summary({ children }: SummaryProps) {
  return children as React.ReactElement;
}

Summary.Row = Row;
Summary.Cell = Cell;

export default Summary;
