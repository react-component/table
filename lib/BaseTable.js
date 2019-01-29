'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _miniStore = require('mini-store');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ColGroup = require('./ColGroup');

var _ColGroup2 = _interopRequireDefault(_ColGroup);

var _TableHeader = require('./TableHeader');

var _TableHeader2 = _interopRequireDefault(_TableHeader);

var _TableRow = require('./TableRow');

var _TableRow2 = _interopRequireDefault(_TableRow);

var _ExpandableRow = require('./ExpandableRow');

var _ExpandableRow2 = _interopRequireDefault(_ExpandableRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var BaseTable = function (_React$Component) {
  (0, _inherits3['default'])(BaseTable, _React$Component);

  function BaseTable() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, BaseTable);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = BaseTable.__proto__ || Object.getPrototypeOf(BaseTable)).call.apply(_ref, [this].concat(args))), _this), _this.handleRowHover = function (isHover, key) {
      _this.props.store.setState({
        currentHoverKey: isHover ? key : null
      });
    }, _this.renderRows = function (renderData, indent) {
      var ancestorKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var table = _this.context.table;
      var columnManager = table.columnManager,
          components = table.components;
      var _table$props = table.props,
          prefixCls = _table$props.prefixCls,
          childrenColumnName = _table$props.childrenColumnName,
          rowClassName = _table$props.rowClassName,
          rowRef = _table$props.rowRef,
          onRowClick = _table$props.onRowClick,
          onRowDoubleClick = _table$props.onRowDoubleClick,
          onRowContextMenu = _table$props.onRowContextMenu,
          onRowMouseEnter = _table$props.onRowMouseEnter,
          onRowMouseLeave = _table$props.onRowMouseLeave,
          onRow = _table$props.onRow;
      var _this$props = _this.props,
          getRowKey = _this$props.getRowKey,
          fixed = _this$props.fixed,
          expander = _this$props.expander,
          isAnyColumnsFixed = _this$props.isAnyColumnsFixed;


      var rows = [];

      var _loop = function _loop(i) {
        var record = renderData[i];
        var key = getRowKey(record, i);
        var className = typeof rowClassName === 'string' ? rowClassName : rowClassName(record, i, indent);

        var onHoverProps = {};
        if (columnManager.isAnyColumnsFixed()) {
          onHoverProps.onHover = _this.handleRowHover;
        }

        var leafColumns = void 0;
        if (fixed === 'left') {
          leafColumns = columnManager.leftLeafColumns();
        } else if (fixed === 'right') {
          leafColumns = columnManager.rightLeafColumns();
        } else {
          leafColumns = _this.getColumns(columnManager.leafColumns());
        }

        var rowPrefixCls = prefixCls + '-row';

        var row = _react2['default'].createElement(
          _ExpandableRow2['default'],
          (0, _extends3['default'])({}, expander.props, {
            fixed: fixed,
            index: i,
            prefixCls: rowPrefixCls,
            record: record,
            key: key,
            rowKey: key,
            onRowClick: onRowClick,
            needIndentSpaced: expander.needIndentSpaced,
            onExpandedChange: expander.handleExpandChange
          }),
          function (expandableRow) {
            return (// eslint-disable-line
              _react2['default'].createElement(_TableRow2['default'], (0, _extends3['default'])({
                fixed: fixed,
                indent: indent,
                className: className,
                record: record,
                renderData: renderData,
                index: i,
                prefixCls: rowPrefixCls,
                childrenColumnName: childrenColumnName,
                columns: leafColumns,
                onRow: onRow,
                onRowDoubleClick: onRowDoubleClick,
                onRowContextMenu: onRowContextMenu,
                onRowMouseEnter: onRowMouseEnter,
                onRowMouseLeave: onRowMouseLeave
              }, onHoverProps, {
                rowKey: key,
                ancestorKeys: ancestorKeys,
                ref: rowRef(record, i, indent),
                components: components,
                isAnyColumnsFixed: isAnyColumnsFixed
              }, expandableRow))
            );
          }
        );

        rows.push(row);

        expander.renderRows(_this.renderRows, rows, record, i, indent, fixed, key, ancestorKeys);
      };

      for (var i = 0; i < renderData.length; i++) {
        _loop(i);
      }
      return rows;
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(BaseTable, [{
    key: 'getColumns',
    value: function getColumns(cols) {
      var _props = this.props,
          _props$columns = _props.columns,
          columns = _props$columns === undefined ? [] : _props$columns,
          fixed = _props.fixed;
      var table = this.context.table;
      var prefixCls = table.props.prefixCls;

      return (cols || columns).map(function (column) {
        return (0, _extends3['default'])({}, column, {
          className: !!column.fixed && !fixed ? (0, _classnames2['default'])(prefixCls + '-fixed-columns-in-body', column.className) : column.className
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var table = this.context.table;
      var components = table.components;
      var _table$props2 = table.props,
          prefixCls = _table$props2.prefixCls,
          scroll = _table$props2.scroll,
          data = _table$props2.data,
          getBodyWrapper = _table$props2.getBodyWrapper;
      var _props2 = this.props,
          expander = _props2.expander,
          tableClassName = _props2.tableClassName,
          hasHead = _props2.hasHead,
          hasBody = _props2.hasBody,
          fixed = _props2.fixed;

      var tableStyle = {};

      if (!fixed && scroll.x) {
        // not set width, then use content fixed width
        if (scroll.x === true) {
          tableStyle.tableLayout = 'fixed';
        } else {
          tableStyle.width = scroll.x;
        }
      }

      var Table = hasBody ? components.table : 'table';
      var BodyWrapper = components.body.wrapper;

      var body = void 0;
      if (hasBody) {
        body = _react2['default'].createElement(
          BodyWrapper,
          { className: prefixCls + '-tbody' },
          this.renderRows(data, 0)
        );
        if (getBodyWrapper) {
          body = getBodyWrapper(body);
        }
      }

      var columns = this.getColumns();

      return _react2['default'].createElement(
        Table,
        { className: tableClassName, style: tableStyle, key: 'table' },
        _react2['default'].createElement(_ColGroup2['default'], { columns: columns, fixed: fixed }),
        hasHead && _react2['default'].createElement(_TableHeader2['default'], { expander: expander, columns: columns, fixed: fixed }),
        body
      );
    }
  }]);
  return BaseTable;
}(_react2['default'].Component);

BaseTable.propTypes = {
  fixed: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].bool]),
  columns: _propTypes2['default'].array.isRequired,
  tableClassName: _propTypes2['default'].string.isRequired,
  hasHead: _propTypes2['default'].bool.isRequired,
  hasBody: _propTypes2['default'].bool.isRequired,
  store: _propTypes2['default'].object.isRequired,
  expander: _propTypes2['default'].object.isRequired,
  getRowKey: _propTypes2['default'].func,
  isAnyColumnsFixed: _propTypes2['default'].bool
};
BaseTable.contextTypes = {
  table: _propTypes2['default'].any
};
exports['default'] = (0, _miniStore.connect)()(BaseTable);
module.exports = exports['default'];