import * as React from 'react';
import * as PropTypes from 'prop-types';
import TableHeaderRow from './TableHeaderRow';
import {
  ColumnType,
  Expander,
  Cell,
  InternalColumnType,
  FixedType,
  GetComponentProps,
} from './interface';

function getHeaderRows({
  columns = [],
  currentRow = 0,
  rows = [],
  isLast = true,
}: {
  columns?: InternalColumnType[];
  currentRow?: number;
  rows?: Cell[][];
  isLast?: boolean;
}) {
  // eslint-disable-next-line no-param-reassign
  rows[currentRow] = rows[currentRow] || [];

  columns.forEach((column, i) => {
    if (column.rowSpan && rows.length < column.rowSpan) {
      while (rows.length < column.rowSpan) {
        rows.push([]);
      }
    }
    const cellIsLast = isLast && i === columns.length - 1;
    const cell: Cell = {
      key: column.key,
      className: column.className || '',
      children: column.title,
      isLast: cellIsLast,
      column,
    };
    if (column.children) {
      getHeaderRows({
        columns: column.children,
        currentRow: currentRow + 1,
        rows,
        isLast: cellIsLast,
      });
    }
    if ('colSpan' in column) {
      cell.colSpan = column.colSpan;
    }
    if ('rowSpan' in column) {
      cell.rowSpan = column.rowSpan;
    }
    if (cell.colSpan !== 0) {
      rows[currentRow].push(cell);
    }
  });
  return rows.filter(row => row.length > 0);
}

export interface TableHeaderProps {
  fixed?: FixedType;
  columns: ColumnType[];
  expander: Expander;
  onHeaderRow?: GetComponentProps<ColumnType[]>;
}

export default class TableHeader extends React.PureComponent<TableHeaderProps> {
  static contextTypes = {
    table: PropTypes.any,
  };

  render() {
    const { components } = this.context.table;
    const { prefixCls, showHeader, onHeaderRow } = this.context.table.props;
    const { expander, columns, fixed } = this.props;

    if (!showHeader) {
      return null;
    }

    const rows = getHeaderRows({ columns });

    expander.renderExpandIndentCell(rows, fixed);

    const HeaderWrapper = components.header.wrapper;

    return (
      <HeaderWrapper className={`${prefixCls}-thead`}>
        {rows.map((row, index) => (
          <TableHeaderRow
            prefixCls={prefixCls}
            key={index}
            index={index}
            fixed={fixed}
            columns={columns}
            rows={rows}
            row={row}
            components={components}
            onHeaderRow={onHeaderRow}
          />
        ))}
      </HeaderWrapper>
    );
  }
}
