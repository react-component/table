import * as React from 'react';
import { CustomizeComponent } from '../interface';
import Cell from '../Cell';
import TableContext from '../context/TableContext';

export interface ExpandedRowProps {
  prefixCls: string;
  component: CustomizeComponent;
  cellComponent: CustomizeComponent;
  fixHeader: boolean;
  fixColumn: boolean;
  horizonScroll: boolean;
  componentWidth: number;
  className: string;
  expanded: boolean;
  children: React.ReactNode;
  colSpan: number;
}

const ExpandedRow: React.ForwardRefRenderFunction<any, ExpandedRowProps>  = ((props, ref) => {

  const {
    prefixCls,
    children,
    component: Component,
    cellComponent,
    fixHeader,
    fixColumn,
    horizonScroll,
    className,
    expanded,
    componentWidth,
    colSpan,
  } = props;
  const { scrollbarSize } = React.useContext(TableContext);

  // Cache render node
  return React.useMemo(() => {
    let contentNode = children;

    if (fixColumn) {
      contentNode = (
        <div
          ref={ref}
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
        ref={ref}
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
    fixHeader,
    horizonScroll,
    className,
    expanded,
    componentWidth,
    colSpan,
    scrollbarSize,
  ]);
})

export default React.forwardRef(ExpandedRow);
