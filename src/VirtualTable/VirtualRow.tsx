import * as React from 'react';
import { useContext } from '@rc-component/context';
import TableContext from '../context/TableContext';
import useHorizontalVirtual from './useHorizontalVirtual';
import type { getCellProps } from '../Body/BodyRow';
import VirtualCell from './VirtualCell';
import type useRowInfo from '../hooks/useRowInfo';
import type { CustomizeComponent } from '../interface';

export interface VirtualRowProps {
  cellPropsCollections: ReturnType<typeof getCellProps>[];
  scrollLeft: number;
  index: number;
  renderIndex: number;
  inverse: boolean;
  record: any;
  rowInfo: ReturnType<typeof useRowInfo>;
  component: CustomizeComponent;
  getHeight: (rowSpan: number) => number;
}

export default function VirtualRow({
  cellPropsCollections,
  scrollLeft,
  ...restProps
}: VirtualRowProps) {
  const { flattenColumns } = useContext(TableContext, ['flattenColumns']);

  const [startIndex, virtualOffset, showColumnIndexes] = useHorizontalVirtual(
    cellPropsCollections,
    scrollLeft,
  );

  return showColumnIndexes.map(colIndex => (
    <VirtualCell
      key={colIndex}
      column={flattenColumns[colIndex]}
      colIndex={colIndex}
      style={startIndex === colIndex ? { marginLeft: virtualOffset } : {}}
      cellProps={cellPropsCollections[colIndex]}
      {...restProps}
    />
  ));
}
