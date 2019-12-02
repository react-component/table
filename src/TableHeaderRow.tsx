import * as React from 'react';
import { connect } from 'mini-store';
import classNames from 'classnames';
import {
  TableComponents,
  GetComponentProps,
  ColumnType,
  Cell,
  TableStoreState,
  FixedType,
} from './interface';

export interface TableHeaderRowProps {
  row: Cell[];
  index: number;
  height: string | number;
  components: TableComponents;
  onHeaderRow: GetComponentProps<ColumnType[]>;
  prefixCls: string;
  columns: ColumnType[];
  rows: Cell[];
  fixed: FixedType;
}

function TableHeaderRow({
  row,
  index,
  height,
  components,
  onHeaderRow,
  prefixCls,
}: TableHeaderRowProps) {
  const HeaderRow = components.header.row;
  const HeaderCell = components.header.cell;
  const rowProps = onHeaderRow(row.map(cell => cell.column), index);
  const customStyle = rowProps ? rowProps.style : {};
  const style = { height, ...customStyle };

  return (
    <HeaderRow {...rowProps} style={style}>
      {row.map((cell, i) => {
        const { column, ...cellProps } = cell;
        const customProps = column.onHeaderCell ? column.onHeaderCell(column) : {};
        if (column.align) {
          customProps.style = { ...customProps.style, textAlign: column.align };
        }
        customProps.className = classNames(customProps.className, column.className, {
          [`${prefixCls}-align-${column.align}`]: !!column.align,
          [`${prefixCls}-row-cell-ellipsis`]: !!column.ellipsis,
          [`${prefixCls}-row-cell-break-word`]: !!column.width,
          [`${prefixCls}-row-cell-last`]: i === row.length - 1,
        });
        return (
          <HeaderCell {...cellProps} {...customProps} key={column.key || column.dataIndex || i} />
        );
      })}
    </HeaderRow>
  );
}

function getRowHeight(state: TableStoreState, props: TableHeaderRowProps) {
  const { fixedColumnsHeadRowsHeight } = state;
  const { columns, rows, fixed } = props;
  const headerHeight = fixedColumnsHeadRowsHeight[0];

  if (!fixed) {
    return null;
  }

  if (headerHeight && columns) {
    if (headerHeight === 'auto') {
      return 'auto';
    }
    return headerHeight / rows.length;
  }
  return null;
}

export default connect((state: TableStoreState, props: TableHeaderRowProps) => ({
  height: getRowHeight(state, props),
}))(TableHeaderRow);
