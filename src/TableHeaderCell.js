import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class TableHeaderCell extends React.Component {
  static contextTypes = {
    table: PropTypes.any,
  };

  componentDidMount() {
    const { headTable, useFixedHeader } = this.props;
    if (useFixedHeader && !headTable) {
      const { observer } = this.context.table;
      observer.observe(this.cellRef);
    }
  }

  componentWillUnmount() {
    const { headTable, useFixedHeader } = this.props;
    if (useFixedHeader && !headTable) {
      const { observer } = this.context.table;
      observer.unobserve(this.cellRef);
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
      <HeaderCell
        ref={node => (this.cellRef = node)}
        {...cellProps}
        {...customProps}
        key={columnKey}
        data-column-key={columnKey}
      />
    );
  }
}
