import React from 'react';
import PropTypes from 'prop-types';
import shallowequal from 'shallowequal';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import { Provider, create } from 'mini-store';
import merge from 'lodash/merge';
import classes from 'component-classes';
import { polyfill } from 'react-lifecycles-compat';
import { debounce, warningOnce } from './utils';
import ColumnManager from './ColumnManager';
import HeadTable from './HeadTable';
import BodyTable from './BodyTable';
import ExpandableTable from './ExpandableTable';

class Table extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    useFixedHeader: PropTypes.bool,
    columns: PropTypes.array,
    prefixCls: PropTypes.string,
    bodyStyle: PropTypes.object,
    style: PropTypes.object,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    onRow: PropTypes.func,
    onHeaderRow: PropTypes.func,
    onRowClick: PropTypes.func,
    onRowDoubleClick: PropTypes.func,
    onRowContextMenu: PropTypes.func,
    onRowMouseEnter: PropTypes.func,
    onRowMouseLeave: PropTypes.func,
    showHeader: PropTypes.bool,
    title: PropTypes.func,
    id: PropTypes.string,
    footer: PropTypes.func,
    emptyText: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    scroll: PropTypes.object,
    rowRef: PropTypes.func,
    getBodyWrapper: PropTypes.func,
    children: PropTypes.node,
    components: PropTypes.shape({
      table: PropTypes.any,
      header: PropTypes.shape({
        wrapper: PropTypes.any,
        row: PropTypes.any,
        cell: PropTypes.any,
      }),
      body: PropTypes.shape({
        wrapper: PropTypes.any,
        row: PropTypes.any,
        cell: PropTypes.any,
      }),
    }),
    ...ExpandableTable.PropTypes,
  };

  static childContextTypes = {
    table: PropTypes.any,
    components: PropTypes.any,
  };

  static defaultProps = {
    data: [],
    useFixedHeader: false,
    rowKey: 'key',
    rowClassName: () => '',
    onRow() {},
    onHeaderRow() {},
    prefixCls: 'rc-table',
    bodyStyle: {},
    style: {},
    showHeader: true,
    scroll: {},
    rowRef: () => null,
    emptyText: () => 'No Data',
  };

  setScrollingStatus = (scrolling) => {
    this.store.setState({
       scrolling,
    })
  }

  calculateColumnWidths = () => {
    const { columns } = this.props;
    const idealRowWidth = columns.reduce((accu, { width }) => accu + (width || 40), 0);
    const valid = idealRowWidth >= this.bodyTable.offsetWidth;
    // make sure row width is larger than bodyTable
    const columnWidths = columns.map(
      ({ width = 40 }) => (valid ? width : this.bodyTable.offsetWidth / columns.length),
    );
    this.store.setState({
      rowWidth: valid ? idealRowWidth : this.bodyTable.offsetWidth,
      columnWidths,
    });
  };

  constructor(props) {
    super(props);

    [
      'onRowClick',
      'onRowDoubleClick',
      'onRowContextMenu',
      'onRowMouseEnter',
      'onRowMouseLeave',
    ].forEach(name => {
      warningOnce(props[name] === undefined, `${name} is deprecated, please use onRow instead.`);
    });

    warningOnce(
      props.getBodyWrapper === undefined,
      'getBodyWrapper is deprecated, please use custom components instead.',
    );

    this.columnManager = new ColumnManager(props.columns, props.children);
    const { virtualized, data } = props;

    const initialialStoreState = {
      scrolling: false,
      virtualized,
      firstRowIndex: 0,
      renderedNumber: 0,
      averageRowHeight: 40,
      lastRowIndex: data.length - 1,
      initialialTop: 0,
      rowHeight: {},
      currentHoverKey: null,
      fixedColumnsHeadRowsHeight: [],
      fixedColumnsBodyRowsHeight: {},
    };
    if (virtualized) {
      const { renderNumber, redundantNumber } = virtualized;
      let lastRowIndex = renderNumber + redundantNumber;
      if (!virtualized || isNaN(lastRowIndex) || lastRowIndex >= data.length) {
        lastRowIndex = data.length - 1;
      }
      initialialStoreState.lastRowIndex = lastRowIndex;
    }

    this.store = create(initialialStoreState);

    this.setScrollPosition('left');

    this.debouncedWindowResize = debounce(this.handleWindowResize, 150);
    this.debouncedSetScrollingStatus = debounce(this.setScrollingStatus, 100);
    this.debouncedSetScrollingStatusImmediate = debounce(this.setScrollingStatus, 150, true);
  }

  state = {};

  getVirtualizedRelatedRowStyles = renderData => {
    const { data, virtualized } = this.props;
    const {
      rowWidth,
      firstRowIndex,
      lastRowIndex,
      initialialTop,
      averageRowHeight,
      rowHeight,
    } = this.store.getState();
    let top = initialialTop;
    const position = virtualized ? 'absolute' : null;
    let i = firstRowIndex;
    const realLastRowIndex =
      lastRowIndex < renderData.length ? lastRowIndex : renderData.length - 1;
    const styles = []
    while (i <= realLastRowIndex) {
      const ret = {
        position,
        top,
        width: rowWidth,
      };
      const offset = rowHeight[this.getRowKey(data[i], i)];
      top += offset || averageRowHeight;
      styles[i] = ret;
      i += 1;
    }
    styles[i]={
        position,
        top,
        width: rowWidth,
      };
    return styles;
  };

  saveRowHeight = (id, height) => {
    const { averageRowHeight,renderedNumber, rowHeight } = this.store.getState();
    if(rowHeight[id]){
      this.store.setState({
        averageRowHeight: (renderedNumber * averageRowHeight-rowHeight[id]+height)/renderedNumber,
        rowHeight: { ...rowHeight, [id]: height },
      });
    }else{
    this.store.setState({
      averageRowHeight: (renderedNumber * averageRowHeight+height)/(renderedNumber+1),
      renderedNumber: renderedNumber+1,
      rowHeight: { ...rowHeight, [id]: height },
    });
    }
  };

  getChildContext() {
    return {
      table: {
        getVirtualizedRelatedRowStyles: this.getVirtualizedRelatedRowStyles,
        saveRowHeight: this.saveRowHeight,
        props: this.props,
        columnManager: this.columnManager,
        saveRef: this.saveRef,
        components: merge(
          {
            table: 'table',
            header: {
              wrapper: 'thead',
              row: 'tr',
              cell: 'th',
            },
            body: {
              wrapper: 'tbody',
              row: 'tr',
              cell: 'td',
            },
          },
          this.props.components,
        ),
      },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.columns && nextProps.columns !== prevState.columns) {
      return {
        columns: nextProps.columns,
        children: null,
      };
    } else if (nextProps.children !== prevState.children) {
      return {
        columns: null,
        children: nextProps.children,
      };
    }
    return null;
  }

  componentDidMount() {
    if (this.columnManager.isAnyColumnsFixed()) {
      this.handleWindowResize();
      this.resizeEvent = addEventListener(window, 'resize', this.debouncedWindowResize);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.columnManager.isAnyColumnsFixed()) {
      this.handleWindowResize();
      if (!this.resizeEvent) {
        this.resizeEvent = addEventListener(window, 'resize', this.debouncedWindowResize);
      }
    }
    // when table changes to empty, reset scrollLeft
    if (prevProps.data.length > 0 && this.props.data.length === 0 && this.hasScrollX()) {
      this.resetScrollX();
    }
    if (this.props.virtualized && !shallowequal(this.props.columns, prevProps.columns)) {
      this.calculateColumnWidths();
    }
    if (this.props.virtualized && this.props.data.length !== prevProps.data.length) {
      this.handleDataChange(prevProps);
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

  getRowKey = (record, index) => {
    const rowKey = this.props.rowKey;
    const key = typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey];
    warningOnce(
      key !== undefined,
      'Each record in table should have a unique `key` prop,' +
        'or set `rowKey` to an unique primary key.',
    );
    return key === undefined ? index : key;
  };

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
    const node = this.bodyTable;
    const scrollToLeft = node.scrollLeft === 0;
    const scrollToRight =
      node.scrollLeft + 1 >=
      node.children[0].getBoundingClientRect().width - node.getBoundingClientRect().width;
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
  };

  syncFixedTableRowHeight = () => {
    const tableRect = this.tableNode.getBoundingClientRect();
    // If tableNode's height less than 0, suppose it is hidden and don't recalculate rowHeight.
    // see: https://github.com/ant-design/ant-design/issues/4836
    if (tableRect.height !== undefined && tableRect.height <= 0) {
      return;
    }
    const { prefixCls } = this.props;
    const headRows = this.headTable
      ? this.headTable.querySelectorAll('thead')
      : this.bodyTable.querySelectorAll('thead');
    const bodyRows = this.bodyTable.querySelectorAll(`.${prefixCls}-row`) || [];
    const fixedColumnsHeadRowsHeight = [].map.call(
      headRows,
      row => row.getBoundingClientRect().height || 'auto',
    );
    const state = this.store.getState();
    const fixedColumnsBodyRowsHeight = [].reduce.call(
      bodyRows,
      (acc, row) => {
        const rowKey = row.getAttribute('data-row-key');
        const height =
          row.getBoundingClientRect().height || state.fixedColumnsBodyRowsHeight[rowKey] || 'auto';
        acc[rowKey] = height;
        return acc;
      },
      {},
    );
    if (
      shallowequal(state.fixedColumnsHeadRowsHeight, fixedColumnsHeadRowsHeight) &&
      shallowequal(state.fixedColumnsBodyRowsHeight, fixedColumnsBodyRowsHeight)
    ) {
      return;
    }

    this.store.setState({
      fixedColumnsHeadRowsHeight,
      fixedColumnsBodyRowsHeight,
    });
  };

  resetScrollX() {
    if (this.headTable) {
      this.headTable.scrollLeft = 0;
    }
    if (this.bodyTable) {
      this.bodyTable.scrollLeft = 0;
    }
  }

  hasScrollX() {
    const { scroll = {} } = this.props;
    return 'x' in scroll;
  }

  handleBodyScrollLeft = e => {
    // Fix https://github.com/ant-design/ant-design/issues/7635
    if (e.currentTarget !== e.target) {
      return;
    }
    const target = e.target;
    const { scroll = {} } = this.props;
    const { headTable, bodyTable } = this;
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
  };

  handleBodyScrollTop = e => {
    const target = e.target;
    // Fix https://github.com/ant-design/ant-design/issues/9033
    if (e.currentTarget !== target) {
      return;
    }
    const { scroll = {} } = this.props;
    const { headTable, bodyTable, fixedColumnsBodyLeft, fixedColumnsBodyRight } = this;
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
  };
  handleDataChange = prevProps => {
    const {
      virtualized: { redundantNumber, renderNumber },
      data,
    } = this.props;
    const { data: prevData } = prevProps;
    const { firstRowIndex, lastRowIndex } = this.store.getState();
    if (prevData.length > data.length && lastRowIndex >= data.length) {
      this.store.setState({
        lastRowIndex: data.length - 1,
      });
    } else if (
      prevData.length < data.length &&
      lastRowIndex - firstRowIndex + 1 <= renderNumber + redundantNumber * 2
    ) {
      const tmp = firstRowIndex + redundantNumber * 2 - 1;
      this.store.setState({
        lastRowIndex: tmp >= data.length ? data.length - 1 : tmp,
      });
    }
  };
  handleVerticalScroll = ({ target: { scrollTop } }) => {
    const { initialialTop:oldInitialTop, scrolling, rowHeight } = this.store.getState();
    const { virtualized, data } = this.props;
    const { loadMoreThreshold, loadMore, renderNumber, redundantNumber } = virtualized;
    let offset = scrollTop;
    let firstRowIndex = 0;
    while (offset > 0 && firstRowIndex < data.length) {
      offset = offset - rowHeight[this.getRowKey(data[firstRowIndex])];
      firstRowIndex += 1;
    }
    let initialialTop = scrollTop - offset;
    let i = 0;
    while (i < redundantNumber && firstRowIndex >= 0) {
      initialialTop -= rowHeight[this.getRowKey(data[firstRowIndex])];
      firstRowIndex -= 1;
      i += 1;
    }
    let lastRowIndex = firstRowIndex + renderNumber + redundantNumber;
    if (firstRowIndex < 0) {
      firstRowIndex = 0;
    }
    if (lastRowIndex >= data.length) {
      lastRowIndex = data.length - 1;
    }
    if (initialialTop < 0) {
      initialialTop = 0;
    }
    this.store.setState({
      firstRowIndex,
      lastRowIndex,
      initialialTop,
    });
    if(loadMore && initialialTop>oldInitialTop && lastRowIndex+loadMoreThreshold >= data.length){
      loadMore()
    }
    if(scrolling){
      this.debouncedSetScrollingStatus(false)
    } else if(Math.abs(oldInitialTop-initialialTop) > 500) {
      this.debouncedSetScrollingStatusImmediate(true)
    }
  };

  handleBodyScroll = e => {
    this.handleBodyScrollLeft(e);
    this.handleBodyScrollTop(e);
    if (this.props.virtualized) {
      this.handleVerticalScroll(e);
    }
  };

  handleWheel = event => {
    const { scroll = {} } = this.props;
    if (window.navigator.userAgent.match(/Trident\/7\./) && scroll.y) {
      event.preventDefault();
      const wd = event.deltaY;
      const target = event.target;
      const { bodyTable, fixedColumnsBodyLeft, fixedColumnsBodyRight } = this;
      let scrollTop = 0;

      if (this.lastScrollTop) {
        scrollTop = this.lastScrollTop + wd;
      } else {
        scrollTop = wd;
      }

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
  };

  saveRef = name => node => {
    this[name] = node;
  };

  renderMainTable() {
    const { scroll, prefixCls } = this.props;
    const isAnyColumnsFixed = this.columnManager.isAnyColumnsFixed();
    const scrollable = isAnyColumnsFixed || scroll.x || scroll.y;

    const table = [
      this.renderTable({
        columns: this.columnManager.groupedColumns(),
        isAnyColumnsFixed,
      }),
      this.renderEmptyText(),
      this.renderFooter(),
    ];

    return scrollable ? <div className={`${prefixCls}-scroll`}>{table}</div> : table;
  }

  renderLeftFixedTable() {
    const { prefixCls } = this.props;

    return (
      <div className={`${prefixCls}-fixed-left`}>
        {this.renderTable({
          columns: this.columnManager.leftColumns(),
          fixed: 'left',
        })}
      </div>
    );
  }

  renderRightFixedTable() {
    const { prefixCls } = this.props;

    return (
      <div className={`${prefixCls}-fixed-right`}>
        {this.renderTable({
          columns: this.columnManager.rightColumns(),
          fixed: 'right',
        })}
      </div>
    );
  }

  renderTable(options) {
    const { columns, fixed, isAnyColumnsFixed } = options;
    const { prefixCls, scroll = {} } = this.props;
    const tableClassName = scroll.x || fixed ? `${prefixCls}-fixed` : '';

    const headTable = (
      <HeadTable
        key="head"
        columns={columns}
        fixed={fixed}
        tableClassName={tableClassName}
        handleBodyScrollLeft={this.handleBodyScrollLeft}
        expander={this.expander}
      />
    );

    const bodyTable = (
      <BodyTable
        key="body"
        columns={columns}
        fixed={fixed}
        tableClassName={tableClassName}
        getRowKey={this.getRowKey}
        handleWheel={this.handleWheel}
        handleBodyScroll={this.handleBodyScroll}
        expander={this.expander}
        isAnyColumnsFixed={isAnyColumnsFixed}
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
        {typeof emptyText === 'function' ? emptyText() : emptyText}
      </div>
    );
  }

  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;

    if (this.state.columns) {
      this.columnManager.reset(props.columns);
    } else if (this.state.children) {
      this.columnManager.reset(null, props.children);
    }

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
    const hasLeftFixed = this.columnManager.isAnyColumnsLeftFixed();
    const hasRightFixed = this.columnManager.isAnyColumnsRightFixed();

    return (
      <Provider store={this.store}>
        <ExpandableTable {...props} columnManager={this.columnManager} getRowKey={this.getRowKey}>
          {expander => {
            this.expander = expander;
            return (
              <div
                ref={this.saveRef('tableNode')}
                className={className}
                style={props.style}
                id={props.id}
              >
                {this.renderTitle()}
                <div className={`${prefixCls}-content`}>
                  {this.renderMainTable()}
                  {hasLeftFixed && this.renderLeftFixedTable()}
                  {hasRightFixed && this.renderRightFixedTable()}
                </div>
              </div>
            );
          }}
        </ExpandableTable>
      </Provider>
    );
  }
}

polyfill(Table);

export default Table;
