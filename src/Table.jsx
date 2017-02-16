import React, { PropTypes } from 'react';
import TableRow from './TableRow';
import TableHeader from './TableHeader';
import { measureScrollbar, debounce, warningOnce, hasScrollX } from './utils';
import shallowequal from 'shallowequal';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import ColumnManager from './ColumnManager';
import createStore from './createStore';
import classes from 'component-classes';

export default class Table extends React.Component {
  static propTypes = {
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
    children: PropTypes.node,
  }

  static defaultProps = {
    data: [],
    useFixedHeader: false,
    expandIconAsCell: false,
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
  }

  constructor(props) {
    super(props);
    let expandedRowKeys = [];
    let rows = [...props.data];
    this.columnManager = new ColumnManager(props.columns, props.children);
    this.store = createStore({ currentHoverKey: null });
    this.setScrollPosition('left');

    if (props.defaultExpandAllRows) {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        expandedRowKeys.push(this.getRowKey(row, i));
        rows = rows.concat(row[props.childrenColumnName] || []);
      }
    } else {
      expandedRowKeys = props.expandedRowKeys || props.defaultExpandedRowKeys;
    }
    this.state = {
      expandedRowKeys,
      currentHoverKey: null,
      fixedColumnsHeadRowsHeight: [],
      fixedColumnsBodyRowsHeight: [],
    };
  }

  componentDidMount() {
    if (this.columnManager.isAnyColumnsFixed()) {
      this.syncFixedTableRowHeight();
      this.debouncedSyncFixedTableRowHeight = debounce(this.syncFixedTableRowHeight, 150);
      this.resizeEvent = addEventListener(
        window, 'resize', this.debouncedSyncFixedTableRowHeight
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('data' in nextProps) {
      if ((!nextProps.data || nextProps.data.length === 0) && hasScrollX(nextProps)) {
        this.resetScrollX();
      }
    }
    if ('expandedRowKeys' in nextProps) {
      this.setState({
        expandedRowKeys: nextProps.expandedRowKeys,
      });
    }
    if (nextProps.columns && nextProps.columns !== this.props.columns) {
      this.columnManager.reset(nextProps.columns);
    } else if (nextProps.children !== this.props.children) {
      this.columnManager.reset(null, nextProps.children);
    }
  }

  componentDidUpdate() {
    this.syncFixedTableRowHeight();
  }

  componentWillUnmount() {
    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }
    if (this.debouncedSyncFixedTableRowHeight) {
      this.debouncedSyncFixedTableRowHeight.cancel();
    }
  }

  onExpandedRowsChange(expandedRowKeys) {
    if (!this.props.expandedRowKeys) {
      this.setState({ expandedRowKeys });
    }
    this.props.onExpandedRowsChange(expandedRowKeys);
  }

  onExpanded = (expanded, record, e, index) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const info = this.findExpandedRow(record);
    if (typeof info !== 'undefined' && !expanded) {
      this.onRowDestroy(record, index);
    } else if (!info && expanded) {
      const expandedRows = this.getExpandedRows().concat();
      expandedRows.push(this.getRowKey(record, index));
      this.onExpandedRowsChange(expandedRows);
    }
    this.props.onExpand(expanded, record);
  }

  onRowDestroy = (record, rowIndex) => {
    const expandedRows = this.getExpandedRows().concat();
    const rowKey = this.getRowKey(record, rowIndex);
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
  }

  getRowKey(record, index) {
    const rowKey = this.props.rowKey;
    const key = (typeof rowKey === 'function') ?
      rowKey(record, index) : record[rowKey];
    warningOnce(
      key !== undefined,
      'Each record in table should have a unique `key` prop,' +
      'or set `rowKey` to an unique primary key.'
    );
    return key === undefined ? index : key;
  }

  getExpandedRows() {
    return this.props.expandedRowKeys || this.state.expandedRowKeys;
  }

  getHeader(columns, fixed) {
    const { showHeader, expandIconAsCell, prefixCls } = this.props;
    const rows = this.getHeaderRows(columns);

    if (expandIconAsCell && fixed !== 'right') {
      rows[0].unshift({
        key: 'rc-table-expandIconAsCell',
        className: `${prefixCls}-expand-icon-th`,
        title: '',
        rowSpan: rows.length,
      });
    }

    const trStyle = fixed ? this.getHeaderRowStyle(columns, rows) : null;

    return showHeader ? (
      <TableHeader
        prefixCls={prefixCls}
        rows={rows}
        rowStyle={trStyle}
      />
    ) : null;
  }

  getHeaderRows(columns, currentRow = 0, rows) {
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
      }
      if (cell.colSpan !== 0) {
        rows[currentRow].push(cell);
      }
    });
    return rows.filter(row => row.length > 0);
  }

  getExpandedRow(key, content, visible, className, fixed) {
    const { prefixCls, expandIconAsCell } = this.props;
    let colCount;
    if (fixed === 'left') {
      colCount = this.columnManager.leftLeafColumns().length;
    } else if (fixed === 'right') {
      colCount = this.columnManager.rightLeafColumns().length;
    } else {
      colCount = this.columnManager.leafColumns().length;
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
        prefixCls={`${prefixCls}-expanded-row`}
        indent={1}
        expandable={false}
        store={this.store}
      />
    );
  }

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

    const expandIconAsCell = fixed !== 'right' ? props.expandIconAsCell : false;
    const expandIconColumnIndex = fixed !== 'right' ? props.expandIconColumnIndex : -1;

    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      const key = this.getRowKey(record, i);
      const childrenColumn = record[childrenColumnName];
      const isRowExpanded = this.isRowExpanded(record, i);
      let expandedRowContent;
      if (expandedRowRender && isRowExpanded) {
        expandedRowContent = expandedRowRender(record, i, indent);
      }
      const className = rowClassName(record, i, indent);

      const onHoverProps = {};
      if (this.columnManager.isAnyColumnsFixed()) {
        onHoverProps.onHover = this.handleRowHover;
      }

      const height = (fixed && fixedColumnsBodyRowsHeight[i]) ?
        fixedColumnsBodyRowsHeight[i] : null;


      let leafColumns;
      if (fixed === 'left') {
        leafColumns = this.columnManager.leftLeafColumns();
      } else if (fixed === 'right') {
        leafColumns = this.columnManager.rightLeafColumns();
      } else {
        leafColumns = this.columnManager.leafColumns();
      }

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
          height={height}
          {...onHoverProps}
          key={key}
          hoverKey={key}
          ref={rowRef(record, i, indent)}
          store={this.store}
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
  }

  getRows(columns, fixed) {
    return this.getRowsByData(this.props.data, true, 0, columns, fixed);
  }

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
    let leafColumns;
    if (fixed === 'left') {
      leafColumns = this.columnManager.leftLeafColumns();
    } else if (fixed === 'right') {
      leafColumns = this.columnManager.rightLeafColumns();
    } else {
      leafColumns = this.columnManager.leafColumns();
    }
    cols = cols.concat(leafColumns.map(c => {
      return <col key={c.key} style={{ width: c.width, minWidth: c.width }} />;
    }));
    return <colgroup>{cols}</colgroup>;
  }

  getLeftFixedTable() {
    return this.getTable({
      columns: this.columnManager.leftColumns(),
      fixed: 'left',
    });
  }

  getRightFixedTable() {
    return this.getTable({
      columns: this.columnManager.rightColumns(),
      fixed: 'right',
    });
  }

  getTable(options = {}) {
    const { columns, fixed } = options;
    const { prefixCls, scroll = {}, getBodyWrapper } = this.props;
    let { useFixedHeader } = this.props;
    const bodyStyle = { ...this.props.bodyStyle };
    const headStyle = {};

    let tableClassName = '';
    if (scroll.x || fixed) {
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
      if (!fixed && scroll.x) {
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
          ref={fixed ? null : 'headTable'}
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

    if (fixed && columns.length) {
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
  }

  getTitle() {
    const { title, prefixCls } = this.props;
    return title ? (
      <div className={`${prefixCls}-title`}>
        {title(this.props.data)}
      </div>
    ) : null;
  }

  getFooter() {
    const { footer, prefixCls } = this.props;
    return footer ? (
      <div className={`${prefixCls}-footer`}>
        {footer(this.props.data)}
      </div>
    ) : null;
  }

  getEmptyText() {
    const { emptyText, prefixCls, data } = this.props;
    return !data.length ? (
      <div className={`${prefixCls}-placeholder`}>
        {emptyText()}
      </div>
    ) : null;
  }

  getHeaderRowStyle(columns, rows) {
    const { fixedColumnsHeadRowsHeight } = this.state;
    const headerHeight = fixedColumnsHeadRowsHeight[0];
    if (headerHeight && columns) {
      if (headerHeight === 'auto') {
        return { height: 'auto' };
      }
      return { height: headerHeight / rows.length };
    }
    return null;
  }

  setScrollPosition(position) {
    this.scrollPosition = position;
    if (this.tableNode) {
      const { prefixCls } = this.props;
      classes(this.tableNode)
        .remove(new RegExp(`^${prefixCls}-scroll-position-.+$`))
        .add(`${prefixCls}-scroll-position-${position}`);
    }
  }

  syncFixedTableRowHeight() {
    const { prefixCls } = this.props;
    const headRows = this.refs.headTable ?
            this.refs.headTable.querySelectorAll('thead') :
            this.refs.bodyTable.querySelectorAll('thead');
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
    this.setState({
      fixedColumnsHeadRowsHeight,
      fixedColumnsBodyRowsHeight,
    });
  }

  resetScrollX() {
    if (this.refs.headTable) {
      this.refs.headTable.scrollLeft = 0;
    }
    if (this.refs.bodyTable) {
      this.refs.bodyTable.scrollLeft = 0;
    }
  }

  findExpandedRow(record, index) {
    const rows = this.getExpandedRows().filter(i => i === this.getRowKey(record, index));
    return rows[0];
  }

  isRowExpanded(record, index) {
    return typeof this.findExpandedRow(record, index) !== 'undefined';
  }

  detectScrollTarget(e) {
    if (this.scrollTarget !== e.currentTarget) {
      this.scrollTarget = e.currentTarget;
    }
  }

  handleBodyScroll(e) {
    // Prevent scrollTop setter trigger onScroll event
    // http://stackoverflow.com/q/1386696
    if (e.target !== this.scrollTarget) {
      return;
    }
    const { scroll = {} } = this.props;
    const { headTable, bodyTable, fixedColumnsBodyLeft, fixedColumnsBodyRight } = this.refs;
    if (scroll.x && e.target.scrollLeft !== this.lastScrollLeft) {
      if (e.target === bodyTable && headTable) {
        headTable.scrollLeft = e.target.scrollLeft;
      } else if (e.target === headTable && bodyTable) {
        bodyTable.scrollLeft = e.target.scrollLeft;
      }
      if (e.target.scrollLeft === 0) {
        this.setScrollPosition('left');
      } else if (e.target.scrollLeft + 1 >=
        e.target.children[0].getBoundingClientRect().width -
        e.target.getBoundingClientRect().width) {
        this.setScrollPosition('right');
      } else if (this.scrollPosition !== 'middle') {
        this.setScrollPosition('middle');
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
    // Remember last scrollLeft for scroll direction detecting.
    this.lastScrollLeft = e.target.scrollLeft;
  }

  handleRowHover = (isHover, key) => {
    this.store.setState({
      currentHoverKey: isHover ? key : null,
    });
  }

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
    className += ` ${prefixCls}-scroll-position-${this.scrollPosition}`;

    const isTableScroll = this.columnManager.isAnyColumnsFixed() ||
                          props.scroll.x ||
                          props.scroll.y;

    return (
      <div ref={node => (this.tableNode = node)} className={className} style={props.style}>
        {this.getTitle()}
        <div className={`${prefixCls}-content`}>
          {this.columnManager.isAnyColumnsLeftFixed() &&
          <div className={`${prefixCls}-fixed-left`}>
            {this.getLeftFixedTable()}
          </div>}
          <div className={isTableScroll ? `${prefixCls}-scroll` : ''}>
            {this.getTable({ columns: this.columnManager.groupedColumns() })}
            {this.getEmptyText()}
            {this.getFooter()}
          </div>
          {this.columnManager.isAnyColumnsRightFixed() &&
          <div className={`${prefixCls}-fixed-right`}>
            {this.getRightFixedTable()}
          </div>}
        </div>
      </div>
    );
  }
}
