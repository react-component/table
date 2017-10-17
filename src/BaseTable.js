import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'mini-store';
import ColGroup from './ColGroup';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import ExpandableRow from './ExpandableRow';

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

  renderRows = (renderData, indent, parentKey) => {
    const { table } = this.context;
    const { fixedColumnsBodyRowsHeight } = table.state;
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

      const height = (fixed && fixedColumnsBodyRowsHeight[i]) ?
        fixedColumnsBodyRowsHeight[i] : null;

      let leafColumns;
      if (fixed === 'left') {
        leafColumns = columnManager.leftLeafColumns();
      } else if (fixed === 'right') {
        leafColumns = columnManager.rightLeafColumns();
      } else {
        leafColumns = columnManager.leafColumns();
      }

      const row = (
        <ExpandableRow
          {...expander.props}
          index={i}
          record={record}
          key={key}
          rowKey={key}
          parentKey={key}
          onRowClick={onRowClick}
          needIndentSpaced={expander.needIndentSpaced}
          onExpandedChange={expander.handleExpandChange}
        >
          {( expandableRow ) => (
            <TableRow
              indent={indent}
              className={className}
              record={record}
              index={i}
              prefixCls={`${prefixCls}-row`}
              childrenColumnName={childrenColumnName}
              columns={leafColumns}
              onRowDoubleClick={onRowDoubleClick}
              onRowContextMenu={onRowContextMenu}
              onRowMouseEnter={onRowMouseEnter}
              onRowMouseLeave={onRowMouseLeave}
              height={height}
              {...onHoverProps}
              hoverKey={key}
              rowKey={key}
              ref={rowRef(record, i, indent)}
              {...expandableRow}
            />
          )}
        </ExpandableRow>
      );

      rows.push(row);

      const expandedRows = expander.renderRows(this.renderRows, record, i, indent, fixed, key);

      if (expandedRows) {
        rows.push(...expandedRows);
      }
    }
    return rows;
  }

  render() {
    const { prefixCls, scroll, data, getBodyWrapper } = this.context.table.props;
    const { tableClassName, hasHead, hasBody, fixed, columns } = this.props;
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
        {hasHead && <TableHeader columns={columns} fixed={fixed} /> }
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
