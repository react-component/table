import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'mini-store';
import classNames from 'classnames';
import ColGroup from './ColGroup';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import ExpandableRow from './ExpandableRow';

var BaseTable = function (_React$Component) {
  _inherits(BaseTable, _React$Component);

  function BaseTable() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, BaseTable);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = BaseTable.__proto__ || Object.getPrototypeOf(BaseTable)).call.apply(_ref, [this].concat(args))), _this), _this.handleRowHover = function (isHover, key) {
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

        var row = React.createElement(
          ExpandableRow,
          _extends({}, expander.props, {
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
              React.createElement(TableRow, _extends({
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
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(BaseTable, [{
    key: 'getColumns',
    value: function getColumns(cols) {
      var _props = this.props,
          _props$columns = _props.columns,
          columns = _props$columns === undefined ? [] : _props$columns,
          fixed = _props.fixed;
      var table = this.context.table;
      var prefixCls = table.props.prefixCls;

      return (cols || columns).map(function (column) {
        return _extends({}, column, {
          className: !!column.fixed && !fixed ? classNames(prefixCls + '-fixed-columns-in-body', column.className) : column.className
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
        body = React.createElement(
          BodyWrapper,
          { className: prefixCls + '-tbody' },
          this.renderRows(data, 0)
        );
        if (getBodyWrapper) {
          body = getBodyWrapper(body);
        }
      }

      var columns = this.getColumns();

      return React.createElement(
        Table,
        { className: tableClassName, style: tableStyle, key: 'table' },
        React.createElement(ColGroup, { columns: columns, fixed: fixed }),
        hasHead && React.createElement(TableHeader, { expander: expander, columns: columns, fixed: fixed }),
        body
      );
    }
  }]);

  return BaseTable;
}(React.Component);

BaseTable.propTypes = {
  fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  columns: PropTypes.array.isRequired,
  tableClassName: PropTypes.string.isRequired,
  hasHead: PropTypes.bool.isRequired,
  hasBody: PropTypes.bool.isRequired,
  store: PropTypes.object.isRequired,
  expander: PropTypes.object.isRequired,
  getRowKey: PropTypes.func,
  isAnyColumnsFixed: PropTypes.bool
};
BaseTable.contextTypes = {
  table: PropTypes.any
};


export default connect()(BaseTable);