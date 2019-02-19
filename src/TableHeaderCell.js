import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class TableHeaderCell extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    fixed: PropTypes.string,
    headTable: PropTypes.bool,
    useFixedHeader: PropTypes.bool,
    columnKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    component: PropTypes.any,
    cell: PropTypes.any,
  };

  static contextTypes = {
    table: PropTypes.any,
  };

  componentDidMount() {
    const { headTable, useFixedHeader, fixed } = this.props;
    if (useFixedHeader && !headTable && !fixed) {
      const { observer } = this.context.table;
      observer.observe(ReactDOM.findDOMNode(this));
    }
  }

  componentWillUnmount() {
    const { headTable, useFixedHeader, fixed } = this.props;
    if (useFixedHeader && headTable && !fixed) {
      const { observer } = this.context.table;
      observer.unobserve(ReactDOM.findDOMNode(this));
    }
  }

  render() {
    const { prefixCls, columnKey, useFixedHeader, headTable, component: HeaderCell } = this.props;
    const { column, ...cellProps } = this.props.cell;
    const customProps = column.onHeaderCell ? column.onHeaderCell(column) : {};
    if (column.align) {
      customProps.style = { ...customProps.style, textAlign: column.align };
      customProps.className = classNames(customProps.className, column.className, {
        [`${prefixCls}-align-${column.align}`]: !!column.align,
      });
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

    return (
      <HeaderCell {...cellProps} {...customProps} key={columnKey} data-column-key={columnKey} />
    );
  }
}
