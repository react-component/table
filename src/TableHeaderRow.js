import React from 'react';
import { connect } from 'mini-store';

function TableHeaderRow({ row, height }) {
  const style = { height };

  return (
    <tr style={style}>
      {row.map((cell, i) => <th {...cell} key={i} />)}
    </tr>
  );
}

function getRowHeight(state, props) {
  const { fixedColumnsHeadRowsHeight } = state;
  const { fixed, columns, rows } = props;
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
  }
})(TableHeaderRow);
