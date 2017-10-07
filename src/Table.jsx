import React from 'react';
import PropTypes from 'prop-types';
import { debounce, warningOnce } from './utils';
import shallowequal from 'shallowequal';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import ColumnManager from './ColumnManager';
import createStore from './createStore';
import classes from 'component-classes';
import HeadTable from './HeadTable';
import BodyTable from './BodyTable';

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
    rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    expandedRowClassName: PropTypes.func,
    childrenColumnName: PropTypes.string,
    onExpand: PropTypes.func,
    onExpandedRowsChange: PropTypes.func,
    indentSize: PropTypes.number,
    onRowClick: PropTypes.func,
    onRowDoubleClick: PropTypes.func,
    onRowContextMenu: PropTypes.func,
    onRowMouseEnter: PropTypes.func,
    onRowMouseLeave: PropTypes.func,
    expandIconColumnIndex: PropTypes.number,
    showHeader: PropTypes.bool,
    title: PropTypes.func,
    footer: PropTypes.func,
    emptyText: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    scroll: PropTypes.object,
    rowRef: PropTypes.func,
    getBodyWrapper: PropTypes.func,
    children: PropTypes.node,
  }

  static childContextTypes = {
    table: PropTypes.any,
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
    onRowContextMenu() {},
    onRowMouseEnter() {},
    onRowMouseLeave() {},
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
    this.store = createStore({
      currentHoverKey: null,
      expandedRowsHeight: {},
    });
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
    this.debouncedWindowResize = debounce(this.handleWindowResize, 150);
  }

  getChildContext() {
    return {
      table: {
        props: this.props,
        state: this.state,
        store: this.store,
        columnManager: this.columnManager,
        getRowKey: this.getRowKey,
        isRowExpanded: this.isRowExpanded,
        onExpanded: this.onExpanded,
        onRowDestroy: this.onRowDestroy,
      },
    };
  }

  componentDidMount() {
    if (this.columnManager.isAnyColumnsFixed()) {
      this.handleWindowResize();
      this.resizeEvent = addEventListener(
        window, 'resize', this.debouncedWindowResize
      );
    }
  }

  componentWillReceiveProps(nextProps) {
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

  componentDidUpdate(prevProps) {
    if (this.columnManager.isAnyColumnsFixed()) {
      this.handleWindowResize();
      if (!this.resizeEvent) {
        this.resizeEvent = addEventListener(
          window, 'resize', this.debouncedWindowResize
        );
      }
    }
    // when table changes to empty, reset scrollLeft
    if (prevProps.data.length > 0 && this.props.data.length === 0 && this.hasScrollX()) {
      this.resetScrollX();
    }
  }

  componentWillUnmount() {
    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }
    if (this.debouncedWindowResize) {
      this.debouncedWindowResize.cancel();
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

  getRowKey = (record, index) => {
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

  getRows = (columns, fixed) => {
    return this.getRowsByData(this.props.data, true, 0, columns, fixed);
  }

  setScrollPosition(position) {
    this.scrollPosition = position;
    if (this.tableNode) {
      const { prefixCls } = this.props;
      if (position === 'both') {
        classes(this.tableNode)
          .remove(new RegExp(`^${prefixCls}-scroll-position-.+$`))
          .add(`${prefixCls}-scroll-position-left`)
          .add(`${prefixCls}-scroll-position-right`);
      } else {
        classes(this.tableNode)
          .remove(new RegExp(`^${prefixCls}-scroll-position-.+$`))
          .add(`${prefixCls}-scroll-position-${position}`);
      }
    }
  }

  setScrollPositionClassName() {
    const node = this.refs.bodyTable;
    const scrollToLeft = node.scrollLeft === 0;
    const scrollToRight = node.scrollLeft + 1 >=
      node.children[0].getBoundingClientRect().width -
      node.getBoundingClientRect().width;
    if (scrollToLeft && scrollToRight) {
      this.setScrollPosition('both');
    } else if (scrollToLeft) {
      this.setScrollPosition('left');
    } else if (scrollToRight) {
      this.setScrollPosition('right');
    } else if (this.scrollPosition !== 'middle') {
      this.setScrollPosition('middle');
    }
  }

  handleWindowResize = () => {
    this.syncFixedTableRowHeight();
    this.setScrollPositionClassName();
  }

  syncFixedTableRowHeight = () => {
    const tableRect = this.tableNode.getBoundingClientRect();
    // If tableNode's height less than 0, suppose it is hidden and don't recalculate rowHeight.
    // see: https://github.com/ant-design/ant-design/issues/4836
    if (tableRect.height !== undefined && tableRect.height <= 0) {
      return;
    }
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

  isRowExpanded = (record, index) => {
    return typeof this.findExpandedRow(record, index) !== 'undefined';
  }

  hasScrollX() {
    const { scroll = {} } = this.props;
    return 'x' in scroll;
  }

  handleBodyScrollLeft = (e) => {
    // Fix https://github.com/ant-design/ant-design/issues/7635
    if (e.currentTarget !== e.target) {
      return;
    }
    const target = e.target;
    const { scroll = {} } = this.props;
    const { headTable, bodyTable } = this.refs;
    if (target.scrollLeft !== this.lastScrollLeft && scroll.x) {
      if (target === bodyTable && headTable) {
        headTable.scrollLeft = target.scrollLeft;
      } else if (target === headTable && bodyTable) {
        bodyTable.scrollLeft = target.scrollLeft;
      }
      this.setScrollPositionClassName();
    }
    // Remember last scrollLeft for scroll direction detecting.
    this.lastScrollLeft = target.scrollLeft;
  }

  handleBodyScrollTop = (e) => {
    const target = e.target;
    const { scroll = {} } = this.props;
    const { headTable, bodyTable, fixedColumnsBodyLeft, fixedColumnsBodyRight } = this.refs;
    if (target.scrollTop !== this.lastScrollTop && scroll.y && target !== headTable) {
      const scrollTop = target.scrollTop;
      if (fixedColumnsBodyLeft && target !== fixedColumnsBodyLeft) {
        fixedColumnsBodyLeft.scrollTop = scrollTop;
      }
      if (fixedColumnsBodyRight && target !== fixedColumnsBodyRight) {
        fixedColumnsBodyRight.scrollTop = scrollTop;
      }
      if (bodyTable && target !== bodyTable) {
        bodyTable.scrollTop = scrollTop;
      }
    }
    // Remember last scrollTop for scroll direction detecting.
    this.lastScrollTop = target.scrollTop;
  }

  handleBodyScroll = (e) => {
    this.handleBodyScrollLeft(e);
    this.handleBodyScrollTop(e);
  }

  renderLeftFixedTable() {
    return this.renderTable({
      columns: this.columnManager.leftColumns(),
      fixed: 'left',
    });
  }

  renderRightFixedTable() {
    return this.renderTable({
      columns: this.columnManager.rightColumns(),
      fixed: 'right',
    });
  }

  renderTable(options = {}) {
    const { columns, fixed } = options;
    const { prefixCls, scroll = {} } = this.props;
    const tableClassName = (scroll.x || fixed) ? `${prefixCls}-fixed` : '';

    const headTable = (
      <HeadTable
        key="head"
        columns={columns}
        fixed={fixed}
        tableClassName={tableClassName}
        handleBodyScrollLeft={this.handleBodyScrollLeft}
      />
    );

    const bodyTable = (
      <BodyTable
        key="body"
        columns={columns}
        fixed={fixed}
        tableClassName={tableClassName}
        handleBodyScroll={this.handleBodyScroll}
      />
    );

    return [headTable, bodyTable];
  }

  renderTitle() {
    const { title, prefixCls } = this.props;
    return title ? (
      <div className={`${prefixCls}-title`} key="title">
        {title(this.props.data)}
      </div>
    ) : null;
  }

  renderFooter() {
    const { footer, prefixCls } = this.props;
    return footer ? (
      <div className={`${prefixCls}-footer`} key="footer">
        {footer(this.props.data)}
      </div>
    ) : null;
  }

  renderEmptyText() {
    const { emptyText, prefixCls, data } = this.props;
    if (data.length) {
      return null;
    }
    const emptyClassName = `${prefixCls}-placeholder`;
    return (
      <div className={emptyClassName} key="emptyText">
        {(typeof emptyText === 'function') ? emptyText() : emptyText}
      </div>
    );
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
    if (this.scrollPosition === 'both') {
      className += ` ${prefixCls}-scroll-position-left ${prefixCls}-scroll-position-right`;
    } else {
      className += ` ${prefixCls}-scroll-position-${this.scrollPosition}`;
    }

    const isTableScroll =
      this.columnManager.isAnyColumnsFixed() || props.scroll.x || props.scroll.y;

    const content = [
      this.renderTable({ columns: this.columnManager.groupedColumns() }),
      this.renderEmptyText(),
      this.renderFooter(),
    ];

    const scrollTable = isTableScroll
      ? <div className={`${prefixCls}-scroll`}>{content}</div>
      : content;

    return (
      <div ref={node => (this.tableNode = node)} className={className} style={props.style}>
        {this.renderTitle()}
        <div className={`${prefixCls}-content`}>
          {scrollTable}
          {this.columnManager.isAnyColumnsLeftFixed() &&
          <div className={`${prefixCls}-fixed-left`}>
            {this.renderLeftFixedTable()}
          </div>}
          {this.columnManager.isAnyColumnsRightFixed() &&
          <div className={`${prefixCls}-fixed-right`}>
            {this.renderRightFixedTable()}
          </div>}
        </div>
      </div>
    );
  }
}
