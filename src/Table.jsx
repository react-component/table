import React, { PropTypes } from 'react';
import TableRow from './TableRow';
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
    columnsPageRange: PropTypes.array,
    columnsPageSize: PropTypes.number,
    expandIconColumnIndex: PropTypes.number,
    showHeader: PropTypes.bool,
    title: PropTypes.func,
    footer: PropTypes.func,
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
      rowClassName() {
        return '';
      },
      expandedRowClassName() {
        return '';
      },
      onExpand() {
      },
      onExpandedRowsChange() {
      },
      prefixCls: 'rc-table',
      bodyStyle: {},
      style: {},
      childrenColumnName: 'children',
      indentSize: 15,
      columnsPageSize: 5,
      expandIconColumnIndex: 0,
      showHeader: true,
      scroll: {},
      rowRef() {
        return null;
      },
      getBodyWrapper: body => body,
    };
  },

  getInitialState() {
    const props = this.props;
    let expandedRowKeys = [];
    let rows = [ ...props.data ];
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
      currentColumnsPage: 0,
      currentHoverKey: null,
      scrollPosition: 'left',
      fixedColumnsHeadRowsHeight: [],
      fixedColumnsBodyRowsHeight: [],
    };
  },

  componentDidMount() {
    if (this.refs.headTable) {
      this.refs.headTable.scrollLeft = 0;
    }
    if (this.refs.bodyTable) {
      this.refs.bodyTable.scrollLeft = 0;
    }
    this.syncFixedTableRowHeight();
    const isAnyColumnsFixed = this.isAnyColumnsFixed();
    if (isAnyColumnsFixed) {
      this.resizeEvent = addEventListener(window, 'resize', debounce(this.syncFixedTableRowHeight, 150));
    }
  },

  componentWillReceiveProps(nextProps) {
    if ('data' in nextProps) {
      this.setState({
        data: nextProps.data,
      });
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
      this.setState({
        expandedRowKeys: expandedRowKeys,
      });
    }
    this.props.onExpandedRowsChange(expandedRowKeys);
  },

  onExpanded(expanded, record) {
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
    return record[rowKey] || index;
  },

  getExpandedRows() {
    return this.props.expandedRowKeys || this.state.expandedRowKeys;
  },

  getHeader(columns, fixed) {
    const { showHeader, expandIconAsCell, prefixCls} = this.props;
    let ths = [];
    if (expandIconAsCell && fixed !== 'right') {
      ths.push({
        key: 'rc-table-expandIconAsCell',
        className: `${prefixCls}-expand-icon-th`,
        title: '',
      });
    }
    ths = ths.concat(columns || this.getCurrentColumns()).map(c => {
      if (c.colSpan !== 0) {
        return <th key={c.key} colSpan={c.colSpan} className={c.className || ''}>{c.title}</th>;
      }
    });
    const { fixedColumnsHeadRowsHeight } = this.state;
    const trStyle = (fixedColumnsHeadRowsHeight[0] && columns) ? {
      height: fixedColumnsHeadRowsHeight[0],
    } : null;
    return showHeader ? (
      <thead className={`${prefixCls}-thead`}>
        <tr style={trStyle}>{ths}</tr>
      </thead>
    ) : null;
  },

  getExpandedRow(key, content, visible, className, fixed) {
    const prefixCls = this.props.prefixCls;
    return (
      <tr
        key={key + '-extra-row'}
        style={{display: visible ? '' : 'none'}}
        className={`${prefixCls}-expanded-row ${className}`}>
        {(this.props.expandIconAsCell && fixed !== 'right') ? <td key="rc-table-expand-icon-placeholder" /> : null}
        <td colSpan={this.props.columns.length}>
          {fixed !== 'right' ? content : '&nbsp;'}
        </td>
      </tr>
    );
  },

  getRowsByData(data, visible, indent, columns, fixed) {
    const props = this.props;
    const childrenColumnName = props.childrenColumnName;
    const expandedRowRender = props.expandedRowRender;
    const { fixedColumnsBodyRowsHeight } = this.state;
    let rst = [];
    const rowClassName = props.rowClassName;
    const rowRef = props.rowRef;
    const expandedRowClassName = props.expandedRowClassName;
    const needIndentSpaced = props.data.some(record => record[childrenColumnName]);
    const onRowClick = props.onRowClick;
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
        expandedRowContent = expandedRowRender(record, i);
      }
      let className = rowClassName(record, i);
      if (this.state.currentHoverKey === key) {
        className += ' ' + props.prefixCls + '-row-hover';
      }

      const onHoverProps = {};
      if (isAnyColumnsFixed) {
        onHoverProps.onHover = this.handleRowHover;
      }

      const style = (fixed && fixedColumnsBodyRowsHeight[i]) ? {
        height: fixedColumnsBodyRowsHeight[i],
      } : {};

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
          onExpand={this.onExpanded}
          expandable={childrenColumn || expandedRowRender}
          expanded={isRowExpanded}
          prefixCls={`${props.prefixCls}-row`}
          childrenColumnName={childrenColumnName}
          columns={columns || this.getCurrentColumns()}
          expandIconColumnIndex={expandIconColumnIndex}
          onRowClick={onRowClick}
          style={style}
          {...onHoverProps}
          key={key}
          hoverKey={key}
          ref={rowRef(record, i)}
        />
      );

      const subVisible = visible && isRowExpanded;

      if (expandedRowContent && isRowExpanded) {
        rst.push(this.getExpandedRow(key, expandedRowContent, subVisible, expandedRowClassName(record, i), fixed));
      }
      if (childrenColumn) {
        rst = rst.concat(this.getRowsByData(childrenColumn, subVisible, indent + 1, columns, fixed));
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
      cols.push(<col className={`${this.props.prefixCls}-expand-icon-col`} key="rc-table-expand-icon-col"></col>);
    }
    cols = cols.concat((columns || this.props.columns).map(c => {
      return <col key={c.key} style={{ width: c.width, minWidth: c.width }} />;
    }));
    return <colgroup>{cols}</colgroup>;
  },

  getCurrentColumns() {
    const { columns, columnsPageRange, columnsPageSize, prefixCls } = this.props;
    const { currentColumnsPage } = this.state;
    if (!columnsPageRange || columnsPageRange[0] > columnsPageRange[1]) {
      return columns;
    }
    return columns.map((column, i) => {
      let newColumn = { ...column };
      if (i >= columnsPageRange[0] && i <= columnsPageRange[1]) {
        const pageIndexStart = columnsPageRange[0] + currentColumnsPage * columnsPageSize;
        let pageIndexEnd = columnsPageRange[0] + (currentColumnsPage + 1) * columnsPageSize - 1;
        if (pageIndexEnd > columnsPageRange[1]) {
          pageIndexEnd = columnsPageRange[1];
        }
        if (i < pageIndexStart || i > pageIndexEnd) {
          newColumn.className = newColumn.className || '';
          newColumn.className += ' ' + prefixCls + '-column-hidden';
        }
        newColumn = this.wrapPageColumn(newColumn, (i === pageIndexStart), (i === pageIndexEnd));
      }
      return newColumn;
    });
  },

  getLeftFixedTable() {
    const { columns } = this.props;
    const fixedColumns = columns.filter(
      column => column.fixed === 'left' || column.fixed === true
    );
    return this.getTable({
      columns: fixedColumns,
      fixed: 'left',
    });
  },

  getRightFixedTable() {
    const { columns } = this.props;
    const fixedColumns = columns.filter(column => column.fixed === 'right');
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
      bodyStyle.height = bodyStyle.height || scroll.y;
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
          onScroll={this.handleBodyScroll}>
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
        onScroll={this.handleBodyScroll}>
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
          style={{ ...bodyStyle }}>
          <div
            className={`${prefixCls}-body-inner`}
            ref={refName}
            onMouseOver={this.detectScrollTarget}
            onTouchStart={this.detectScrollTarget}
            onScroll={this.handleBodyScroll}>
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

  getMaxColumnsPage() {
    const { columnsPageRange, columnsPageSize } = this.props;
    return Math.ceil((columnsPageRange[1] - columnsPageRange[0] + 1) / columnsPageSize) - 1;
  },

  goToColumnsPage(currentColumnsPage) {
    const maxColumnsPage = this.getMaxColumnsPage();
    let page = currentColumnsPage;
    if (page < 0) {
      page = 0;
    }
    if (page > maxColumnsPage) {
      page = maxColumnsPage;
    }
    this.setState({
      currentColumnsPage: page,
    });
  },

  syncFixedTableRowHeight() {
    const { prefixCls } = this.props;
    const headRows = this.refs.headTable ? this.refs.headTable.querySelectorAll(`tr`) : [];
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

  prevColumnsPage() {
    this.goToColumnsPage(this.state.currentColumnsPage - 1);
  },

  nextColumnsPage() {
    this.goToColumnsPage(this.state.currentColumnsPage + 1);
  },

  wrapPageColumn(column, hasPrev, hasNext) {
    const { prefixCls } = this.props;
    const { currentColumnsPage } = this.state;
    const maxColumnsPage = this.getMaxColumnsPage();
    let prevHandlerCls = `${prefixCls}-prev-columns-page`;
    if (currentColumnsPage === 0) {
      prevHandlerCls += ` ${prefixCls}-prev-columns-page-disabled`;
    }
    const prevHandler = <span className={prevHandlerCls} onClick={this.prevColumnsPage}></span>;
    let nextHandlerCls = `${prefixCls}-next-columns-page`;
    if (currentColumnsPage === maxColumnsPage) {
      nextHandlerCls += ` ${prefixCls}-next-columns-page-disabled`;
    }
    const nextHandler = <span className={nextHandlerCls} onClick={this.nextColumnsPage}></span>;
    if (hasPrev) {
      column.title = <span>{prevHandler}{column.title}</span>;
      column.className = (column.className || '') + ` ${prefixCls}-column-has-prev`;
    }
    if (hasNext) {
      column.title = <span>{column.title}{nextHandler}</span>;
      column.className = (column.className || '') + ` ${prefixCls}-column-has-next`;
    }
    return column;
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
    this.isAnyColumnsFixedCache = this.getCurrentColumns().some(column => !!column.fixed);
    return this.isAnyColumnsFixedCache;
  },

  isAnyColumnsLeftFixed() {
    if ('isAnyColumnsLeftFixedCache' in this) {
      return this.isAnyColumnsLeftFixedCache;
    }
    this.isAnyColumnsLeftFixedCache = this.getCurrentColumns().some(
      column => column.fixed === 'left' || column.fixed === true
    );
    return this.isAnyColumnsLeftFixedCache;
  },

  isAnyColumnsRightFixed() {
    if ('isAnyColumnsRightFixedCache' in this) {
      return this.isAnyColumnsRightFixedCache;
    }
    this.isAnyColumnsRightFixedCache = this.getCurrentColumns().some(column => column.fixed === 'right');
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
        e.target.children[0].getBoundingClientRect().width - e.target.getBoundingClientRect().width) {
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
    if (isHover) {
      this.setState({
        currentHoverKey: key,
      });
    } else {
      this.setState({
        currentHoverKey: null,
      });
    }
  },

  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;

    let className = props.prefixCls;
    if (props.className) {
      className += ' ' + props.className;
    }
    if (props.columnsPageRange) {
      className += ` ${prefixCls}-columns-paging`;
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
