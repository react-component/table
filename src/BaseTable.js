import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'mini-store';
import ColGroup from './ColGroup';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import ExpandableRow from './ExpandableRow';
import ExpandedRowHeigh from './ExpandedRowHeigh';

class BaseTable extends React.Component {
  static propTypes = {
    fixed: PropTypes.string,
    columns: PropTypes.array.isRequired,
    tableClassName: PropTypes.string.isRequired,
    hasHead: PropTypes.bool.isRequired,
    hasBody: PropTypes.bool.isRequired,
  }

  static contextTypes = {
    table: PropTypes.any,
  }

  handleRowHover = (isHover, key) => {
    this.props.store.setState({
      currentHoverKey: isHover ? key : null,
    });
  }

  renderRows = (renderData, indent, ancestorKeys = []) => {
    const { table } = this.context;
    const {
      columnManager,
      getRowKey,
      onExpanded,
    } = table;
    const {
      prefixCls,
      data,
      childrenColumnName,
      rowClassName,
      rowRef,
      onRowClick,
      onRowDoubleClick,
      onRowContextMenu,
      onRowMouseEnter,
      onRowMouseLeave,
    } = table.props;
    const { columns, fixed, expander } = this.props;

    let rows = [];

    for (let i = 0; i < renderData.length; i++) {
      const record = renderData[i];
      const key = getRowKey(record, i);
      const childrenData = record[childrenColumnName];
      const className = typeof rowClassName === 'string'
        ? rowClassName
        : rowClassName(record, i, indent);

      const onHoverProps = {};
      if (columnManager.isAnyColumnsFixed()) {
        onHoverProps.onHover = this.handleRowHover;
      }

      let leafColumns;
      if (fixed === 'left') {
        leafColumns = columnManager.leftLeafColumns();
      } else if (fixed === 'right') {
        leafColumns = columnManager.rightLeafColumns();
      } else {
        leafColumns = columnManager.leafColumns();
      }

      const rowPrefixCls = `${prefixCls}-row`;

      const row = (
        <ExpandableRow
          {...expander.props}
          fixed={fixed}
          index={i}
          prefixCls={rowPrefixCls}
          record={record}
          key={key}
          rowKey={key}
          onRowClick={onRowClick}
          needIndentSpaced={expander.needIndentSpaced}
          onExpandedChange={expander.handleExpandChange}
        >
          {( expandableRow ) => (
            <ExpandedRowHeigh
              rowKey={key}
              fixed={fixed}
              index={i}
            >
              {({ height }) => (
                <TableRow
                  fixed={fixed}
                  indent={indent}
                  className={className}
                  record={record}
                  index={i}
                  prefixCls={rowPrefixCls}
                  childrenColumnName={childrenColumnName}
                  columns={leafColumns}
                  onRowDoubleClick={onRowDoubleClick}
                  onRowContextMenu={onRowContextMenu}
                  onRowMouseEnter={onRowMouseEnter}
                  onRowMouseLeave={onRowMouseLeave}
                  {...onHoverProps}
                  hoverKey={key}
                  rowKey={key}
                  ancestorKeys={ancestorKeys}
                  ref={rowRef(record, i, indent)}
                  height={height}
                  {...expandableRow}
                />
              )}
            </ExpandedRowHeigh>
          )}
        </ExpandableRow>
      );

      rows.push(row);

      const expandedRows = expander.renderRows(
        this.renderRows,
        record,
        i,
        indent,
        fixed,
        key,
        ancestorKeys
      );

      if (expandedRows) {
        rows.push(...expandedRows);
      }
    }
    return rows;
  }

  render() {
    const { prefixCls, scroll, data, getBodyWrapper } = this.context.table.props;
    const { expander, tableClassName, hasHead, hasBody, fixed, columns } = this.props;
    const tableStyle = {};

    if (!fixed && scroll.x) {
      // not set width, then use content fixed width
      if (scroll.x === true) {
        tableStyle.tableLayout = 'fixed';
      } else {
        tableStyle.width = scroll.x;
      }
    }

    return (
      <table className={tableClassName} style={tableStyle} key="table">
        <ColGroup columns={columns} fixed={fixed} />
        {hasHead && <TableHeader expander={expander} columns={columns} fixed={fixed} /> }
        {hasBody && getBodyWrapper(
          <tbody className={`${prefixCls}-tbody`}>
            {this.renderRows(data, 0)}
          </tbody>
        )}
      </table>
    );
  }
}

export default connect()(BaseTable);
