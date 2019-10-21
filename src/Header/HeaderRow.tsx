import React from 'react';
import ResizeObserver from 'rc-resize-observer';
import Cell from '../Cell';
import { CellType } from '../interface';
import ResizeContext from '../context/ResizeContext';

export interface RowProps<RecordType> {
  cells: CellType<RecordType>[];
  index: number;
  fixedTop: number | false;
}

function HeaderRow<RecordType>({ cells, index, fixedTop }: RowProps<RecordType>) {
  const { onRowResize } = React.useContext(ResizeContext);

  const onResize = ({ height }) => {
    onRowResize(index, height);
  };

  return (
    <ResizeObserver onResize={onResize} disabled={fixedTop === false}>
      <tr>
        {cells.map((cell, cellIndex) => (
          <Cell {...cell} fixedTop={fixedTop} key={cellIndex} />
        ))}
      </tr>
    </ResizeObserver>
  );
}

HeaderRow.displayName = 'HeaderRow';

export default HeaderRow;
