import React from 'react';
import PropTypes from 'prop-types';

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

function getHeaderRowStyle(columns, rows, fixedColumnsHeadRowsHeight) {
  const headerHeight = fixedColumnsHeadRowsHeight[0];
  if (headerHeight && columns) {
    if (headerHeight === 'auto') {
      return { height: 'auto' };
    }
    return { height: headerHeight / rows.length };
  }
  return null;
}

export default function TableHeader(props, { table }) {
  const { fixedColumnsHeadRowsHeight } = table.state;
  const { prefixCls, showHeader, expandIconAsCell } = table.props;
  const { columns, fixed } = props;

  if (!showHeader) {
    return null;
  }

  const rows = getHeaderRows(columns);

  if (expandIconAsCell && fixed !== 'right') {
    rows[0].unshift({
      key: 'rc-table-expandIconAsCell',
      className: `${prefixCls}-expand-icon-th`,
      title: '',
      rowSpan: rows.length,
    });
  }

  const trStyle = fixed ? getHeaderRowStyle(columns, rows, fixedColumnsHeadRowsHeight) : null;

  return (
    <thead className={`${prefixCls}-thead`}>
      {
        rows.map((row, index) => (
          <tr key={index} style={trStyle}>
            {row.map((cellProps, i) => <th {...cellProps} key={i} />)}
          </tr>
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
