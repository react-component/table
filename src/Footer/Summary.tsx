import * as React from 'react';
import Cell from './Cell';
import Row from './Row';
import type { ColumnType, StickyOffsets } from '../interface';

type FlattenColumns<RecordType> = readonly (ColumnType<RecordType> & { scrollbar?: boolean })[];

export const SummaryContext = React.createContext<{
  stickyOffsets?: StickyOffsets;
  scrollColumnIndex?: number;
  flattenColumns?: FlattenColumns<any>;
}>({});

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
