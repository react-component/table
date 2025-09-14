import type * as React from 'react';
import Cell from './Cell';
import Row from './Row';

export interface SummaryProps {
  fixed?: boolean | 'top' | 'bottom';
}

/**
 * Syntactic sugar. Do not support HOC.
 */
const Summary: React.FC<React.PropsWithChildren<SummaryProps>> = ({ children }) => {
  return children as React.ReactElement<any>;
};

(Summary as any).Row = Row;
(Summary as any).Cell = Cell;

export default Summary;
