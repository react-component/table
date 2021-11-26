import * as React from 'react';
import type { CustomizeComponent } from '../interface';
import Cell from '../Cell';
import TableContext from '../context/TableContext';
import ExpandedRowContext from '../context/ExpandedRowContext';

export interface ExpandedRowProps {
  prefixCls: string;
  component: CustomizeComponent;
  cellComponent: CustomizeComponent;
  className: string;
  expanded: boolean;
  children: React.ReactNode;
  colSpan: number;
}

function ExpandedRow({
  prefixCls,
  children,
  component: Component,
  cellComponent,
  className,
  expanded,
  colSpan,
}: ExpandedRowProps) {
  const { scrollbarSize } = React.useContext(TableContext);
  const { fixHeader, fixColumn, componentWidth } = React.useContext(ExpandedRowContext);

  // Cache render node
  return React.useMemo(() => {
    let contentNode = children;

    if (fixColumn) {
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
  }, [
    children,
    Component,
    className,
    expanded,
    colSpan,
    scrollbarSize,
    componentWidth,
    fixColumn,
    fixHeader,
  ]);
}

export default ExpandedRow;
