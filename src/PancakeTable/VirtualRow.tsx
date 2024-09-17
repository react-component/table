import { useContext } from '@rc-component/context';
import * as React from 'react';
import type { FlattenData } from '@/hooks/useFlattenRecords';
import VirtualCell from './VirtualCell';
import { StaticContext } from './context';
import useRowInfo from '@/hooks/useRowInfo';

export interface VirtualRowProps<RecordType> {
  record: RecordType;
  renderIndex: number;
  indent: number;
  rowIndex: number;
  rowKey: React.Key;
  flattenColumns: FlattenData<RecordType>;
  extra?: boolean;
  getHeight?: (rowSpan: number) => number;
}

const VirtualRow = React.forwardRef<HTMLDivElement, VirtualRowProps>((props, ref) => {
  const { flattenColumns, extra, getHeight, record, indent, renderIndex, rowIndex, rowKey } = props;

  const rowInfo = useRowInfo(record, rowKey, rowIndex, indent);

  const { getComponent } = useContext(StaticContext, ['getComponent']);
  const cellComponent = getComponent(['body', 'cell'], 'div');

  return (
    <>
      {flattenColumns.slice(0, 10).map((column, colIndex) => {
        return (
          <VirtualCell
            key={colIndex}
            component={cellComponent}
            rowInfo={rowInfo}
            column={column}
            colIndex={colIndex}
            indent={indent}
            index={rowIndex}
            renderIndex={renderIndex}
            record={record}
            inverse={extra}
            getHeight={getHeight}
          />
        );
      })}
    </>
  );
});

export default VirtualRow;
