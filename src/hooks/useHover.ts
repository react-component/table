import * as React from 'react';

export type OnHover = (start: number, end: number) => void;

export default function useHover(): [
  startRow: number,
  endRow: number,
  startCol: number,
  endCol: number,
  onRowHover: OnHover,
  onColHover: OnHover,
] {
  const [startRow, setStartRow] = React.useState(-1);
  const [endRow, setEndRow] = React.useState(-1);
  const [startCol, setStartCol] = React.useState(-1);
  const [endCol, setEndCol] = React.useState(-1);

  const onRowHover = React.useCallback<OnHover>((start, end) => {
    setStartRow(start);
    setEndRow(end);
  }, []);

  const onColHover = React.useCallback<OnHover>((start, end) => {
    setStartCol(start);
    setEndCol(end);
  }, []);

  return [startRow, endRow, startCol, endCol, onRowHover, onColHover];
}
