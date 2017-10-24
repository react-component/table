import React from 'react';
import { connect } from 'mini-store';

function TableHeaderRow({ row, height, components }) {
  const style = { height };
  const HeaderRow = components.header.row;
  const HeaderCell = components.header.cell;

  return (
    <HeaderRow style={style}>
      {row.map((cell, i) => <HeaderCell {...cell} key={i} />)}
    </HeaderRow>
  );
}

function getRowHeight(state, props) {
  const { fixedColumnsHeadRowsHeight } = state;
  const { columns, rows } = props;
  const headerHeight = fixedColumnsHeadRowsHeight[0];

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
