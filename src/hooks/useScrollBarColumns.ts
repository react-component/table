import * as React from 'react';
import { ColumnType } from '../interface';

interface IScrollBarColumns {
  columns: any;
  prefixCls: string;
  scrollbarSize: number;
  isSticky: boolean;
  fixHeader: boolean;
}

export default function useScrollBarColumns<T>({
  columns,
  prefixCls,
  scrollbarSize,
  isSticky,
  fixHeader,
}: IScrollBarColumns): {
  combinationScrollBarSize: number;
  columnsWithScrollbar: T;
} {
  const combinationScrollBarSize = isSticky && !fixHeader ? 0 : scrollbarSize;

  const lastColumn = columns[columns.length - 1];
  const ScrollBarColumn: ColumnType<unknown> = {
    fixed: lastColumn ? lastColumn.fixed : null,
    onHeaderCell: () => ({
      className: `${prefixCls}-cell-scrollbar`,
    }),
  };

  const columnsWithScrollbar = React.useMemo<T>(
    () => (combinationScrollBarSize ? [...columns, ScrollBarColumn] : columns),
    [combinationScrollBarSize, columns],
  );

  return {
    combinationScrollBarSize,
    columnsWithScrollbar,
  };
}
