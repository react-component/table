import * as React from 'react';
import getScrollBarSize from 'rc-util/lib/getScrollBarSize';
import { CustomizeComponent } from '../interface';
import Cell from '../Cell';

const scrollBarSize = getScrollBarSize();

export interface ExpandedRowProps<RecordType> {
  prefixCls: string;
  component: CustomizeComponent;
  cellComponent: CustomizeComponent;
  fixHeader: boolean;
  fixColumn: boolean;
  componentWidth: number;
  className: string;
  expanded: boolean;
  children: React.ReactNode;
  colSpan: number;
}

function ExpandedRow<RecordType>({
  prefixCls,
  children,
  component: Component,
  cellComponent,
  fixHeader,
  fixColumn,
  className,
  expanded,
  componentWidth,
  colSpan,
}: ExpandedRowProps<RecordType>) {
  let contentNode = children;

  if (fixColumn) {
    contentNode = (
      <div
        style={{
          width: componentWidth - (fixHeader ? scrollBarSize : 0),
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
