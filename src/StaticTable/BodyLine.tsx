import { useContext } from '@rc-component/context';
import classNames from 'classnames';
import * as React from 'react';
import TableContext, { responseImmutable } from '../context/TableContext';
import type { FlattenData } from '../hooks/useFlattenRecords';
import { StaticContext } from './context';
import VirtualCell from './VirtualCell';
import useRowInfo from '../hooks/useRowInfo';

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
  const { record, indent } = data;

  const { flattenColumns, prefixCls } = useContext(TableContext, [
    'prefixCls',
    'flattenColumns',
    'expandableType',
    'rowExpandable',
  ]);
  const { scrollX } = useContext(StaticContext, ['scrollX']);

  const rowInfo = useRowInfo(record, rowKey);

  // ========================== Expand ==========================
  const { expandable, expanded } = rowInfo;

  let expandRowNode: React.ReactElement;
  if (expandable && expanded) {
    expandRowNode = <>233</>;
  }

  // ========================== Render ==========================

  const rowStyle: React.CSSProperties = {
    ...style,
    width: scrollX,
  };

  if (extra) {
    rowStyle.position = 'absolute';
    rowStyle.pointerEvents = 'none';
  }

  const rowNode = (
    <div
      {...restProps}
      ref={expandable ? null : ref}
      className={classNames(className, `${prefixCls}-row`, {
        [`${prefixCls}-row-extra`]: extra,
      })}
      style={rowStyle}
    >
      {flattenColumns.map((column, colIndex) => {
        return (
          <VirtualCell
            key={colIndex}
            rowInfo={rowInfo}
            column={column}
            colIndex={colIndex}
            indent={indent}
            index={index}
            record={record}
            inverse={extra}
            getHeight={getHeight}
          />
        );
      })}
    </div>
  );

  if (expandable) {
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
