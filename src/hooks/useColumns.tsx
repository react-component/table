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
import { INTERNAL_COL_DEFINE } from '../utils/legacyUtil';

function convertChildrenToColumns<RecordType>(children: React.ReactNode): ColumnsType<RecordType> {
  return toArray(children)
    .filter(node => React.isValidElement(node))
    .map(({ key, props }: React.ReactElement) => {
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
    const { fixed } = column;

    // Convert `fixed='true'` to `fixed='left'` instead
    const parsedFixed = fixed === true ? 'left' : fixed;

    if ('children' in column) {
      return [
        ...list,
        ...flatColumns(column.children).map(subColum => ({
          fixed: parsedFixed,
          ...subColum,
        })),
      ];
    }
    return [
      ...list,
      {
        ...column,
        fixed: parsedFixed,
      },
    ];
  }, []);
}

function warningFixed(flattenColumns: { fixed?: FixedType }[]) {
  let allFixLeft = true;
  for (let i = 0; i < flattenColumns.length; i += 1) {
    const col = flattenColumns[i];
    if (allFixLeft && col.fixed !== 'left') {
      allFixLeft = false;
    } else if (!allFixLeft && col.fixed === 'left') {
      warning(false, `Index ${i - 1} of \`columns\` missing \`fixed='left'\` prop.`);
      break;
    }
  }

  let allFixRight = true;
  for (let i = flattenColumns.length - 1; i >= 0; i -= 1) {
    const col = flattenColumns[i];
    if (allFixRight && col.fixed !== 'right') {
      allFixRight = false;
    } else if (!allFixRight && col.fixed === 'right') {
      warning(false, `Index ${i + 1} of \`columns\` missing \`fixed='right'\` prop.`);
      break;
    }
  }
}

/**
 * Parse `columns` & `children` into `columns`.
 */
function useColumns<RecordType>(
  {
    prefixCls,
    columns,
    children,
    expandable,
    expandedKeys,
    getRowKey,
    onTriggerExpand,
    expandIcon,
    rowExpandable,
    expandIconColumnIndex,
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
    expandIconColumnIndex?: number;
  },
  transformColumns: (columns: ColumnsType<RecordType>) => ColumnsType<RecordType>,
): [ColumnsType<RecordType>, ColumnType<RecordType>[]] {
  const baseColumns = React.useMemo<ColumnsType<RecordType>>(
    () => columns || convertChildrenToColumns(children),
    [columns, children],
  );

  // Add expand column
  const withExpandColumns = React.useMemo<ColumnsType<RecordType>>(() => {
    if (expandable) {
      const expandColIndex = expandIconColumnIndex || 0;
      const prevColumn = baseColumns[expandColIndex];

      const expandColumn = {
        [INTERNAL_COL_DEFINE]: {
          className: `${prefixCls}-expand-icon-col`,
        },
        title: '',
        fixed: prevColumn ? prevColumn.fixed : null,
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
      };

      // Insert expand column in the target position
      const cloneColumns = baseColumns.slice();
      cloneColumns.splice(expandColIndex, 0, expandColumn);

      return cloneColumns;
    }
    return baseColumns;
  }, [expandable, baseColumns, getRowKey, expandedKeys, expandIcon]);

  const mergedColumns = React.useMemo(() => {
    let finalColumns = withExpandColumns;
    if (transformColumns) {
      finalColumns = transformColumns(finalColumns);
    }

    // Always provides at least one column for table display
    if (!finalColumns.length) {
      finalColumns = [
        {
          render: () => null,
        },
      ];
    }

    return finalColumns;
  }, [transformColumns, withExpandColumns]);

  const flattenColumns = React.useMemo(() => flatColumns(mergedColumns), [mergedColumns]);

  // Only check out of production since it's waste for each render
  if (process.env.NODE_ENV !== 'production') {
    warningFixed(flattenColumns);
  }

  return [mergedColumns, flattenColumns];
}

export default useColumns;
