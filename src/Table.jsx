import React, { PropTypes } from 'react';
import TableRow from './TableRow';
import TableHeader from './TableHeader';
import { measureScrollbar, debounce } from './utils';
import shallowequal from 'shallowequal';
import addEventListener from 'rc-util/lib/Dom/addEventListener';

const Table = React.createClass({
  propTypes: {
    data: PropTypes.array,
    expandIconAsCell: PropTypes.bool,
    defaultExpandAllRows: PropTypes.bool,
    expandedRowKeys: PropTypes.array,
    defaultExpandedRowKeys: PropTypes.array,
    useFixedHeader: PropTypes.bool,
    columns: PropTypes.array,
    prefixCls: PropTypes.string,
    bodyStyle: PropTypes.object,
    style: PropTypes.object,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    rowClassName: PropTypes.func,
    expandedRowClassName: PropTypes.func,
    childrenColumnName: PropTypes.string,
    onExpand: PropTypes.func,
    onExpandedRowsChange: PropTypes.func,
    indentSize: PropTypes.number,
    onRowClick: PropTypes.func,
    onRowDoubleClick: PropTypes.func,
    expandIconColumnIndex: PropTypes.number,
    showHeader: PropTypes.bool,
    title: PropTypes.func,
    footer: PropTypes.func,
    emptyText: PropTypes.func,
    scroll: PropTypes.object,
    rowRef: PropTypes.func,
    getBodyWrapper: PropTypes.func,
  },

  getDefaultProps() {
    return {
      data: [],
      useFixedHeader: false,
      expandIconAsCell: false,
      columns: [],
      defaultExpandAllRows: false,
      defaultExpandedRowKeys: [],
      rowKey: 'key',
      rowClassName: () => '',
      expandedRowClassName: () => '',
      onExpand() {},
      onExpandedRowsChange() {},
      onRowClick() {},
      onRowDoubleClick() {},
      prefixCls: 'rc-table',
      bodyStyle: {},
      style: {},
      childrenColumnName: 'children',
      indentSize: 15,
      expandIconColumnIndex: 0,
      showHeader: true,
      scroll: {},
      rowRef: () => null,
      getBodyWrapper: body => body,
      emptyText: () => 'No Data',
    };
  },

  getInitialState() {
    const props = this.props;
    let expandedRowKeys = [];
    let rows = [...props.data];
    if (props.defaultExpandAllRows) {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        expandedRowKeys.push(this.getRowKey(row));
        rows = rows.concat(row[props.childrenColumnName] || []);
      }
    } else {
      expandedRowKeys = props.expandedRowKeys || props.defaultExpandedRowKeys;
    }
    return {
      expandedRowKeys,
      data: props.data,
      currentHoverKey: null,
      scrollPosition: 'left',
      fixedColumnsHeadRowsHeight: [],
      fixedColumnsBodyRowsHeight: [],
    };
  },

  componentDidMount() {
    this.resetScrollY();
    const isAnyColumnsFixed = this.isAnyColumnsFixed();
    if (isAnyColumnsFixed) {
      this.syncFixedTableRowHeight();
      this.resizeEvent = addEventListener(
        window, 'resize', debounce(this.syncFixedTableRowHeight, 150)
      );
    }
  },

  componentWillReceiveProps(nextProps) {
    if ('data' in nextProps) {
      this.setState({
        data: nextProps.data,
      });
      if (!nextProps.data || nextProps.data.length === 0) {
        this.resetScrollY();
      }
    }
    if ('expandedRowKeys' in nextProps) {
      this.setState({
        expandedRowKeys: nextProps.expandedRowKeys,
      });
    }
    if (nextProps.columns !== this.props.columns) {
      delete this.isAnyColumnsFixedCache;
      delete this.isAnyColumnsLeftFixedCache;
      delete this.isAnyColumnsRightFixedCache;
    }
  },

  componentDidUpdate() {
    this.syncFixedTableRowHeight();
  },

  componentWillUnmount() {
    clearTimeout(this.timer);
    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }
  },

  onExpandedRowsChange(expandedRowKeys) {
    if (!this.props.expandedRowKeys) {
      this.setState({ expandedRowKeys });
    }
    this.props.onExpandedRowsChange(expandedRowKeys);
  },

  onExpanded(expanded, record, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const info = this.findExpandedRow(record);
    if (typeof info !== 'undefined' && !expanded) {
      this.onRowDestroy(record);
    } else if (!info && expanded) {
      const expandedRows = this.getExpandedRows().concat();
      expandedRows.push(this.getRowKey(record));
      this.onExpandedRowsChange(expandedRows);
    }
    this.props.onExpand(expanded, record);
  },

  onRowDestroy(record) {
    const expandedRows = this.getExpandedRows().concat();
    const rowKey = this.getRowKey(record);
    let index = -1;
    expandedRows.forEach((r, i) => {
      if (r === rowKey) {
        index = i;
      }
    });
    if (index !== -1) {
      expandedRows.splice(index, 1);
    }
    this.onExpandedRowsChange(expandedRows);
  },

  getRowKey(record, index) {
    const rowKey = this.props.rowKey;
    if (typeof rowKey === 'function') {
      return rowKey(record, index);
    }
    return typeof record[rowKey] !== 'undefined' ? record[rowKey] : index;
  },

  getExpandedRows() {
    return this.props.expandedRowKeys || this.state.expandedRowKeys;
  },

  getHeader(columns, fixed) {
    const { showHeader, expandIconAsCell, prefixCls } = this.props;
    let rows;
    if (columns) {
      // columns are passed from fixed table function that already grouped.
      rows = this.getHeaderRows(columns);
    } else {
      rows = this.getHeaderRows(this.groupColumns(this.props.columns));
    }

    if (expandIconAsCell && fixed !== 'right') {
      rows[0].unshift({
        key: 'rc-table-expandIconAsCell',
        className: `${prefixCls}-expand-icon-th ${prefixCls}-rowspan-${rows.length}`,
        title: '',
        rowSpan: rows.length,
      });
    }

    const { fixedColumnsHeadRowsHeight } = this.state;
    const trStyle = (fixedColumnsHeadRowsHeight[0] && columns) ? {
      height: fixedColumnsHeadRowsHeight[0],
    } : null;

    return showHeader ? (
      <TableHeader
        prefixCls={prefixCls}
        rows={rows}
        rowStyle={trStyle}
      />
    ) : null;
  },

  getHeaderRows(columns, currentRow = 0, rows) {
    const { prefixCls } = this.props;

    rows = rows || [];
    rows[currentRow] = rows[currentRow] || [];

    columns.forEach(column => {
      if (column.rowSpan && rows.length < column.rowSpan) {
        while (rows.length < column.rowSpan) {
          rows.push([]);
        }
      }
      const cell = {
        key: column.key,
        className: column.className || '',
        children: column.title,
      };
      if (column.children) {
        this.getHeaderRows(column.children, currentRow + 1, rows);
      }
      if ('colSpan' in column) {
        cell.colSpan = column.colSpan;
      }
      if ('rowSpan' in column) {
        cell.rowSpan = column.rowSpan;
        cell.className += ` ${prefixCls}-rowspan-${cell.rowSpan}`;
      }
      if (cell.colSpan !== 0) {
        rows[currentRow].push(cell);
      }
    });
    return rows;
  },

  getExpandedRow(key, content, visible, className, fixed) {
    const { prefixCls, expandIconAsCell } = this.props;
    const columns = [{
      key: 'extra-row',
      render: () => ({
        props: {
          colSpan: this.getLeafColumnsCount(this.props.columns),
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
        prefixCls={`${prefixCls}-expanded-row`}
        indent={1}
        expandable={false}
      />
    );
  },

  getRowsByData(data, visible, indent, columns, fixed) {
    const props = this.props;
    const childrenColumnName = props.childrenColumnName;
    const expandedRowRender = props.expandedRowRender;
    const expandRowByClick = props.expandRowByClick;
    const { fixedColumnsBodyRowsHeight } = this.state;
    let rst = [];
    const rowClassName = props.rowClassName;
    const rowRef = props.rowRef;
    const expandedRowClassName = props.expandedRowClassName;
    const needIndentSpaced = props.data.some(record => record[childrenColumnName]);
    const onRowClick = props.onRowClick;
    const onRowDoubleClick = props.onRowDoubleClick;
    const isAnyColumnsFixed = this.isAnyColumnsFixed();

    const expandIconAsCell = fixed !== 'right' ? props.expandIconAsCell : false;
    const expandIconColumnIndex = fixed !== 'right' ? props.expandIconColumnIndex : -1;

    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      const key = this.getRowKey(record, i);
      const childrenColumn = record[childrenColumnName];
      const isRowExpanded = this.isRowExpanded(record);
      let expandedRowContent;
      if (expandedRowRender && isRowExpanded) {
        expandedRowContent = expandedRowRender(record, i, indent);
      }
      let className = rowClassName(record, i, indent);
      if (this.state.currentHoverKey === key) {
        className += ` ${props.prefixCls}-row-hover`;
      }

      const onHoverProps = {};
      if (isAnyColumnsFixed) {
        onHoverProps.onHover = this.handleRowHover;
      }

      const style = (fixed && fixedColumnsBodyRowsHeight[i]) ? {
        height: fixedColumnsBodyRowsHeight[i],
      } : {};

      const leafColumns = this.getLeafColumns(columns || props.columns);

      rst.push(
        <TableRow
          indent={indent}
          indentSize={props.indentSize}
          needIndentSpaced={needIndentSpaced}
          className={className}
          record={record}
          expandIconAsCell={expandIconAsCell}
          onDestroy={this.onRowDestroy}
          index={i}
          visible={visible}
          expandRowByClick={expandRowByClick}
          onExpand={this.onExpanded}
          expandable={childrenColumn || expandedRowRender}
          expanded={isRowExpanded}
          prefixCls={`${props.prefixCls}-row`}
          childrenColumnName={childrenColumnName}
          columns={leafColumns}
          expandIconColumnIndex={expandIconColumnIndex}
          onRowClick={onRowClick}
          onRowDoubleClick={onRowDoubleClick}
          style={style}
          {...onHoverProps}
          key={key}
          hoverKey={key}
          ref={rowRef(record, i, indent)}
        />
      );

      const subVisible = visible && isRowExpanded;

      if (expandedRowContent && isRowExpanded) {
        rst.push(this.getExpandedRow(
          key, expandedRowContent, subVisible, expandedRowClassName(record, i, indent), fixed
        ));
      }
      if (childrenColumn) {
        rst = rst.concat(this.getRowsByData(
          childrenColumn, subVisible, indent + 1, columns, fixed
        ));
      }
    }
    return rst;
  },

  getRows(columns, fixed) {
    return this.getRowsByData(this.state.data, true, 0, columns, fixed);
  },

  getColGroup(columns, fixed) {
    let cols = [];
    if (this.props.expandIconAsCell && fixed !== 'right') {
      cols.push(
        <col
          className={`${this.props.prefixCls}-expand-icon-col`}
          key="rc-table-expand-icon-col"
        />
      );
    }
    const leafColumns = this.getLeafColumns(columns || this.props.columns);
    cols = cols.concat(leafColumns.map(c => {
      return <col key={c.key} style={{ width: c.width, minWidth: c.width }} />;
    }));
    return <colgroup>{cols}</colgroup>;
  },

  getLeftFixedTable() {
    const { columns } = this.props;
    const fixedColumns = this.groupColumns(columns).filter(
      column => column.fixed === 'left' || column.fixed === true
    );
    return this.getTable({
      columns: fixedColumns,
      fixed: 'left',
    });
  },

  getRightFixedTable() {
    const { columns } = this.props;
    const fixedColumns = this.groupColumns(columns).filter(column => column.fixed === 'right');
    return this.getTable({
      columns: fixedColumns,
      fixed: 'right',
    });
  },

  getTable(options = {}) {
    const { columns, fixed } = options;
    const { prefixCls, scroll = {}, getBodyWrapper } = this.props;
    let { useFixedHeader } = this.props;
    const bodyStyle = { ...this.props.bodyStyle };
    const headStyle = {};

    let tableClassName = '';
    if (scroll.x || columns) {
      tableClassName = `${prefixCls}-fixed`;
      bodyStyle.overflowX = bodyStyle.overflowX || 'auto';
    }

    if (scroll.y) {
      // maxHeight will make fixed-Table scrolling not working
      // so we only set maxHeight to body-Table here
      if (fixed) {
        bodyStyle.height = bodyStyle.height || scroll.y;
      } else {
        bodyStyle.maxHeight = bodyStyle.maxHeight || scroll.y;
      }
      bodyStyle.overflowY = bodyStyle.overflowY || 'scroll';
      useFixedHeader = true;

      // Add negative margin bottom for scroll bar overflow bug
      const scrollbarWidth = measureScrollbar();
      if (scrollbarWidth > 0) {
        (fixed ? bodyStyle : headStyle).marginBottom = `-${scrollbarWidth}px`;
        (fixed ? bodyStyle : headStyle).paddingBottom = '0px';
      }
    }

    const renderTable = (hasHead = true, hasBody = true) => {
      const tableStyle = {};
      if (!columns && scroll.x) {
        // not set width, then use content fixed width
        if (scroll.x === true) {
          tableStyle.tableLayout = 'fixed';
        } else {
          tableStyle.width = scroll.x;
        }
      }
      const tableBody = hasBody ? getBodyWrapper(
        <tbody className={`${prefixCls}-tbody`}>
          {this.getRows(columns, fixed)}
        </tbody>
      ) : null;
      return (
        <table className={tableClassName} style={tableStyle}>
          {this.getColGroup(columns, fixed)}
          {hasHead ? this.getHeader(columns, fixed) : null}
          {tableBody}
        </table>
      );
    };

    let headTable;
    if (useFixedHeader) {
      headTable = (
        <div
          className={`${prefixCls}-header`}
          ref={columns ? null : 'headTable'}
          style={headStyle}
          onMouseOver={this.detectScrollTarget}
          onTouchStart={this.detectScrollTarget}
          onScroll={this.handleBodyScroll}
        >
          {renderTable(true, false)}
        </div>
      );
    }

    let BodyTable = (
      <div
        className={`${prefixCls}-body`}
        style={bodyStyle}
        ref="bodyTable"
        onMouseOver={this.detectScrollTarget}
        onTouchStart={this.detectScrollTarget}
        onScroll={this.handleBodyScroll}
      >
        {renderTable(!useFixedHeader)}
      </div>
    );

    if (columns && columns.length) {
      let refName;
      if (columns[0].fixed === 'left' || columns[0].fixed === true) {
        refName = 'fixedColumnsBodyLeft';
      } else if (columns[0].fixed === 'right') {
        refName = 'fixedColumnsBodyRight';
      }
      delete bodyStyle.overflowX;
      delete bodyStyle.overflowY;
      BodyTable = (
        <div
          className={`${prefixCls}-body-outer`}
          style={{ ...bodyStyle }}
        >
          <div
            className={`${prefixCls}-body-inner`}
            ref={refName}
            onMouseOver={this.detectScrollTarget}
            onTouchStart={this.detectScrollTarget}
            onScroll={this.handleBodyScroll}
          >
            {renderTable(!useFixedHeader)}
          </div>
        </div>
      );
    }

    return <span>{headTable}{BodyTable}</span>;
  },

  getTitle() {
    const { title, prefixCls } = this.props;
    return title ? (
      <div className={`${prefixCls}-title`}>
        {title(this.state.data)}
      </div>
    ) : null;
  },

  getFooter() {
    const { footer, prefixCls } = this.props;
    return footer ? (
      <div className={`${prefixCls}-footer`}>
        {footer(this.state.data)}
      </div>
    ) : null;
  },

  getEmptyText() {
    const { emptyText, prefixCls, data } = this.props;
    return !data.length ? (
      <div className={`${prefixCls}-placeholder`}>
        {emptyText()}
      </div>
    ) : null;
  },

  getLeafColumns(columns) {
    const leafColumns = [];
    columns.forEach(column => {
      if (!column.children) {
        leafColumns.push(column);
      } else {
        leafColumns.push(...this.getLeafColumns(column.children));
      }
    });
    return leafColumns;
  },

  getLeafColumnsCount(columns) {
    return this.getLeafColumns(columns).length;
  },

  // add appropriate rowspan and colspan to column
  groupColumns(columns, currentRow = 0, parentColumn = {}, rows = []) {
    // track how many rows we got
    if (!~rows.indexOf(currentRow)) {
      rows.push(currentRow);
    }
    const grouped = [];
    const setRowSpan = column => {
      const rowSpan = rows.length - currentRow;
      if (column &&
          !column.children && // parent columns are supposed to be one row
          rowSpan > 1 &&
          (!column.rowSpan || column.rowSpan < rowSpan)
      ) {
        column.rowSpan = rowSpan;
      }
    };
    columns.forEach((column, index) => {
      const newColumn = { ...column };
      parentColumn.colSpan = parentColumn.colSpan || 0;
      if (newColumn.children && newColumn.children.length > 0) {
        newColumn.children = this.groupColumns(newColumn.children, currentRow + 1, newColumn, rows);
        parentColumn.colSpan = parentColumn.colSpan + newColumn.colSpan;
      } else {
        parentColumn.colSpan++;
      }
      // update rowspan to all previous columns
      for (let i = 0; i < index; ++i) {
        setRowSpan(grouped[i]);
      }
      // last column, update rowspan immediately
      if (index + 1 === columns.length) {
        setRowSpan(newColumn);
      }
      grouped.push(newColumn);
    });
    return grouped;
  },

  syncFixedTableRowHeight() {
    const { prefixCls } = this.props;
    const headRows = this.refs.headTable ?
            this.refs.headTable.querySelectorAll('tr') :
            this.refs.bodyTable.querySelectorAll('thead > tr');
    const bodyRows = this.refs.bodyTable.querySelectorAll(`.${prefixCls}-row`) || [];
    const fixedColumnsHeadRowsHeight = [].map.call(
      headRows, row => row.getBoundingClientRect().height || 'auto'
    );
    const fixedColumnsBodyRowsHeight = [].map.call(
      bodyRows, row => row.getBoundingClientRect().height || 'auto'
    );
    if (shallowequal(this.state.fixedColumnsHeadRowsHeight, fixedColumnsHeadRowsHeight) &&
        shallowequal(this.state.fixedColumnsBodyRowsHeight, fixedColumnsBodyRowsHeight)) {
      return;
    }
    this.timer = setTimeout(() => {
      this.setState({
        fixedColumnsHeadRowsHeight,
        fixedColumnsBodyRowsHeight,
      });
    });
  },

  resetScrollY() {
    if (this.refs.headTable) {
      this.refs.headTable.scrollLeft = 0;
    }
    if (this.refs.bodyTable) {
      this.refs.bodyTable.scrollLeft = 0;
    }
  },

  findExpandedRow(record) {
    const rows = this.getExpandedRows().filter(i => i === this.getRowKey(record));
    return rows[0];
  },

  isRowExpanded(record) {
    return typeof this.findExpandedRow(record) !== 'undefined';
  },

  detectScrollTarget(e) {
    if (this.scrollTarget !== e.currentTarget) {
      this.scrollTarget = e.currentTarget;
    }
  },

  isAnyColumnsFixed() {
    if ('isAnyColumnsFixedCache' in this) {
      return this.isAnyColumnsFixedCache;
    }
    this.isAnyColumnsFixedCache = this.props.columns.some(column => !!column.fixed);
    return this.isAnyColumnsFixedCache;
  },

  isAnyColumnsLeftFixed() {
    if ('isAnyColumnsLeftFixedCache' in this) {
      return this.isAnyColumnsLeftFixedCache;
    }
    this.isAnyColumnsLeftFixedCache = this.props.columns.some(
      column => column.fixed === 'left' || column.fixed === true
    );
    return this.isAnyColumnsLeftFixedCache;
  },

  isAnyColumnsRightFixed() {
    if ('isAnyColumnsRightFixedCache' in this) {
      return this.isAnyColumnsRightFixedCache;
    }
    this.isAnyColumnsRightFixedCache = this.props.columns.some(
      column => column.fixed === 'right'
    );
    return this.isAnyColumnsRightFixedCache;
  },

  handleBodyScroll(e) {
    // Prevent scrollTop setter trigger onScroll event
    // http://stackoverflow.com/q/1386696
    if (e.target !== this.scrollTarget) {
      return;
    }
    const { scroll = {} } = this.props;
    const { headTable, bodyTable, fixedColumnsBodyLeft, fixedColumnsBodyRight } = this.refs;
    if (scroll.x) {
      if (e.target === bodyTable && headTable) {
        headTable.scrollLeft = e.target.scrollLeft;
      } else if (e.target === headTable && bodyTable) {
        bodyTable.scrollLeft = e.target.scrollLeft;
      }
      if (e.target.scrollLeft === 0) {
        this.setState({ scrollPosition: 'left' });
      } else if (e.target.scrollLeft + 1 >=
        e.target.children[0].getBoundingClientRect().width -
        e.target.getBoundingClientRect().width) {
        this.setState({ scrollPosition: 'right' });
      } else if (this.state.scrollPosition !== 'middle') {
        this.setState({ scrollPosition: 'middle' });
      }
    }
    if (scroll.y) {
      if (fixedColumnsBodyLeft && e.target !== fixedColumnsBodyLeft) {
        fixedColumnsBodyLeft.scrollTop = e.target.scrollTop;
      }
      if (fixedColumnsBodyRight && e.target !== fixedColumnsBodyRight) {
        fixedColumnsBodyRight.scrollTop = e.target.scrollTop;
      }
      if (bodyTable && e.target !== bodyTable) {
        bodyTable.scrollTop = e.target.scrollTop;
      }
    }
  },

  handleRowHover(isHover, key) {
    this.setState({
      currentHoverKey: isHover ? key : null,
    });
  },

  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;

    let className = props.prefixCls;
    if (props.className) {
      className += ` ${props.className}`;
    }
    if (props.useFixedHeader || (props.scroll && props.scroll.y)) {
      className += ` ${prefixCls}-fixed-header`;
    }
    className += ` ${prefixCls}-scroll-position-${this.state.scrollPosition}`;

    const isTableScroll = this.isAnyColumnsFixed() || props.scroll.x || props.scroll.y;

    return (
      <div className={className} style={props.style}>
        {this.getTitle()}
        <div className={`${prefixCls}-content`}>
          {this.isAnyColumnsLeftFixed() &&
          <div className={`${prefixCls}-fixed-left`}>
            {this.getLeftFixedTable()}
          </div>}
          <div className={isTableScroll ? `${prefixCls}-scroll` : ''}>
            {this.getTable()}
            {this.getEmptyText()}
            {this.getFooter()}
          </div>
          {this.isAnyColumnsRightFixed() &&
          <div className={`${prefixCls}-fixed-right`}>
            {this.getRightFixedTable()}
          </div>}
        </div>
      </div>
    );
  },
});

export default Table;
