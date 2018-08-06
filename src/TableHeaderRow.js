import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'mini-store';

function TableHeaderRow({
  row,
  index,
  height,
  components,
  onHeaderRow,
  useFixedHeader,
  headTable,
}) {
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
        if (useFixedHeader && !headTable) {
          cellProps.children = <div style={{ height: 0, opacity: 0 }}>{cellProps.children}</div>;
          customProps.style = {
            ...customProps.style,
            paddingTop: 0,
            paddingBottom: 0,
            border: 'none',
          };
        }
        const columnKey = column.key || column.dataIndex || i;
        return (
          <HeaderCell {...cellProps} {...customProps} key={columnKey} data-column-key={columnKey} />
        );
      })}
    </HeaderRow>
  );
}

TableHeaderRow.propTypes = {
  row: PropTypes.array,
  index: PropTypes.number,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  components: PropTypes.any,
  onHeaderRow: PropTypes.func,
  headTable: PropTypes.bool,
  useFixedHeader: PropTypes.bool,
};

function getRowHeight(state, props) {
  const { fixedColumnsHeadRowsHeight } = state;
  const { columns, rows, fixed, useFixedHeader, headTable } = props;
  const headerHeight = fixedColumnsHeadRowsHeight[0];

  if (!fixed || (useFixedHeader && !headTable)) {
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

export default connect((state, props) => {
  return {
    height: getRowHeight(state, props),
  };
})(TableHeaderRow);
