import { useContext } from '@rc-component/context';
import { clsx } from 'clsx';
import * as React from 'react';
import Cell from '../Cell';
import TableContext, { responseImmutable } from '../context/TableContext';
import type { FlattenData } from '../hooks/useFlattenRecords';
import useRowInfo from '../hooks/useRowInfo';
import VirtualCell from './VirtualCell';
import { StaticContext } from './context';
import { computedExpandedClassName } from '../utils/expandUtil';

export interface BodyLineProps<RecordType = any> {
  data: FlattenData<RecordType>;
  index: number;
  className?: string;
  style?: React.CSSProperties;
  rowKey: React.Key;

  /** Render cell only when it has `rowSpan > 1` */
  extra?: boolean;
  getHeight?: (rowSpan: number) => number;
}

const BodyLine = React.forwardRef<HTMLDivElement, BodyLineProps>((props, ref) => {
  const { data, index, className, rowKey, style, extra, getHeight, ...restProps } = props;
  const { record, indent, index: renderIndex } = data;

  const { scrollX, flattenColumns, prefixCls, fixColumn, componentWidth } = useContext(
    TableContext,
    ['prefixCls', 'flattenColumns', 'fixColumn', 'componentWidth', 'scrollX'],
  );
  const { getComponent } = useContext(StaticContext, ['getComponent']);

  const rowInfo = useRowInfo(record, rowKey, index, indent);

  const RowComponent = getComponent(['body', 'row'], 'div');
  const cellComponent = getComponent(['body', 'cell'], 'div');

  // ========================== Expand ==========================
  const { rowSupportExpand, expanded, rowProps, expandedRowRender, expandedRowClassName } = rowInfo;

  let expandRowNode: React.ReactElement<any>;
  if (rowSupportExpand && expanded) {
    const expandContent = expandedRowRender(record, index, indent + 1, expanded);

    const expandedClsName = computedExpandedClassName(expandedRowClassName, record, index, indent);

    let additionalProps: React.TdHTMLAttributes<HTMLElement> = {};
    if (fixColumn) {
      additionalProps = {
        style: {
          ['--virtual-width' as any]: `${componentWidth}px`,
        },
      };
    }

    const rowCellCls = `${prefixCls}-expanded-row-cell`;

    expandRowNode = (
      <RowComponent
        className={clsx(
          `${prefixCls}-expanded-row`,
          `${prefixCls}-expanded-row-level-${indent + 1}`,
          expandedClsName,
        )}
      >
        <Cell
          component={cellComponent}
          prefixCls={prefixCls}
          className={clsx(rowCellCls, { [`${rowCellCls}-fixed`]: fixColumn })}
          additionalProps={additionalProps}
        >
          {expandContent}
        </Cell>
      </RowComponent>
    );
  }

  // ========================== Render ==========================
  const rowStyle: React.CSSProperties = {
    ...style,
    width: scrollX as number,
  };

  if (extra) {
    rowStyle.position = 'absolute';
    rowStyle.pointerEvents = 'none';
  }

  const rowNode = (
    <RowComponent
      {...rowProps}
      {...restProps}
      data-row-key={rowKey}
      ref={rowSupportExpand ? null : ref}
      className={clsx(className, `${prefixCls}-row`, rowProps?.className, {
        [`${prefixCls}-row-extra`]: extra,
      })}
      style={{ ...rowStyle, ...rowProps?.style }}
    >
      {flattenColumns.map((column, colIndex) => {
        return (
          <VirtualCell
            key={colIndex}
            component={cellComponent}
            rowInfo={rowInfo}
            column={column}
            colIndex={colIndex}
            indent={indent}
            index={index}
            renderIndex={renderIndex}
            record={record}
            inverse={extra}
            getHeight={getHeight}
          />
        );
      })}
    </RowComponent>
  );

  if (rowSupportExpand) {
    return (
      <div ref={ref}>
        {rowNode}
        {expandRowNode}
      </div>
    );
  }

  return rowNode;
});

const ResponseBodyLine = responseImmutable(BodyLine);

if (process.env.NODE_ENV !== 'production') {
  ResponseBodyLine.displayName = 'BodyLine';
}

export default ResponseBodyLine;
