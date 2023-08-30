import { useContext } from '@rc-component/context';
import * as React from 'react';
import Cell from '../Cell';
import TableContext from '../context/TableContext';
import devRenderTimes from '../hooks/useRenderTimes';
import type { CustomizeComponent } from '../interface';

export interface ExpandedRowProps {
  prefixCls: string;
  component: CustomizeComponent;
  cellComponent: CustomizeComponent;
  className: string;
  expanded: boolean;
  children: React.ReactNode;
  colSpan: number;
  isEmpty: boolean;
}

function ExpandedRow(props: ExpandedRowProps) {
  if (process.env.NODE_ENV !== 'production') {
    devRenderTimes(props);
  }

  const {
    prefixCls,
    children,
    component: Component,
    cellComponent,
    className,
    expanded,
    colSpan,
    isEmpty,
  } = props;

  const { scrollbarSize, fixHeader, fixColumn, componentWidth, horizonScroll } = useContext(
    TableContext,
    ['scrollbarSize', 'fixHeader', 'fixColumn', 'componentWidth', 'horizonScroll'],
  );

  // Cache render node
  let contentNode = children;

  if (isEmpty ? horizonScroll && componentWidth : fixColumn) {
    contentNode = (
      <div
        style={{
          width: componentWidth - (fixHeader ? scrollbarSize : 0),
          position: 'sticky',
          left: 0,
          overflow: 'hidden',
        }}
        className={`${prefixCls}-expanded-row-fixed`}
      >
        {contentNode}
      </div>
    );
  }

  return (
    <Component
      className={className}
      style={{
        display: expanded ? null : 'none',
      }}
    >
      <Cell component={cellComponent} prefixCls={prefixCls} colSpan={colSpan}>
        {contentNode}
      </Cell>
    </Component>
  );
}

export default ExpandedRow;
