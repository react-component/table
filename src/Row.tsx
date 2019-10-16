import React from 'react';
import TableContext from './context';
import { getPathValue, getColumnKey } from './utils/valueUtil';
import { RenderedCell } from './interface';

export interface RowProps<RecordType> {
  record: RecordType;
  index: number;
}

function isRenderCell<RecordType>(
  data: React.ReactNode | RenderedCell<RecordType>,
): data is RenderedCell<RecordType> {
  return data && typeof data === 'object' && !React.isValidElement(data);
}

function Row<RecordType>({ record, index }: RowProps<RecordType>) {
  const { columns } = React.useContext(TableContext);
  return (
    <tr>
      {(columns || []).map((column, colIndex) => {
        const { render } = column;

        const value = getPathValue(record, column.dataIndex);

        // Customize render node
        let renderNode: React.ReactNode = value;
        if (render) {
          const renderData = render(value, record, index);

          //
          if (isRenderCell(renderData)) {
            renderNode = renderData.children;
          } else {
            renderNode = renderData;
          }
        }

        return <td key={getColumnKey(column, colIndex)}>{renderNode}</td>;
      })}
    </tr>
  );
}

const MemoRow = React.memo(Row);
MemoRow.displayName = 'Row';

export default MemoRow;
