import React from 'react';
import PropTypes from 'prop-types';
import { measureScrollbar, getDataOrAriaProps } from './utils';
import BaseTable from './BaseTable';

export default function BodyTable(props, { table }) {
  const { prefixCls, scroll } = table.props;
  const {
    columns,
    fixed,
    tableClassName,
    getRowKey,
    handleBodyScroll,
    handleWheel,
    expander,
    isAnyColumnsFixed,
    ...otherProps
  } = props;
  const { saveRef } = table;
  let { useFixedHeader } = table.props;
  const bodyStyle = { ...table.props.bodyStyle };
  const innerBodyStyle = {};

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
    const scrollbarWidth = measureScrollbar();
    if (scrollbarWidth > 0 && fixed) {
      bodyStyle.marginBottom = `-${scrollbarWidth}px`;
      bodyStyle.paddingBottom = '0px';
    }
  }

  const dataOrAriaProps = getDataOrAriaProps(otherProps);

  const baseTable = (
    <BaseTable
      tableClassName={tableClassName}
      hasHead={!useFixedHeader}
      hasBody
      fixed={fixed}
      columns={columns}
      expander={expander}
      getRowKey={getRowKey}
      isAnyColumnsFixed={isAnyColumnsFixed}
      {...dataOrAriaProps}
    />
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
    return (
      <div key="bodyTable" className={`${prefixCls}-body-outer`} style={{ ...bodyStyle }}>
        <div
          className={`${prefixCls}-body-inner`}
          style={innerBodyStyle}
          ref={saveRef(refName)}
          onWheel={handleWheel}
          onScroll={handleBodyScroll}
        >
          {baseTable}
        </div>
      </div>
    );
  }

  return (
    <div
      key="bodyTable"
      className={`${prefixCls}-body`}
      style={bodyStyle}
      ref={saveRef('bodyTable')}
      onWheel={handleWheel}
      onScroll={handleBodyScroll}
    >
      {baseTable}
    </div>
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
  isAnyColumnsFixed: PropTypes.bool,
};

BodyTable.contextTypes = {
  table: PropTypes.any,
};
