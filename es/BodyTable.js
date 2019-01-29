import _extends from 'babel-runtime/helpers/extends';
import React from 'react';
import PropTypes from 'prop-types';
import { measureScrollbar } from './utils';
import BaseTable from './BaseTable';

export default function BodyTable(props, _ref) {
  var table = _ref.table;
  var _table$props = table.props,
      prefixCls = _table$props.prefixCls,
      scroll = _table$props.scroll;
  var columns = props.columns,
      fixed = props.fixed,
      tableClassName = props.tableClassName,
      getRowKey = props.getRowKey,
      handleBodyScroll = props.handleBodyScroll,
      handleWheel = props.handleWheel,
      expander = props.expander,
      isAnyColumnsFixed = props.isAnyColumnsFixed;
  var saveRef = table.saveRef;
  var useFixedHeader = table.props.useFixedHeader;

  var bodyStyle = _extends({}, table.props.bodyStyle);
  var innerBodyStyle = {};

  if (scroll.x || fixed) {
    bodyStyle.overflowX = bodyStyle.overflowX || 'scroll';
    // Fix weired webkit render bug
    // https://github.com/ant-design/ant-design/issues/7783
    bodyStyle.WebkitTransform = 'translate3d (0, 0, 0)';
  }

  if (scroll.y) {
    // maxHeight will make fixed-Table scrolling not working
    // so we only set maxHeight to body-Table here
    if (fixed) {
      innerBodyStyle.maxHeight = bodyStyle.maxHeight || scroll.y;
      innerBodyStyle.overflowY = bodyStyle.overflowY || 'scroll';
    } else {
      bodyStyle.maxHeight = bodyStyle.maxHeight || scroll.y;
    }
    bodyStyle.overflowY = bodyStyle.overflowY || 'scroll';
    useFixedHeader = true;

    // Add negative margin bottom for scroll bar overflow bug
    var scrollbarWidth = measureScrollbar();
    if (scrollbarWidth > 0 && fixed) {
      bodyStyle.marginBottom = '-' + scrollbarWidth + 'px';
      bodyStyle.paddingBottom = '0px';
    }
  }

  var baseTable = React.createElement(BaseTable, {
    tableClassName: tableClassName,
    hasHead: !useFixedHeader,
    hasBody: true,
    fixed: fixed,
    columns: columns,
    expander: expander,
    getRowKey: getRowKey,
    isAnyColumnsFixed: isAnyColumnsFixed
  });

  if (fixed && columns.length) {
    var refName = void 0;
    if (columns[0].fixed === 'left' || columns[0].fixed === true) {
      refName = 'fixedColumnsBodyLeft';
    } else if (columns[0].fixed === 'right') {
      refName = 'fixedColumnsBodyRight';
    }
    delete bodyStyle.overflowX;
    delete bodyStyle.overflowY;
    return React.createElement(
      'div',
      { key: 'bodyTable', className: prefixCls + '-body-outer', style: _extends({}, bodyStyle) },
      React.createElement(
        'div',
        {
          className: prefixCls + '-body-inner',
          style: innerBodyStyle,
          ref: saveRef(refName),
          onWheel: handleWheel,
          onScroll: handleBodyScroll
        },
        baseTable
      )
    );
  }

  return React.createElement(
    'div',
    {
      key: 'bodyTable',
      className: prefixCls + '-body',
      style: bodyStyle,
      ref: saveRef('bodyTable'),
      onWheel: handleWheel,
      onScroll: handleBodyScroll
    },
    baseTable
  );
}

BodyTable.propTypes = {
  fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  columns: PropTypes.array.isRequired,
  tableClassName: PropTypes.string.isRequired,
  handleWheel: PropTypes.func.isRequired,
  handleBodyScroll: PropTypes.func.isRequired,
  getRowKey: PropTypes.func.isRequired,
  expander: PropTypes.object.isRequired,
  isAnyColumnsFixed: PropTypes.bool
};

BodyTable.contextTypes = {
  table: PropTypes.any
};