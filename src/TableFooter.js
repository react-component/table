import React from "react";
import PropTypes from "prop-types";
import TableFooterRow from "./TableFooterRow";

function getFooterRows(columns, currentRow = 0, rows) {
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
      className: column.className || "",
      children: column.title,
      column
    };
    if (column.children) {
      getFooterRows(column.children, currentRow + 1, rows);
    }
    if ("colSpan" in column) {
      cell.colSpan = column.colSpan;
    }
    if ("rowSpan" in column) {
      cell.rowSpan = column.rowSpan;
    }
    if (cell.colSpan !== 0) {
      rows[currentRow].push(cell);
    }
  });
  return rows.filter(row => row.length > 0);
}

export default function TableFooter(props, { table }) {
  const { components } = table;
  const { prefixCls, showFooter, onFooterRow } = table.props;
  const { expander, columns, fixed } = props;

  if (!showFooter) {
    return null;
  }

  const rows = getFooterRows(columns);

  expander.renderExpandIndentCell(rows, fixed);

  const FooterWrapper = components.footer.wrapper;

  return (
    <FooterWrapper className={`${prefixCls}-tfoot`}>
      {rows.map((row, index) => (
        <TableFooterRow
          key={index}
          index={index}
          fixed={fixed}
          columns={columns}
          rows={rows}
          row={row}
          components={components}
          onFooterRow={onFooterRow}
        />
      ))}
    </FooterWrapper>
  );
}

TableFooter.propTypes = {
  fixed: PropTypes.string,
  columns: PropTypes.array.isRequired,
  expander: PropTypes.object.isRequired,
  onFooterRow: PropTypes.func
};

TableFooter.contextTypes = {
  table: PropTypes.any
};
