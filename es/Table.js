import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import shallowequal from 'shallowequal';
import addEventListener from 'rc-util/es/Dom/addEventListener';
import { Provider, create } from 'mini-store';
import merge from 'lodash/merge';
import classes from 'component-classes';
import { polyfill } from 'react-lifecycles-compat';
import { debounce, warningOnce, getDataAndAriaProps } from './utils';
import ColumnManager from './ColumnManager';
import HeadTable from './HeadTable';
import BodyTable from './BodyTable';
import ExpandableTable from './ExpandableTable';

var Table = function (_React$Component) {
  _inherits(Table, _React$Component);

  function Table(props) {
    _classCallCheck(this, Table);

    var _this = _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, props));

    _this.state = {};

    _this.getRowKey = function (record, index) {
      var rowKey = _this.props.rowKey;
      var key = typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey];
      warningOnce(key !== undefined, 'Each record in table should have a unique `key` prop,' + 'or set `rowKey` to an unique primary key.');
      return key === undefined ? index : key;
    };

    _this.handleWindowResize = function () {
      _this.syncFixedTableRowHeight();
      _this.setScrollPositionClassName();
    };

    _this.syncFixedTableRowHeight = function () {
      var tableRect = _this.tableNode.getBoundingClientRect();
      // If tableNode's height less than 0, suppose it is hidden and don't recalculate rowHeight.
      // see: https://github.com/ant-design/ant-design/issues/4836
      if (tableRect.height !== undefined && tableRect.height <= 0) {
        return;
      }
      var prefixCls = _this.props.prefixCls;

      var headRows = _this.headTable ? _this.headTable.querySelectorAll('thead') : _this.bodyTable.querySelectorAll('thead');
      var bodyRows = _this.bodyTable.querySelectorAll('.' + prefixCls + '-row') || [];
      var fixedColumnsHeadRowsHeight = [].map.call(headRows, function (row) {
        return row.getBoundingClientRect().height || 'auto';
      });
      var state = _this.store.getState();
      var fixedColumnsBodyRowsHeight = [].reduce.call(bodyRows, function (acc, row) {
        var rowKey = row.getAttribute('data-row-key');
        var height = row.getBoundingClientRect().height || state.fixedColumnsBodyRowsHeight[rowKey] || 'auto';
        acc[rowKey] = height;
        return acc;
      }, {});
      if (shallowequal(state.fixedColumnsHeadRowsHeight, fixedColumnsHeadRowsHeight) && shallowequal(state.fixedColumnsBodyRowsHeight, fixedColumnsBodyRowsHeight)) {
        return;
      }

      _this.store.setState({
        fixedColumnsHeadRowsHeight: fixedColumnsHeadRowsHeight,
        fixedColumnsBodyRowsHeight: fixedColumnsBodyRowsHeight
      });
    };

    _this.handleBodyScrollLeft = function (e) {
      // Fix https://github.com/ant-design/ant-design/issues/7635
      if (e.currentTarget !== e.target) {
        return;
      }
      var target = e.target;
      var _this$props$scroll = _this.props.scroll,
          scroll = _this$props$scroll === undefined ? {} : _this$props$scroll;
      var headTable = _this.headTable,
          bodyTable = _this.bodyTable;

      if (target.scrollLeft !== _this.lastScrollLeft && scroll.x) {
        if (target === bodyTable && headTable) {
          headTable.scrollLeft = target.scrollLeft;
        } else if (target === headTable && bodyTable) {
          bodyTable.scrollLeft = target.scrollLeft;
        }
        _this.setScrollPositionClassName();
      }
      // Remember last scrollLeft for scroll direction detecting.
      _this.lastScrollLeft = target.scrollLeft;
    };

    _this.handleBodyScrollTop = function (e) {
      var target = e.target;
      // Fix https://github.com/ant-design/ant-design/issues/9033
      if (e.currentTarget !== target) {
        return;
      }
      var _this$props$scroll2 = _this.props.scroll,
          scroll = _this$props$scroll2 === undefined ? {} : _this$props$scroll2;
      var headTable = _this.headTable,
          bodyTable = _this.bodyTable,
          fixedColumnsBodyLeft = _this.fixedColumnsBodyLeft,
          fixedColumnsBodyRight = _this.fixedColumnsBodyRight;

      if (target.scrollTop !== _this.lastScrollTop && scroll.y && target !== headTable) {
        var scrollTop = target.scrollTop;
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
      _this.lastScrollTop = target.scrollTop;
    };

    _this.handleBodyScroll = function (e) {
      _this.handleBodyScrollLeft(e);
      _this.handleBodyScrollTop(e);
    };

    _this.handleWheel = function (event) {
      var _this$props$scroll3 = _this.props.scroll,
          scroll = _this$props$scroll3 === undefined ? {} : _this$props$scroll3;

      if (window.navigator.userAgent.match(/Trident\/7\./) && scroll.y) {
        event.preventDefault();
        var wd = event.deltaY;
        var target = event.target;
        var bodyTable = _this.bodyTable,
            fixedColumnsBodyLeft = _this.fixedColumnsBodyLeft,
            fixedColumnsBodyRight = _this.fixedColumnsBodyRight;

        var scrollTop = 0;

        if (_this.lastScrollTop) {
          scrollTop = _this.lastScrollTop + wd;
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

    _this.saveRef = function (name) {
      return function (node) {
        _this[name] = node;
      };
    };

    ['onRowClick', 'onRowDoubleClick', 'onRowContextMenu', 'onRowMouseEnter', 'onRowMouseLeave'].forEach(function (name) {
      warningOnce(props[name] === undefined, name + ' is deprecated, please use onRow instead.');
    });

    warningOnce(props.getBodyWrapper === undefined, 'getBodyWrapper is deprecated, please use custom components instead.');

    _this.columnManager = new ColumnManager(props.columns, props.children);

    _this.store = create({
      currentHoverKey: null,
      fixedColumnsHeadRowsHeight: [],
      fixedColumnsBodyRowsHeight: {}
    });

    _this.setScrollPosition('left');

    _this.debouncedWindowResize = debounce(_this.handleWindowResize, 150);
    return _this;
  }

  _createClass(Table, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        table: {
          props: this.props,
          columnManager: this.columnManager,
          saveRef: this.saveRef,
          components: merge({
            table: 'table',
            header: {
              wrapper: 'thead',
              row: 'tr',
              cell: 'th'
            },
            body: {
              wrapper: 'tbody',
              row: 'tr',
              cell: 'td'
            }
          }, this.props.components)
        }
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
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
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
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
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.resizeEvent) {
        this.resizeEvent.remove();
      }
      if (this.debouncedWindowResize) {
        this.debouncedWindowResize.cancel();
      }
    }
  }, {
    key: 'setScrollPosition',
    value: function setScrollPosition(position) {
      this.scrollPosition = position;
      if (this.tableNode) {
        var prefixCls = this.props.prefixCls;

        if (position === 'both') {
          classes(this.tableNode).remove(new RegExp('^' + prefixCls + '-scroll-position-.+$')).add(prefixCls + '-scroll-position-left').add(prefixCls + '-scroll-position-right');
        } else {
          classes(this.tableNode).remove(new RegExp('^' + prefixCls + '-scroll-position-.+$')).add(prefixCls + '-scroll-position-' + position);
        }
      }
    }
  }, {
    key: 'setScrollPositionClassName',
    value: function setScrollPositionClassName() {
      var node = this.bodyTable;
      var scrollToLeft = node.scrollLeft === 0;
      var scrollToRight = node.scrollLeft + 1 >= node.children[0].getBoundingClientRect().width - node.getBoundingClientRect().width;
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
  }, {
    key: 'resetScrollX',
    value: function resetScrollX() {
      if (this.headTable) {
        this.headTable.scrollLeft = 0;
      }
      if (this.bodyTable) {
        this.bodyTable.scrollLeft = 0;
      }
    }
  }, {
    key: 'hasScrollX',
    value: function hasScrollX() {
      var _props$scroll = this.props.scroll,
          scroll = _props$scroll === undefined ? {} : _props$scroll;

      return 'x' in scroll;
    }
  }, {
    key: 'renderMainTable',
    value: function renderMainTable() {
      var _props = this.props,
          scroll = _props.scroll,
          prefixCls = _props.prefixCls;

      var isAnyColumnsFixed = this.columnManager.isAnyColumnsFixed();
      var scrollable = isAnyColumnsFixed || scroll.x || scroll.y;

      var table = [this.renderTable({
        columns: this.columnManager.groupedColumns(),
        isAnyColumnsFixed: isAnyColumnsFixed
      }), this.renderEmptyText(), this.renderFooter()];

      return scrollable ? React.createElement(
        'div',
        { className: prefixCls + '-scroll' },
        table
      ) : table;
    }
  }, {
    key: 'renderLeftFixedTable',
    value: function renderLeftFixedTable() {
      var prefixCls = this.props.prefixCls;


      return React.createElement(
        'div',
        { className: prefixCls + '-fixed-left' },
        this.renderTable({
          columns: this.columnManager.leftColumns(),
          fixed: 'left'
        })
      );
    }
  }, {
    key: 'renderRightFixedTable',
    value: function renderRightFixedTable() {
      var prefixCls = this.props.prefixCls;


      return React.createElement(
        'div',
        { className: prefixCls + '-fixed-right' },
        this.renderTable({
          columns: this.columnManager.rightColumns(),
          fixed: 'right'
        })
      );
    }
  }, {
    key: 'renderTable',
    value: function renderTable(options) {
      var columns = options.columns,
          fixed = options.fixed,
          isAnyColumnsFixed = options.isAnyColumnsFixed;
      var _props2 = this.props,
          prefixCls = _props2.prefixCls,
          _props2$scroll = _props2.scroll,
          scroll = _props2$scroll === undefined ? {} : _props2$scroll;

      var tableClassName = scroll.x || fixed ? prefixCls + '-fixed' : '';

      var headTable = React.createElement(HeadTable, {
        key: 'head',
        columns: columns,
        fixed: fixed,
        tableClassName: tableClassName,
        handleBodyScrollLeft: this.handleBodyScrollLeft,
        expander: this.expander
      });

      var bodyTable = React.createElement(BodyTable, {
        key: 'body',
        columns: columns,
        fixed: fixed,
        tableClassName: tableClassName,
        getRowKey: this.getRowKey,
        handleWheel: this.handleWheel,
        handleBodyScroll: this.handleBodyScroll,
        expander: this.expander,
        isAnyColumnsFixed: isAnyColumnsFixed
      });

      return [headTable, bodyTable];
    }
  }, {
    key: 'renderTitle',
    value: function renderTitle() {
      var _props3 = this.props,
          title = _props3.title,
          prefixCls = _props3.prefixCls;

      return title ? React.createElement(
        'div',
        { className: prefixCls + '-title', key: 'title' },
        title(this.props.data)
      ) : null;
    }
  }, {
    key: 'renderFooter',
    value: function renderFooter() {
      var _props4 = this.props,
          footer = _props4.footer,
          prefixCls = _props4.prefixCls;

      return footer ? React.createElement(
        'div',
        { className: prefixCls + '-footer', key: 'footer' },
        footer(this.props.data)
      ) : null;
    }
  }, {
    key: 'renderEmptyText',
    value: function renderEmptyText() {
      var _props5 = this.props,
          emptyText = _props5.emptyText,
          prefixCls = _props5.prefixCls,
          data = _props5.data;

      if (data.length) {
        return null;
      }
      var emptyClassName = prefixCls + '-placeholder';
      return React.createElement(
        'div',
        { className: emptyClassName, key: 'emptyText' },
        typeof emptyText === 'function' ? emptyText() : emptyText
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var props = this.props;
      var prefixCls = props.prefixCls;

      if (this.state.columns) {
        this.columnManager.reset(props.columns);
      } else if (this.state.children) {
        this.columnManager.reset(null, props.children);
      }

      var className = props.prefixCls;
      if (props.className) {
        className += ' ' + props.className;
      }
      if (props.useFixedHeader || props.scroll && props.scroll.y) {
        className += ' ' + prefixCls + '-fixed-header';
      }
      if (this.scrollPosition === 'both') {
        className += ' ' + prefixCls + '-scroll-position-left ' + prefixCls + '-scroll-position-right';
      } else {
        className += ' ' + prefixCls + '-scroll-position-' + this.scrollPosition;
      }
      var hasLeftFixed = this.columnManager.isAnyColumnsLeftFixed();
      var hasRightFixed = this.columnManager.isAnyColumnsRightFixed();
      var dataAndAriaProps = getDataAndAriaProps(props);

      return React.createElement(
        Provider,
        { store: this.store },
        React.createElement(
          ExpandableTable,
          _extends({}, props, { columnManager: this.columnManager, getRowKey: this.getRowKey }),
          function (expander) {
            _this2.expander = expander;
            return React.createElement(
              'div',
              _extends({
                ref: _this2.saveRef('tableNode'),
                className: className,
                style: props.style,
                id: props.id
              }, dataAndAriaProps),
              _this2.renderTitle(),
              React.createElement(
                'div',
                { className: prefixCls + '-content' },
                _this2.renderMainTable(),
                hasLeftFixed && _this2.renderLeftFixedTable(),
                hasRightFixed && _this2.renderRightFixedTable()
              )
            );
          }
        )
      );
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.columns && nextProps.columns !== prevState.columns) {
        return {
          columns: nextProps.columns,
          children: null
        };
      } else if (nextProps.children !== prevState.children) {
        return {
          columns: null,
          children: nextProps.children
        };
      }
      return null;
    }
  }]);

  return Table;
}(React.Component);

Table.propTypes = _extends({
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
      cell: PropTypes.any
    }),
    body: PropTypes.shape({
      wrapper: PropTypes.any,
      row: PropTypes.any,
      cell: PropTypes.any
    })
  })
}, ExpandableTable.PropTypes);
Table.childContextTypes = {
  table: PropTypes.any,
  components: PropTypes.any
};
Table.defaultProps = {
  data: [],
  useFixedHeader: false,
  rowKey: 'key',
  rowClassName: function rowClassName() {
    return '';
  },
  onRow: function onRow() {},
  onHeaderRow: function onHeaderRow() {},

  prefixCls: 'rc-table',
  bodyStyle: {},
  style: {},
  showHeader: true,
  scroll: {},
  rowRef: function rowRef() {
    return null;
  },
  emptyText: function emptyText() {
    return 'No Data';
  }
};


polyfill(Table);

export default Table;