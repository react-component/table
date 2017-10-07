import React from 'react';
import PropTypes from 'prop-types';
import ColGroup from './ColGroup';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

export default class BaseTable extends React.Component {
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
    this.context.table.store.setState({
      currentHoverKey: isHover ? key : null,
    });
  }

  renderExpandedRow(key, content, visible, className) {
    const { table } = this.context;
    const { prefixCls, expandIconAsCell } = table.props;
    const { store, columnManager } = table;
    const { fixed } = this.props;
    let colCount;
    if (fixed === 'left') {
      colCount = columnManager.leftLeafColumns().length;
    } else if (fixed === 'right') {
      colCount = columnManager.rightLeafColumns().length;
    } else {
      colCount = columnManager.leafColumns().length;
    }
    const columns = [{
      key: 'extra-row',
      render: () => ({
        props: {
          colSpan: colCount,
        },
        children: fixed !== 'right' ? content : '&nbsp;',
      }),
    }];
    if (expandIconAsCell && fixed !== 'right') {
      columns.unshift({
        key: 'expand-icon-placeholder',
        render: () => null,
      });
    }
    return (
      <TableRow
        columns={columns}
        visible={visible}
        className={className}
        key={`${key}-extra-row`}
        rowKey={`${key}-extra-row`}
        prefixCls={`${prefixCls}-expanded-row`}
        indent={1}
        expandable={false}
        store={store}
        expandedRow
        fixed={!!fixed}
      />
    );
  }

  renderRows(renderData, visible, indent) {
    const { table } = this.context;
    const { fixedColumnsBodyRowsHeight } = table.state;
    const {
      store,
      columnManager,
      getRowKey,
      isRowExpanded,
      onExpanded,
      onRowDestroy,
    } = table;
    const {
      prefixCls,
      data,
      childrenColumnName,
      indentSize,
      expandedRowRender,
      expandRowByClick,
      rowClassName,
      rowRef,
      expandedRowClassName,
      onRowClick,
      onRowDoubleClick,
      onRowContextMenu,
      onRowMouseEnter,
      onRowMouseLeave,
    } = table.props;
    const { columns, fixed } = this.props;
    const needIndentSpaced = data.some(record => record[childrenColumnName]);
    const expandIconAsCell = fixed !== 'right' ? table.props.expandIconAsCell : false;
    const expandIconColumnIndex = fixed !== 'right' ? table.props.expandIconColumnIndex : -1;

    let rst = [];

    for (let i = 0; i < renderData.length; i++) {
      const record = renderData[i];
      const key = getRowKey(record, i);
      const childrenData = record[childrenColumnName];
      const isExpanded = isRowExpanded(record, i);
      let expandedRowContent;
      if (expandedRowRender && isExpanded) {
        expandedRowContent = expandedRowRender(record, i, indent);
      }
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

      rst.push(
        <TableRow
          indent={indent}
          indentSize={indentSize}
          needIndentSpaced={needIndentSpaced}
          className={className}
          record={record}
          expandIconAsCell={expandIconAsCell}
          onDestroy={onRowDestroy}
          index={i}
          visible={visible}
          expandRowByClick={expandRowByClick}
          onExpand={onExpanded}
          expandable={childrenData || expandedRowRender}
          expanded={isExpanded}
          prefixCls={`${prefixCls}-row`}
          childrenColumnName={childrenColumnName}
          columns={leafColumns}
          expandIconColumnIndex={expandIconColumnIndex}
          onRowClick={onRowClick}
          onRowDoubleClick={onRowDoubleClick}
          onRowContextMenu={onRowContextMenu}
          onRowMouseEnter={onRowMouseEnter}
          onRowMouseLeave={onRowMouseLeave}
          height={height}
          {...onHoverProps}
          key={key}
          hoverKey={key}
          ref={rowRef(record, i, indent)}
          store={store}
        />
      );

      const subVisible = visible && isExpanded;

      if (expandedRowContent && isExpanded) {
        rst.push(this.renderExpandedRow(
          key,
          expandedRowContent,
          subVisible,
          expandedRowClassName(record, i, indent),
        ));
      }
      if (childrenData) {
        rst = rst.concat(this.renderRows(
          childrenData, subVisible, indent + 1, columns, fixed
        ));
      }
    }
    return rst;
  }

  render() {
    const {
      prefixCls,
      scroll,
      data,
      getBodyWrapper,
    } = this.context.table.props;

    const {
      tableClassName,
      hasHead,
      hasBody,
      fixed,
      columns,
    } = this.props;

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
            {this.renderRows(data, true, 0)}
          </tbody>
        )}
      </table>
    );
  }
}
