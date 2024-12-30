import { useContext } from '@rc-component/context';
import * as React from 'react';
import TableContext, { responseImmutable } from '../context/TableContext';
import devRenderTimes from '../hooks/useRenderTimes';
import type {
  CellType,
  ColumnsType,
  ColumnType,
  GetComponentProps,
  StickyOffsets,
} from '../interface';
import HeaderRow from './HeaderRow';

export interface HeaderProps<RecordType> {
  columns: ColumnsType<RecordType>;
  headCells: CellType<RecordType>[][];
  flattenColumns: readonly ColumnType<RecordType>[];
  stickyOffsets: StickyOffsets;
  onHeaderRow: GetComponentProps<readonly ColumnType<RecordType>[]>;
}

const Header = <RecordType extends any>(props: HeaderProps<RecordType>) => {
  if (process.env.NODE_ENV !== 'production') {
    devRenderTimes(props);
  }

  const { stickyOffsets, headCells, flattenColumns, onHeaderRow } = props;

  const { prefixCls, getComponent } = useContext(TableContext, ['prefixCls', 'getComponent']);
  const WrapperComponent = getComponent(['header', 'wrapper'], 'thead');
  const trComponent = getComponent(['header', 'row'], 'tr');
  const thComponent = getComponent(['header', 'cell'], 'th');

  return (
    <WrapperComponent className={`${prefixCls}-thead`}>
      {headCells.map((row, rowIndex) => {
        const rowNode = (
          <HeaderRow
            key={rowIndex}
            flattenColumns={flattenColumns}
            cells={row}
            stickyOffsets={stickyOffsets}
            rowComponent={trComponent}
            cellComponent={thComponent}
            onHeaderRow={onHeaderRow}
            index={rowIndex}
          />
        );
        return rowNode;
      })}
    </WrapperComponent>
  );
};

export default responseImmutable(Header);
