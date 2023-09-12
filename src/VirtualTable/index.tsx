import type { CompareProps } from '@rc-component/context/lib/Immutable';
import classNames from 'classnames';
import { warning } from 'rc-util';
import * as React from 'react';
import { INTERNAL_HOOKS } from '../constant';
import { makeImmutable } from '../context/TableContext';
import type { CustomizeScrollBody } from '../interface';
import Table, { DEFAULT_PREFIX, type TableProps } from '../Table';
import Grid from './BodyGrid';
import { StaticContext } from './context';

const renderBody: CustomizeScrollBody<any> = (rawData, props) => {
  const { ref, onScroll } = props;

  return <Grid ref={ref} data={rawData as any} onScroll={onScroll} />;
};

export interface VirtualTableProps<RecordType> extends Omit<TableProps<RecordType>, 'scroll'> {
  scroll: {
    x: number;
    y: number;
  };
  listItemHeight?: number;
}

const PRESET_COLUMN_WIDTH = 100;

function VirtualTable<RecordType>(props: VirtualTableProps<RecordType>) {
  const { columns, scroll, prefixCls = DEFAULT_PREFIX, className, listItemHeight } = props;

  let { x: scrollX, y: scrollY } = scroll || {};

  // Fill scrollX
  if (typeof scrollX !== 'number') {
    scrollX = ((columns || []).length + 1) * PRESET_COLUMN_WIDTH;

    if (process.env.NODE_ENV !== 'production') {
      warning(false, '`scroll.x` in virtual table must be number.');
    }
  }

  // Fill scrollY
  if (typeof scrollY !== 'number') {
    scrollY = 500;

    if (process.env.NODE_ENV !== 'production') {
      warning(false, '`scroll.y` in virtual table must be number.');
    }
  }

  // ========================= Context ==========================
  const context = React.useMemo(() => ({ scrollY, listItemHeight }), [scrollY, listItemHeight]);

  // ========================== Render ==========================
  return (
    <StaticContext.Provider value={context}>
      <Table
        {...props}
        className={classNames(className, `${prefixCls}-virtual`)}
        scroll={{
          ...scroll,
          x: scrollX,
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
