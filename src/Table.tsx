import * as React from 'react';
import * as PropTypes from 'prop-types';
import shallowequal from 'shallowequal';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import warning from 'rc-util/lib/warning';
import { Provider, create } from 'mini-store';
import merge from 'lodash/merge';
import classes from 'component-classes';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import { debounce, getDataAndAriaProps } from './utils';
import ColumnManager from './ColumnManager';
import HeadTable from './HeadTable';
import BodyTable from './BodyTable';
import Column from './Column';
import ColumnGroup from './ColumnGroup';
import ExpandableTable, { ExpandableTableProps } from './ExpandableTable';
import {
  ColumnType,
  GetRowKey,
  GetComponentProps,
  LegacyFunction,
  TableComponents,
  TableStore,
  DefaultValueType,
  ScrollPosition,
  Expander,
} from './interface';

export interface TableProps<ValueType>
  extends Omit<ExpandableTableProps<ValueType>, 'prefixCls' | 'children'> {
  data?: ValueType[];
  useFixedHeader?: boolean;
  columns?: ColumnType[];
  prefixCls?: string;
  bodyStyle?: React.CSSProperties;
  className?: string;
  style?: React.CSSProperties;
  rowKey?: string | GetRowKey<ValueType>;
  rowClassName?: string | ((record: ValueType, index: number, indent: number) => string);
  onRow?: GetComponentProps<ValueType>;
  onHeaderRow?: GetComponentProps<ColumnType[]>;
  onRowClick?: LegacyFunction<ValueType>;
  onRowDoubleClick?: LegacyFunction<ValueType>;
  onRowContextMenu?: LegacyFunction<ValueType>;
  onRowMouseEnter?: LegacyFunction<ValueType>;
  onRowMouseLeave?: LegacyFunction<ValueType>;
  showHeader?: boolean;
  title?: (data: ValueType[]) => React.ReactNode;
  id?: string;
  footer?: (data: ValueType[]) => React.ReactNode;
  emptyText?: React.ReactNode | (() => React.ReactNode);
  scroll?: { x?: number | true | string; y?: number };
  rowRef?: (record: ValueType, index: number, indent: number) => React.Ref<React.ReactElement>;
  getBodyWrapper?: (body: React.ReactElement) => React.ReactElement;
  children?: React.ReactNode;
  components?: TableComponents;
  tableLayout?: 'fixed';
}

interface TableState {
  columns?: ColumnType[];
  children?: React.ReactNode;
}

class Table<ValueType> extends React.Component<TableProps<ValueType>, TableState> {
  static childContextTypes = {
    table: PropTypes.any,
    components: PropTypes.any,
  };

  static Column = Column;

  static ColumnGroup = ColumnGroup;

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

  constructor(props: TableProps<ValueType>) {
    super(props);

    [
      'onRowClick',
      'onRowDoubleClick',
      'onRowContextMenu',
      'onRowMouseEnter',
      'onRowMouseLeave',
    ].forEach(name => {
      warning(props[name] === undefined, `${name} is deprecated, please use onRow instead.`);
    });

    warning(
      props.getBodyWrapper === undefined,
      'getBodyWrapper is deprecated, please use custom components instead.',
    );

    this.columnManager = new ColumnManager(props.columns, props.children);

    this.store = create({
      currentHoverKey: null,
      fixedColumnsHeadRowsHeight: [],
      fixedColumnsBodyRowsHeight: {},
    });

    this.setScrollPosition('left');

    this.debouncedWindowResize = debounce(this.handleWindowResize, 150);
  }

  state: TableState = {};

  columnManager: ColumnManager;

  store: TableStore;

  debouncedWindowResize: Function & {
    cancel: Function;
  };

  resizeEvent: {
    remove: Function;
  };

  headTable: HTMLDivElement;

  bodyTable: HTMLDivElement;

  tableNode: HTMLDivElement;

  scrollPosition: ScrollPosition;

  lastScrollLeft: number;

  lastScrollTop: number;

  fixedColumnsBodyLeft: HTMLDivElement;

  fixedColumnsBodyRight: HTMLDivElement;

  expander: Expander;

  getChildContext() {
    return {
      table: {
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

  static getDerivedStateFromProps(nextProps: TableProps<DefaultValueType>, prevState: TableState) {
    if (nextProps.columns && nextProps.columns !== prevState.columns) {
      return {
        columns: nextProps.columns,
        children: null,
      };
    }

    if (nextProps.children !== prevState.children) {
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

    // https://github.com/ant-design/ant-design/issues/11635
    if (this.headTable) {
      this.headTable.scrollLeft = 0;
    }
    if (this.bodyTable) {
      this.bodyTable.scrollLeft = 0;
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
  }

  componentWillUnmount() {
    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }
    if (this.debouncedWindowResize) {
      this.debouncedWindowResize.cancel();
    }
  }

  getRowKey = (record: ValueType, index: number) => {
    const { rowKey } = this.props;
    const key = typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey];
    warning(
      key !== undefined,
      'Each record in table should have a unique `key` prop,' +
        'or set `rowKey` to an unique primary key.',
    );
    return key === undefined ? index : key;
  };

  setScrollPosition(position: ScrollPosition) {
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

  isTableLayoutFixed() {
    const { tableLayout, columns = [], useFixedHeader, scroll = {} } = this.props;
    if (typeof tableLayout !== 'undefined') {
      return tableLayout === 'fixed';
    }
    // if one column is ellipsis, use fixed table layout to fix align issue
    if (columns.some(({ ellipsis }) => !!ellipsis)) {
      return true;
    }
    // if header fixed, use fixed table layout to fix align issue
    if (useFixedHeader || scroll.y) {
      return true;
    }
    // if scroll.x is number/px/% width value, we should fixed table layout
    // to avoid long word layout broken issue
    if (scroll.x && scroll.x !== true && scroll.x !== 'max-content') {
      return true;
    }
    return false;
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
      (row: HTMLElement) => row.getBoundingClientRect().height || 'auto',
    );
    const state = this.store.getState();
    const fixedColumnsBodyRowsHeight = [].reduce.call(
      bodyRows,
      (acc: Record<string, number | 'auto'>, row: HTMLElement) => {
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

  handleBodyScrollLeft: React.UIEventHandler<HTMLDivElement> = e => {
    // Fix https://github.com/ant-design/ant-design/issues/7635
    if (e.currentTarget !== e.target) {
      return;
    }
    const target = e.target as HTMLDivElement;
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

  handleBodyScrollTop: React.UIEventHandler<HTMLDivElement> = e => {
    const target = e.target as HTMLDivElement;
    // Fix https://github.com/ant-design/ant-design/issues/9033
    if (e.currentTarget !== target) {
      return;
    }
    const { scroll = {} } = this.props;
    const { headTable, bodyTable, fixedColumnsBodyLeft, fixedColumnsBodyRight } = this;
    if (target.scrollTop !== this.lastScrollTop && scroll.y && target !== headTable) {
      const { scrollTop } = target;
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

  handleBodyScroll: React.UIEventHandler<HTMLDivElement> = e => {
    this.handleBodyScrollLeft(e);
    this.handleBodyScrollTop(e);
  };

  handleWheel: React.WheelEventHandler<HTMLDivElement> = event => {
    const { scroll = {} } = this.props;
    if (window.navigator.userAgent.match(/Trident\/7\./) && scroll.y) {
      const wd = event.deltaY;
      const { target } = event;
      const { bodyTable, fixedColumnsBodyLeft, fixedColumnsBodyRight } = this;
      let scrollTop = 0;

      if (this.lastScrollTop) {
        scrollTop = this.lastScrollTop + wd;
      } else {
        scrollTop = wd;
      }

      if (fixedColumnsBodyLeft && target !== fixedColumnsBodyLeft) {
        event.preventDefault();
        fixedColumnsBodyLeft.scrollTop = scrollTop;
      }
      if (fixedColumnsBodyRight && target !== fixedColumnsBodyRight) {
        event.preventDefault();
        fixedColumnsBodyRight.scrollTop = scrollTop;
      }
      if (bodyTable && target !== bodyTable) {
        // https://github.com/ant-design/ant-design/issues/22341
        event.preventDefault();
        bodyTable.scrollTop = scrollTop;
      }
    }
  };

  saveRef = (name: string) => (node: HTMLElement) => {
    this[name] = node;
  };

  saveTableNodeRef = (node: HTMLDivElement) => {
    this.tableNode = node;
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
    const { props } = this;
    const { prefixCls } = props;

    if (this.state.columns) {
      this.columnManager.reset(props.columns);
    } else if (this.state.children) {
      this.columnManager.reset(null, props.children);
    }

    const tableClassName = classNames(props.prefixCls, props.className, {
      [`${prefixCls}-fixed-header`]: props.useFixedHeader || (props.scroll && props.scroll.y),
      [`${prefixCls}-scroll-position-left ${prefixCls}-scroll-position-right`]:
        this.scrollPosition === 'both',
      [`${prefixCls}-scroll-position-${this.scrollPosition}`]: this.scrollPosition !== 'both',
      [`${prefixCls}-layout-fixed`]: this.isTableLayoutFixed(),
    });

    const hasLeftFixed = this.columnManager.isAnyColumnsLeftFixed();
    const hasRightFixed = this.columnManager.isAnyColumnsRightFixed();
    const dataAndAriaProps = getDataAndAriaProps(props);

    return (
      <Provider store={this.store}>
        <ExpandableTable {...props} columnManager={this.columnManager} getRowKey={this.getRowKey}>
          {(expander: Expander) => {
            this.expander = expander;
            return (
              <div
                ref={this.saveTableNodeRef}
                className={tableClassName}
                style={props.style}
                id={props.id}
                {...dataAndAriaProps}
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
