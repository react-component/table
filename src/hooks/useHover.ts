import * as React from 'react';

export type OnHover = (start: number, end: number) => void;

export default function useHover(): [startRow: number, endRow: number, onHover: OnHover] {
  const [startRow, setStartRow] = React.useState(-1);
  const [endRow, setEndRow] = React.useState(-1);

  const onHover = React.useCallback<OnHover>((start, end) => {
    setStartRow(start);
    setEndRow(end);
  }, []);

  return [startRow, endRow, onHover];
}
