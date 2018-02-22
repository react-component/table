import React from "react";
import { connect } from "mini-store";

function TableFooterRow({ row, index, height, components, onFooterRow }) {
  const FooterRow = components.footer.row;
  const FooterCell = components.footer.cell;
  const rowProps = onFooterRow(row.map(cell => cell.column), index);
  const customStyle = rowProps ? rowProps.style : {};
  const style = { height, ...customStyle };

  return (
    <FooterRow {...rowProps} style={style}>
      {row.map((cell, i) => {
        const { column, ...cellProps } = cell;
        const customProps = column.onFooterCell
          ? column.onFooterCell(column)
          : {};
        if (column.align) {
          cellProps.style = { textAlign: column.align };
        }
        return (
          <FooterCell
            {...cellProps}
            {...customProps}
            key={column.key || column.dataIndex || i}
          />
        );
      })}
    </FooterRow>
  );
}

function getRowHeight(state, props) {
  const { fixedColumnsFootRowsHeight } = state;
  const { columns, rows } = props;
  const footerHeight = fixedColumnsFootRowsHeight[0];

  if (footerHeight && columns) {
    if (footerHeight === "auto") {
      return "auto";
    }
    return footerHeight / rows.length;
  }
  return null;
}

export default connect((state, props) => {
  return {
    height: getRowHeight(state, props)
  };
})(TableFooterRow);
