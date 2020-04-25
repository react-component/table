import * as React from 'react';
import * as PropTypes from 'prop-types';
import { measureScrollbar } from './utils';
import BaseTable from './BaseTable';
import { FixedType, ColumnType, GetRowKey, Expander } from './interface';

export interface BodyTableProps<ValueType> {
  fixed?: FixedType;
  columns: ColumnType[];
  tableClassName: string;
  handleWheel: React.WheelEventHandler<HTMLDivElement>;
  handleBodyScroll: React.UIEventHandler<HTMLDivElement>;
  getRowKey: GetRowKey<ValueType>;
  expander: Expander;
  isAnyColumnsFixed?: boolean;
}

export default class BodyTable<ValueType> extends React.PureComponent<BodyTableProps<ValueType>> {
  static contextTypes = {
    table: PropTypes.any,
  };

  render() {
    const { prefixCls, scroll } = this.context.table.props;
    const {
      columns,
      fixed,
      tableClassName,
      getRowKey,
      handleBodyScroll,
      handleWheel,
      expander,
      isAnyColumnsFixed,
    } = this.props;
    const { saveRef } = this.context.table;
    let { useFixedHeader } = this.context.table.props;
    const bodyStyle = { ...this.context.table.props.bodyStyle };
    const innerBodyStyle: React.CSSProperties = {};

    if (scroll.x || fixed) {
      bodyStyle.overflowX = bodyStyle.overflowX || 'scroll';
      // Fix weird webkit render bug
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
      const scrollbarWidth = measureScrollbar({ direction: 'vertical' });
      if (scrollbarWidth > 0 && fixed) {
        bodyStyle.marginBottom = `-${scrollbarWidth}px`;
        bodyStyle.paddingBottom = '0px';
      }
    }

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
      />
    );

    if (fixed && columns.length) {
      let refName: string;
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

    // Should provides `tabIndex` if use scroll to enable keyboard scroll
    const useTabIndex = scroll && (scroll.x || scroll.y);

    return (
      <div
        tabIndex={useTabIndex ? -1 : undefined}
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
}
