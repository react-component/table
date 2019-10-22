import React from 'react';
import warning from 'rc-util/lib/warning';
import toArray from 'rc-util/lib/Children/toArray';
import { ColumnsType, ColumnType } from '../interface';

function convertChildrenToColumns<RecordType>(children: React.ReactNode): ColumnsType<RecordType> {
  return toArray(children).map(({ key, props }: React.ReactElement) => {
    const { children: nodeChildren, ...restProps } = props;
    const column = {
      key,
      ...restProps,
    };

    if (nodeChildren) {
      column.children = convertChildrenToColumns(nodeChildren);
    }

    return column;
  });
}

function flatColumns<RecordType>(columns: ColumnsType<RecordType>): ColumnType<RecordType>[] {
  return columns.reduce((list, column) => {
    if ('children' in column) {
      const { fixed } = column;
      return [
        ...list,
        ...flatColumns(column.children).map(subColum => ({
          fixed,
          ...subColum,
        })),
      ];
    }
    return [...list, column];
  }, []);
}

function useColumns<RecordType>({
  columns,
  children,
}: {
  columns?: ColumnsType<RecordType>;
  children?: React.ReactNode;
}): [ColumnsType<RecordType>, ColumnType<RecordType>[]] {
  const mergedColumns = React.useMemo<ColumnsType<RecordType>>(
    () => columns || convertChildrenToColumns(children),
    [columns, children],
  );

  const flattenColumns = React.useMemo(() => flatColumns(mergedColumns), [mergedColumns]);

  // Only check out of production since it's waste for each render
  if (process.env.NODE_ENV !== 'production') {
    let allFixLeft = true;
    for (let i = 0; i < flattenColumns.length; i += 1) {
      const col = flattenColumns[i];
      if (allFixLeft && col.fixed !== 'left') {
        allFixLeft = false;
      } else if (!allFixLeft && col.fixed === 'left') {
        warning(false, `Index ${i} of \`columns\` missing \`fixed='left'\` prop.`);
        break;
      }
    }

    let allFixRight = true;
    for (let i = flattenColumns.length - 1; i >= 0; i -= 1) {
      const col = flattenColumns[i];
      if (allFixRight && col.fixed !== 'right') {
        allFixRight = false;
      } else if (!allFixRight && col.fixed === 'right') {
        warning(false, `Index ${i} of \`columns\` missing \`fixed='right'\` prop.`);
        break;
      }
    }
  }

  return [mergedColumns, flattenColumns];
}

export default useColumns;
