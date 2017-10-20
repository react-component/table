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
  const { prefixCls, showHeader } = table.props;
  const { expander, columns, fixed } = props;

  if (!showHeader) {
    return null;
  }

  const rows = getHeaderRows(columns);

  expander.renderExpandIndentCell(rows, fixed);

  return (
    <thead className={`${prefixCls}-thead`}>
      {
        rows.map((row, index) => (
          <TableHeaderRow
            key={index}
            fixed={fixed}
            columns={columns}
            rows={rows}
            row={row}
          />
        ))
      }
    </thead>
  );
}

TableHeader.propTypes = {
  fixed: PropTypes.string,
  columns: PropTypes.array.isRequired,
};

TableHeader.contextTypes = {
  table: PropTypes.any,
};
