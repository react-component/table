import React from 'react';
import PropTypes from 'prop-types';
import TableHeaderRow from './TableHeaderRow';

function getHeaderRows(columns, currentRow = 0, rows) {
  rows = rows || [];
  rows[currentRow] = rows[currentRow] || [];

  columns.forEach(column => {
    if (column.rowSpan && rows.length < column.rowSpan) {
      while (rows.length < column.rowSpan) {
        rows.push([]);
      }
    }
    const cell = {
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

export default function TableHeader(props, { table }) {
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

TableHeader.propTypes = {
  fixed: PropTypes.string,
  columns: PropTypes.array.isRequired,
  expander: PropTypes.object.isRequired,
  onHeaderRow: PropTypes.func,
};

TableHeader.contextTypes = {
  table: PropTypes.any,
};
