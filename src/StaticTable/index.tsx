import { useContext } from '@rc-component/context';
import * as React from 'react';
import TableContext from '../context/TableContext';
import type { CustomizeScrollBody } from '../interface';
import Table, { type TableProps } from '../Table';
import useWidthColumns from './useWidthColumns';

const Grid = React.forwardRef((props, ref: any) => {
  const context = useContext(TableContext);

  console.log('=>', context);

  return <div ref={ref} />;
});

const renderBody: CustomizeScrollBody<any> = (rawData, props) => {
  const { ref } = props;

  console.log('->', rawData, props);
  return <Grid ref={ref} />;
};

export default function StaticTable<RecordType>(props: TableProps<RecordType>) {
  const { columns, scroll } = props;

  const { x: scrollX } = scroll || {};

  const filledWidthColumns = useWidthColumns(columns, typeof scrollX === 'number' ? scrollX : null);

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
