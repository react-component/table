import { CompareProps, makeImmutable } from '@rc-component/context/lib/Immutable';
import * as React from 'react';
import { INTERNAL_HOOKS } from '..';
import type { CustomizeScrollBody } from '../interface';
import Table, { type TableProps } from '../Table';
import Grid from './BodyGrid';
import { StaticContext } from './context';
import useWidthColumns from './useWidthColumns';

const renderBody: CustomizeScrollBody<any> = (rawData, props) => {
  const { ref, onScroll } = props;

  return <Grid ref={ref} data={rawData as any} onScroll={onScroll} />;
};

export interface StaticTableProps<RecordType> extends Omit<TableProps<RecordType>, 'scroll'> {
  scroll: {
    x: number;
    y: number;
  };
}

function VirtualTable<RecordType>(props: StaticTableProps<RecordType>) {
  const { columns, scroll } = props;

  const { x: scrollX, y: scrollY } = scroll || {};

  // Fill all column with width
  const filledWidthColumns = useWidthColumns(columns, scrollX);

  // ========================== Render ==========================
  return (
    <StaticContext.Provider value={{ scrollX, scrollY }}>
      <Table
        {...props}
        components={{
          body: renderBody,
        }}
        columns={filledWidthColumns}
        internalHooks={INTERNAL_HOOKS}
        hideScrollColumn
      />
    </StaticContext.Provider>
  );
}

export function genVirtualTable(
  shouldTriggerRender?: CompareProps<typeof Table>,
): typeof VirtualTable {
  return makeImmutable(VirtualTable, shouldTriggerRender);
}

export default genVirtualTable();
