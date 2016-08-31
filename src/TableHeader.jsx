import React, { PropTypes } from 'react';
import shallowequal from 'shallowequal';

export default React.createClass({
  propTypes: {
    columns: PropTypes.array,
    prefixCls: PropTypes.string,
    rowStyle: PropTypes.object,
    rows: PropTypes.array,
  },
  shouldComponentUpdate(nextProps) {
    return !shallowequal(nextProps, this.props);
  },
  render() {
    const { prefixCls, columns, rowStyle, rows } = this.props;
    return (
      <thead className={`${prefixCls}-thead`}>
        {
          rows.map((row, i) => (
            <tr key={i} style={rowStyle}>
              {row.map(cellProps => <th {...cellProps} />)}
            </tr>
          ))
        }
      </thead>
    );
  },
});
