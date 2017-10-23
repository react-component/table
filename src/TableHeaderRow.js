import React from 'react';
import { connect } from 'mini-store';

function TableHeaderRow({ row, height, components }) {
  const style = { height };

  let HeaderRow = 'tr';
  let HeaderCell = 'th';

  if (components.header) {
    HeaderRow = components.header.row || HeaderRow;
    HeaderCell = components.header.cell || HeaderCell;
  }

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
