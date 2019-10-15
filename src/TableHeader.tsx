import React from 'react';
import PropTypes from 'prop-types';
import TableHeaderRow from './TableHeaderRow';
import { Column, Expander, Cell, InternalColumn, FixedType, OnHeaderRow } from './interface';

function getHeaderRows(columns: InternalColumn[], currentRow = 0, rows: Cell[][] = []) {
  // eslint-disable-next-line no-param-reassign
  rows[currentRow] = rows[currentRow] || [];

  columns.forEach(column => {
    if (column.rowSpan && rows.length < column.rowSpan) {
      while (rows.length < column.rowSpan) {
        rows.push([]);
      }
    }
    const cell: Cell = {
      key: column.key,
      className: column.className || '',
      children: column.title,
      column,
    };
    if (column.children) {
      getHeaderRows(column.children, currentRow + 1, rows);
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
  columns: Column[];
  expander: Expander;
  onHeaderRow?: OnHeaderRow;
}

const TableHeader: React.FC<TableHeaderProps> = (props, { table }) => {
  const { components } = table;
  const { prefixCls, showHeader, onHeaderRow } = table.props;
  const { expander, columns, fixed } = props;

  if (!showHeader) {
    return null;
  }

  const rows = getHeaderRows(columns);

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
};

TableHeader.contextTypes = {
  table: PropTypes.any,
};

export default TableHeader;
