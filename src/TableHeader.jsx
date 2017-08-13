import React from 'react';
import PropTypes from 'prop-types';
import shallowequal from 'shallowequal';

export default class TableHeader extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    rowStyle: PropTypes.object,
    rows: PropTypes.array,
    headerAlign: PropTypes.string,
  }

  shouldComponentUpdate(nextProps) {
    return !shallowequal(nextProps, this.props);
  }

  render() {
    const { prefixCls, rowStyle, rows, headerAlign } = this.props;
    return (
      <thead className={`${prefixCls}-thead`} style={{ textAlign: headerAlign }}>
        {
          rows.map((row, index) => (
            <tr key={index} style={rowStyle}>
              {row.map((cellProps, i) => <th {...cellProps} key={i} />)}
            </tr>
          ))
        }
      </thead>
    );
  }
}
