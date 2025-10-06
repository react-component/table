import type { CompareProps } from '@rc-component/context/lib/Immutable';
import { clsx } from 'clsx';
import { useEvent, warning } from '@rc-component/util';
import * as React from 'react';
import { INTERNAL_HOOKS } from '../constant';
import { makeImmutable } from '../context/TableContext';
import type { CustomizeScrollBody, GetComponent, Reference } from '../interface';
import Table, { DEFAULT_PREFIX, type TableProps } from '../Table';
import Grid from './BodyGrid';
import { StaticContext } from './context';
import getValue from '@rc-component/util/lib/utils/get';

const renderBody: CustomizeScrollBody<any> = (rawData, props) => {
  const { ref, onScroll } = props;
  return <Grid ref={ref as any} data={rawData as any} onScroll={onScroll} />;
};

export interface VirtualTableProps<RecordType> extends Omit<TableProps<RecordType>, 'scroll'> {
  listItemHeight?: number;
  scroll: { x?: number; y?: number };
}

const VirtualTable = <RecordType,>(
  props: VirtualTableProps<RecordType>,
  ref: React.Ref<Reference>,
) => {
  const {
    data,
    columns,
    scroll,
    sticky,
    prefixCls = DEFAULT_PREFIX,
    className,
    listItemHeight,
    components,
    onScroll,
  } = props;

  let { x: scrollX, y: scrollY } = scroll || {};

  // Fill scrollX
  if (typeof scrollX !== 'number') {
    if (process.env.NODE_ENV !== 'production') {
      warning(!scrollX, '`scroll.x` in virtual table must be number.');
    }

    scrollX = 1;
  }

  // Fill scrollY
  if (typeof scrollY !== 'number') {
    scrollY = 500;

    if (process.env.NODE_ENV !== 'production') {
      warning(false, '`scroll.y` in virtual table must be number.');
    }
  }

  const getComponent = useEvent<GetComponent>(
    (path, defaultComponent) => getValue(components, path) || defaultComponent,
  );

  // Memo this
  const onInternalScroll = useEvent(onScroll);

  // ========================= Context ==========================
  const context = React.useMemo(
    () => ({ sticky, scrollY, listItemHeight, getComponent, onScroll: onInternalScroll }),
    [sticky, scrollY, listItemHeight, getComponent, onInternalScroll],
  );

  // ========================== Render ==========================
  return (
    <StaticContext.Provider value={context}>
      <Table
        {...props}
        className={clsx(className, `${prefixCls}-virtual`)}
        scroll={{ ...scroll, x: scrollX }}
        components={{
          ...components,
          // fix https://github.com/ant-design/ant-design/issues/48991
          body: data?.length ? renderBody : undefined,
        }}
        columns={columns}
        internalHooks={INTERNAL_HOOKS}
        tailor
        ref={ref}
      />
    </StaticContext.Provider>
  );
};

export type ForwardGenericVirtualTable = (<RecordType>(
  props: TableProps<RecordType> & React.RefAttributes<Reference>,
) => React.ReactElement<any>) & { displayName?: string };

const RefVirtualTable = React.forwardRef(VirtualTable) as ForwardGenericVirtualTable;

if (process.env.NODE_ENV !== 'production') {
  RefVirtualTable.displayName = 'VirtualTable';
}

export const genVirtualTable = (shouldTriggerRender?: CompareProps<ForwardGenericVirtualTable>) => {
  return makeImmutable(RefVirtualTable, shouldTriggerRender);
};

export default genVirtualTable();
