import type { CompareProps } from '@rc-component/context/lib/Immutable';
import * as React from 'react';
import { INTERNAL_HOOKS } from '..';
import type { CustomizeScrollBody } from '../interface';
import Table, { type TableProps } from '../Table';
import Grid from './BodyGrid';
import { StaticContext } from './context';
import { makeImmutable } from '../context/TableContext';
import { warning } from 'rc-util';

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

const PRESET_COLUMN_WIDTH = 100;

function VirtualTable<RecordType>(props: StaticTableProps<RecordType>) {
  const { columns, scroll } = props;

  const { x: scrollX, y: scrollY } = scroll || {};
  let mergedScrollX = scrollX;

  // Fill all column with width
  // const filledWidthColumns = useWidthColumns(columns, scrollX);
  if (typeof scrollX !== 'number') {
    mergedScrollX = ((columns || []).length + 1) * PRESET_COLUMN_WIDTH;

    if (process.env.NODE_ENV !== 'production') {
      warning(false, '`scroll.x` in virtual table must be number.');
    }
  }

  // ========================== Render ==========================
  return (
    <StaticContext.Provider value={{ scrollX: mergedScrollX, scrollY }}>
      <Table
        {...props}
        scroll={{
          ...scroll,
          x: mergedScrollX,
        }}
        components={{
          body: renderBody,
        }}
        columns={columns}
        internalHooks={INTERNAL_HOOKS}
        tailor
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
