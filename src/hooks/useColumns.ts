import React from 'react';
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
      return [...list, ...flatColumns(column.children)];
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
  return [mergedColumns, flattenColumns];
}

export default useColumns;
