import { useContext } from '@rc-component/context';
import * as React from 'react';
import TableContext from '../context/TableContext';
import type { CustomizeScrollBody } from '../interface';
import Table, { type TableProps } from '../Table';
import useWidthColumns from './useWidthColumns';

const Grid = React.forwardRef((props, ref: any) => {
  const context = useContext(TableContext);
  const { flattenColumns, onColumnResize } = useContext(TableContext, [
    'flattenColumns',
    'onColumnResize',
  ]);

  console.log('=>', context, flattenColumns);

  // ========================== Column ==========================
  const columnsWidth = React.useMemo<[key: React.Key, width: number][]>(
    () => flattenColumns.map(({ width, key }) => [key, width as number]),
    [flattenColumns],
  );

  React.useEffect(() => {
    columnsWidth.forEach(([key, width]) => {
      onColumnResize(key, width);
    });
    console.log('->', columnsWidth);
  }, [columnsWidth]);

  // ========================== Render ==========================
  return <div ref={ref} />;
});

const renderBody: CustomizeScrollBody<any> = (rawData, props) => {
  const { ref } = props;

  // console.log('->', rawData, props);
  return <Grid ref={ref} />;
};

export default function StaticTable<RecordType>(props: TableProps<RecordType>) {
  const { columns, scroll } = props;

  const { x: scrollX } = scroll || {};

  // Fill all column with width
  const filledWidthColumns = useWidthColumns(columns, typeof scrollX === 'number' ? scrollX : null);

  // ========================== Render ==========================
  return (
    <Table
      {...props}
      components={{
        body: renderBody,
      }}
      columns={filledWidthColumns}
    />
  );
}
