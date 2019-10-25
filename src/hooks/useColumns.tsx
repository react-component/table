import * as React from 'react';
import warning from 'rc-util/lib/warning';
import toArray from 'rc-util/lib/Children/toArray';
import {
  ColumnsType,
  ColumnType,
  FixedType,
  Key,
  GetRowKey,
  TriggerEventHandler,
  RenderExpandIcon,
} from '../interface';
import { renderExpandIcon } from '../utils/expandUtil';
import { INTERNAL_COL_DEFINE } from '../utils/legacyUtil';

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

function warningFixed(flattenColumns: { fixed?: FixedType }[]) {
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

/**
 * Parse `columns` & `children` into `columns`.
 */
function useColumns<RecordType>({
  prefixCls,
  columns,
  children,
  expandable,
  expandedKeys,
  getRowKey,
  onTriggerExpand,
  expandIcon,
  rowExpandable,
}: {
  prefixCls?: string;
  columns?: ColumnsType<RecordType>;
  children?: React.ReactNode;
  expandable: boolean;
  expandedKeys: Set<Key>;
  getRowKey: GetRowKey<RecordType>;
  onTriggerExpand: TriggerEventHandler<RecordType>;
  expandIcon?: RenderExpandIcon<RecordType>;
  rowExpandable?: (record: RecordType) => boolean;
}): [ColumnsType<RecordType>, ColumnType<RecordType>[]] {
  const mergedColumns = React.useMemo<ColumnsType<RecordType>>(
    () => columns || convertChildrenToColumns(children),
    [columns, children],
  );

  // Add expand column
  const withExpandColumns = React.useMemo<ColumnsType<RecordType>>(() => {
    if (expandable) {
      const firstColumn = mergedColumns[0];

      return [
        {
          [INTERNAL_COL_DEFINE]: {
            className: `${prefixCls}-expand-icon-col`,
          },
          title: '',
          fixed: firstColumn ? firstColumn.fixed : null,
          className: `${prefixCls}-row-expand-icon-cell`,
          render: (_, record, index) => {
            const rowKey = getRowKey(record, index);
            const expanded = expandedKeys.has(rowKey);
            const recordExpandable = rowExpandable ? rowExpandable(record) : true;

            return expandIcon({
              prefixCls,
              expanded,
              expandable: recordExpandable,
              record,
              onExpand: onTriggerExpand,
            });
          },
        },
        ...mergedColumns,
      ];
    }
    return mergedColumns;
  }, [expandable, mergedColumns, getRowKey, expandedKeys, expandIcon]);

  const flattenColumns = React.useMemo(() => flatColumns(withExpandColumns), [withExpandColumns]);

  // Only check out of production since it's waste for each render
  if (process.env.NODE_ENV !== 'production') {
    warningFixed(flattenColumns);
  }

  return [withExpandColumns, flattenColumns];
}

export default useColumns;