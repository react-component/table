import * as React from 'react';
import Cell from '../Cell';
import ExpandedRowContext from '../context/ExpandedRowContext';
import TableContext from '../context/TableContext';
import { useContextSelector } from '../ContextSelector';
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

function ExpandedRow({
  prefixCls,
  children,
  component: Component,
  cellComponent,
  className,
  expanded,
  colSpan,
  isEmpty,
}: ExpandedRowProps) {
  const scrollbarSize = useContextSelector(TableContext, 'scrollbarSize');
  const { fixHeader, fixColumn, componentWidth, horizonScroll } = useContextSelector(
    ExpandedRowContext,
    ['fixHeader', 'fixColumn', 'componentWidth', 'horizonScroll'],
  );

  // Cache render node
  return React.useMemo(() => {  
    if (!expanded) {
     return null;
    }
    
    let contentNode = children;

    if (isEmpty ? horizonScroll : fixColumn) {
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
          {componentWidth !== 0 && contentNode}
        </div>
      );
    }

    return (
      <Component className={className}>
        <Cell component={cellComponent} prefixCls={prefixCls} colSpan={colSpan}>
          {contentNode}
        </Cell>
      </Component>
    );
  }, [
    children,
    Component,
    className,
    expanded,
    colSpan,
    isEmpty,
    scrollbarSize,
    componentWidth,
    fixColumn,
    fixHeader,
    horizonScroll,
  ]);
}

export default ExpandedRow;
