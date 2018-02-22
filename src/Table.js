import React from "react";
import PropTypes from "prop-types";
import { debounce, warningOnce } from "./utils";
import shallowequal from "shallowequal";
import addEventListener from "rc-util/lib/Dom/addEventListener";
import { Provider, create } from "mini-store";
import merge from "lodash.merge";
import ColumnManager from "./ColumnManager";
import classes from "component-classes";
import HeadTable from "./HeadTable";
import BodyTable from "./BodyTable";
import FootTable from "./FootTable";
import ExpandableTable from "./ExpandableTable";

export default class Table extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    useFixedHeader: PropTypes.bool,
    useFixedFooter: PropTypes.bool,
    columns: PropTypes.array,
    prefixCls: PropTypes.string,
    bodyStyle: PropTypes.object,
    style: PropTypes.object,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    onRow: PropTypes.func,
    onHeaderRow: PropTypes.func,
    onFooterRow: PropTypes.func,
    onRowClick: PropTypes.func,
    onRowDoubleClick: PropTypes.func,
    onRowContextMenu: PropTypes.func,
    onRowMouseEnter: PropTypes.func,
    onRowMouseLeave: PropTypes.func,
    showHeader: PropTypes.bool,
    showFooter: PropTypes.bool,
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
        cell: PropTypes.any
      }),
      body: PropTypes.shape({
        wrapper: PropTypes.any,
        row: PropTypes.any,
        cell: PropTypes.any
      }),
      footer: PropTypes.shape({
        wrapper: PropTypes.any,
        row: PropTypes.any,
        cell: PropTypes.any
      })
    }),
    ...ExpandableTable.PropTypes
  };

  static childContextTypes = {
    table: PropTypes.any,
    components: PropTypes.any
  };

  static defaultProps = {
    data: [],
    useFixedHeader: false,
    useFixedFooter: false,
    rowKey: "key",
    rowClassName: () => "",
    onRow() {},
    onHeaderRow() {},
    onFooterRow() {},
    prefixCls: "rc-table",
    bodyStyle: {},
    style: {},
    showHeader: true,
    showFooter: true,
    scroll: {},
    rowRef: () => null,
    emptyText: () => "No Data"
  };

  constructor(props) {
    super(props);

    ["onRowClick", "onRowDoubleClick", "onRowContextMenu", "onRowMouseEnter", "onRowMouseLeave"].forEach(name => {
      warningOnce(props[name] === undefined, `${name} is deprecated, please use onRow instead.`);
    });

    warningOnce(
      props.getBodyWrapper === undefined,
      "getBodyWrapper is deprecated, please use custom components instead."
    );

    this.columnManager = new ColumnManager(props.columns, props.children);

    this.store = create({
      currentHoverKey: null,
      fixedColumnsHeadRowsHeight: [],
      fixedColumnsBodyRowsHeight: [],
      fixedColumnsFootRowsHeight: []
    });

    this.setScrollPosition("left");

    this.debouncedWindowResize = debounce(this.handleWindowResize, 150);
  }

  getChildContext() {
    return {
      table: {
        props: this.props,
        columnManager: this.columnManager,
        saveRef: this.saveRef,
        components: merge(
          {
            table: "table",
            header: {
              wrapper: "thead",
              row: "tr",
              cell: "th"
            },
            body: {
              wrapper: "tbody",
              row: "tr",
              cell: "td"
            },
            footer: {
              wrapper: "tfoot",
              row: "tr",
              cell: "th"
            }
          },
          this.props.components
        )
      }
    };
  }

  componentDidMount() {
    if (this.columnManager.isAnyColumnsFixed()) {
      this.handleWindowResize();
      this.resizeEvent = addEventListener(window, "resize", this.debouncedWindowResize);
    }
  }

  componentWillReceiveProps(nextProps) {
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
        this.resizeEvent = addEventListener(window, "resize", this.debouncedWindowResize);
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

  getRowKey = (record, index) => {
    const rowKey = this.props.rowKey;
    const key = typeof rowKey === "function" ? rowKey(record, index) : record[rowKey];
    warningOnce(
      key !== undefined,
      "Each record in table should have a unique `key` prop," + "or set `rowKey` to an unique primary key."
    );
    return key === undefined ? index : key;
  };

  setScrollPosition(position) {
    this.scrollPosition = position;
    if (this.tableNode) {
      const { prefixCls } = this.props;
      if (position === "both") {
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
      node.scrollLeft + 1 >= node.children[0].getBoundingClientRect().width - node.getBoundingClientRect().width;
    if (scrollToLeft && scrollToRight) {
      this.setScrollPosition("both");
    } else if (scrollToLeft) {
      this.setScrollPosition("left");
    } else if (scrollToRight) {
      this.setScrollPosition("right");
    } else if (this.scrollPosition !== "middle") {
      this.setScrollPosition("middle");
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
      ? this.headTable.querySelectorAll("thead")
      : this.bodyTable.querySelectorAll("thead");
    const footRows = this.footTable
      ? this.footTable.querySelectorAll("tfoot")
      : this.bodyTable.querySelectorAll("tfoot");
    const bodyRows = this.bodyTable.querySelectorAll(`.${prefixCls}-row`) || [];
    const fixedColumnsHeadRowsHeight = [].map.call(headRows, row => row.getBoundingClientRect().height || "auto");
    const fixedColumnsBodyRowsHeight = [].map.call(bodyRows, row => row.getBoundingClientRect().height || "auto");
    const fixedColumnsFootRowsHeight = [].map.call(footRows, row => row.getBoundingClientRect().height || "auto");
    const state = this.store.getState();
    if (
      shallowequal(state.fixedColumnsHeadRowsHeight, fixedColumnsHeadRowsHeight) &&
      shallowequal(state.fixedColumnsFootRowsHeight, fixedColumnsFootRowsHeight) &&
      shallowequal(state.fixedColumnsBodyRowsHeight, fixedColumnsBodyRowsHeight)
    ) {
      return;
    }

    this.store.setState({
      fixedColumnsHeadRowsHeight,
      fixedColumnsBodyRowsHeight,
      fixedColumnsFootRowsHeight
    });
  };

  resetScrollX() {
    if (this.headTable) {
      this.headTable.scrollLeft = 0;
    }
    if (this.bodyTable) {
      this.bodyTable.scrollLeft = 0;
    }
    if (this.footTable) {
      this.footTable.scrollLeft = 0;
    }
  }

  hasScrollX() {
    const { scroll = {} } = this.props;
    return "x" in scroll;
  }

  handleBodyScrollLeft = e => {
    // Fix https://github.com/ant-design/ant-design/issues/7635
    if (e.currentTarget !== e.target) {
      return;
    }
    const target = e.target;
    const { scroll = {} } = this.props;
    const { headTable, bodyTable, footTable } = this;
    if (target.scrollLeft !== this.lastScrollLeft && scroll.x) {
      if (target === bodyTable) {
        if (headTable) {
          headTable.scrollLeft = target.scrollLeft;
        }
        if (footTable) {
          footTable.scrollLeft = target.scrollLeft;
        }
      } else if (target === headTable) {
        if (bodyTable) {
          bodyTable.scrollLeft = target.scrollLeft;
        }
        if (footTable) {
          footTable.scrollLeft = target.scrollLeft;
        }
      } else if (target === footTable && bodyTable) {
        if (bodyTable) {
          bodyTable.scrollLeft = target.scrollLeft;
        }
        if (headTable) {
          headTable.scrollLeft = target.scrollLeft;
        }
      }
      this.setScrollPositionClassName();
    }
    // Remember last scrollLeft for scroll direction detecting.
    this.lastScrollLeft = target.scrollLeft;
  };

  handleBodyScrollTop = e => {
    const target = e.target;
    const { scroll = {} } = this.props;
    const { headTable, bodyTable, footTable, fixedColumnsBodyLeft, fixedColumnsBodyRight } = this;
    if (target.scrollTop !== this.lastScrollTop && scroll.y && target !== headTable && target !== footTable) {
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

  handleBodyScroll = e => {
    this.handleBodyScrollLeft(e);
    this.handleBodyScrollTop(e);
  };

  saveRef = name => node => {
    this[name] = node;
  };

  renderMainTable() {
    const { scroll, prefixCls } = this.props;
    const scrollable = this.columnManager.isAnyColumnsFixed() || scroll.x || scroll.y;

    const table = [
      this.renderTable({
        columns: this.columnManager.groupedColumns()
      }),
      this.renderEmptyText(),
      this.renderFooter()
    ];

    return scrollable ? <div className={`${prefixCls}-scroll`}>{table}</div> : table;
  }

  renderLeftFixedTable() {
    const { prefixCls } = this.props;

    return (
      <div className={`${prefixCls}-fixed-left`}>
        {this.renderTable({
          columns: this.columnManager.leftColumns(),
          fixed: "left"
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
          fixed: "right"
        })}
      </div>
    );
  }

  renderTable(options) {
    const { columns, fixed } = options;
    const { prefixCls, scroll = {}, data } = this.props;
    const tableClassName = scroll.x || fixed ? `${prefixCls}-fixed` : "";

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
        handleBodyScroll={this.handleBodyScroll}
        expander={this.expander}
      />
    );

    const result = [headTable, bodyTable];

    if (data.length) {
      const footTable = (
        <FootTable
          key="foot"
          columns={columns}
          fixed={fixed}
          tableClassName={tableClassName}
          handleBodyScrollLeft={this.handleBodyScrollLeft}
          expander={this.expander}
        />
      );
      result.push(footTable);
    }

    return result;
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
        {typeof emptyText === "function" ? emptyText() : emptyText}
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
    if (props.useFixedFooter || (props.scroll && props.scroll.y)) {
      className += ` ${prefixCls}-fixed-footer`;
    }
    if (this.scrollPosition === "both") {
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
              <div ref={this.saveRef("tableNode")} className={className} style={props.style} id={props.id}>
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
