import * as React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'mini-store';
import classNames from 'classnames';
import ColGroup from './ColGroup';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import ExpandableRow from './ExpandableRow';
import {
  ColumnType,
  TableStore,
  Expander,
  GetRowKey,
  RowHoverEventHandler,
  FixedType,
  RenderRows,
} from './interface';

export interface BaseTableProps<ValueType> {
  fixed?: FixedType;
  columns: ColumnType[];
  tableClassName: string;
  hasHead: boolean;
  hasBody: boolean;
  store: TableStore;
  expander: Expander<ValueType>;
  getRowKey?: GetRowKey<ValueType>;
  isAnyColumnsFixed?: boolean;
}

class BaseTable<ValueType> extends React.Component<BaseTableProps<ValueType>> {
  static contextTypes = {
    table: PropTypes.any,
  };

  getColumns(cols?: ColumnType[]) {
    const { columns = [], fixed } = this.props;
    const { table } = this.context;
    const { prefixCls } = table.props;
    return (cols || columns).map(column => ({
      ...column,
      className:
        !!column.fixed && !fixed
          ? classNames(`${prefixCls}-fixed-columns-in-body`, column.className)
          : column.className,
    }));
  }

  handleRowHover: RowHoverEventHandler = (isHover, key) => {
    this.props.store.setState({
      currentHoverKey: isHover ? key : null,
    });
  };

  renderRows: RenderRows<ValueType> = (renderData, indent, ancestorKeys = []) => {
    const { table } = this.context;
    const { columnManager, components } = table;
    const {
      prefixCls,
      childrenColumnName,
      rowClassName,
      rowRef,
      onRowClick,
      onRowDoubleClick,
      onRowContextMenu,
      onRowMouseEnter,
      onRowMouseLeave,
      onRow,
    } = table.props;
    const { getRowKey, fixed, expander, isAnyColumnsFixed } = this.props;

    const rows: React.ReactElement[] = [];

    for (let i = 0; i < renderData.length; i += 1) {
      const record = renderData[i];
      const key = getRowKey(record, i);
      const className: string =
        typeof rowClassName === 'string' ? rowClassName : rowClassName(record, i, indent);

      const onHoverProps: { onHover?: RowHoverEventHandler } = {};
      if (columnManager.isAnyColumnsFixed()) {
        onHoverProps.onHover = this.handleRowHover;
      }

      let leafColumns: ColumnType[];
      if (fixed === 'left') {
        leafColumns = columnManager.leftLeafColumns();
      } else if (fixed === 'right') {
        leafColumns = columnManager.rightLeafColumns();
      } else {
        leafColumns = this.getColumns(columnManager.leafColumns());
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
          {(expandableRow: any) => (
            <TableRow
              fixed={fixed}
              indent={indent}
              className={className}
              record={record}
              index={i}
              prefixCls={rowPrefixCls}
              childrenColumnName={childrenColumnName}
              columns={leafColumns}
              onRow={onRow}
              onRowDoubleClick={onRowDoubleClick}
              onRowContextMenu={onRowContextMenu}
              onRowMouseEnter={onRowMouseEnter}
              onRowMouseLeave={onRowMouseLeave}
              {...onHoverProps}
              rowKey={key}
              ancestorKeys={ancestorKeys}
              ref={rowRef(record, i, indent)}
              components={components}
              isAnyColumnsFixed={isAnyColumnsFixed}
              {...expandableRow}
            />
          )}
        </ExpandableRow>
      );

      rows.push(row);

      expander.renderRows(this.renderRows, rows, record, i, indent, fixed, key, ancestorKeys);
    }
    return rows;
  };

  render() {
    const { table } = this.context;
    const { components } = table;
    const { prefixCls, scroll, data, getBodyWrapper } = table.props;
    const { expander, tableClassName, hasHead, hasBody, fixed, isAnyColumnsFixed } = this.props;
    const tableStyle: React.CSSProperties = {};

    if (!fixed && scroll.x) {
      // 当有固定列时，width auto 会导致 body table 的宽度撑不开，从而固定列无法对齐
      // 详情见：https://github.com/ant-design/ant-design/issues/22160
      const tableWidthScrollX = isAnyColumnsFixed ? 'max-content' : 'auto';
      // not set width, then use content fixed width
      tableStyle.width = scroll.x === true ? tableWidthScrollX : scroll.x;
    }

    const Table = hasBody ? components.table : 'table';
    const BodyWrapper = components.body.wrapper;

    let body: React.ReactElement;
    if (hasBody) {
      body = <BodyWrapper className={`${prefixCls}-tbody`}>{this.renderRows(data, 0)}</BodyWrapper>;
      if (getBodyWrapper) {
        body = getBodyWrapper(body);
      }
    }

    const columns = this.getColumns();
    let tableWidth: number = 0;
    let allHasNumberWidthProp = true;
    columns.forEach((elem: any) => {
      if ('width' in elem) {
        const { width } = elem;
        if (typeof width === 'number') {
          // as number
          tableWidth += width;
        } else if (`${width * 1}` === width) {
          // as number string
          tableWidth += width * 1;
        } else if (typeof width === 'string' && width.endsWith('px')) {
          // as number + px string
          tableWidth += parseInt(width, 10) * 1;
        } else {
          allHasNumberWidthProp = false;
        }
      } else {
        allHasNumberWidthProp = false;
      }
    });

    // 只有全部的列都有宽度设置时候，才增加计算后的宽度值。
    if (allHasNumberWidthProp && tableWidth && !('width' in tableStyle)) {
      tableStyle.width = tableWidth;
    }

    return (
      <Table className={tableClassName} style={tableStyle} key="table">
        <ColGroup columns={columns} fixed={fixed} />
        {hasHead && <TableHeader expander={expander} columns={columns} fixed={fixed} />}
        {body}
      </Table>
    );
  }
}

export default connect()(BaseTable);
