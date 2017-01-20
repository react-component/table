import React, { PropTypes } from 'react';
import shallowequal from 'shallowequal';

export default React.createClass({
  propTypes: {
    prefixCls: PropTypes.string,
    rowStyle: PropTypes.object,
    rows: PropTypes.array,
    headerCellClassName: PropTypes.func,
  },
  shouldComponentUpdate(nextProps) {
    return !shallowequal(nextProps, this.props);
  },
  render() {
    const { headerCellClassName, prefixCls, rowStyle, rows } = this.props;
    return (
      <thead className={`${prefixCls}-thead`}>
        {
          rows.map((row, index) => (
            <tr key={index} style={rowStyle}>
              {
                row.map((cellProps, i) => {
                  const thClassName = headerCellClassName(cellProps);
                  let className = cellProps.className;
                  className = thClassName ? `${className} ${thClassName}`.trim() : className;
                  cellProps.className = className;
                  return <th {...cellProps} key={i}/>;
                })
              }
            </tr>
          ))
        }
      </thead>
    );
  },
});
