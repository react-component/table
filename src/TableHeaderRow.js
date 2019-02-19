import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'mini-store';
import TableHeaderCell from './TableHeaderCell';

class TableHeaderRow extends React.Component {
  static propTypes = {
    row: PropTypes.array,
    index: PropTypes.number,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    components: PropTypes.any,
    onHeaderRow: PropTypes.func,
    headTable: PropTypes.bool,
    useFixedHeader: PropTypes.bool,
  };

  static contextTypes = {
    table: PropTypes.any,
  };

  componentDidMount() {
    const { fixed } = this.props;
    if (!fixed) {
      const { observer } = this.context.table;
      observer.observe(this.rowRef);
    }
  }

  componentWillUnmount() {
    const { fixed } = this.props;
    if (!fixed) {
      const { observer } = this.context.table;
      observer.unobserve(this.rowRef);
    }
  }

  render() {
    const {
      row,
      index,
      height,
      components,
      onHeaderRow,
      prefixCls,
      useFixedHeader,
      headTable,
    } = this.props;
    const HeaderRow = components.header.row;
    const HeaderCell = components.header.cell;
    const rowProps = onHeaderRow(row.map(cell => cell.column), index);
    const customStyle = rowProps ? rowProps.style : {};
    const style = { height, ...customStyle };

    return (
      <HeaderRow
        ref={node => (this.rowRef = node)}
        {...rowProps}
        style={style}
        data-header-row-index={index}
      >
        {row.map((cell, i) => {
          const { column } = cell;
          const columnKey = column.key || column.dataIndex || i;
          return (
            <TableHeaderCell
              key={columnKey}
              prefixCls={prefixCls}
              component={HeaderCell}
              cell={cell}
              columnKey={columnKey}
              headTable={headTable}
              useFixedHeader={useFixedHeader}
            />
          );
        })}
      </HeaderRow>
    );
  }
}

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
