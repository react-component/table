import type { ColumnsType, ColumnType } from '../interface';

interface Column<RecordType> extends ColumnType<RecordType> {
  colSpanSpecified?: number;
  rowSpanSpecified?: number;
  parentsRowCount?: number;
  children?: Column<RecordType>[];
}

export function convertColumns<RecordType = Column<any>>(
  columns: ColumnsType<RecordType>,
): ColumnsType<RecordType> {
  if (!Array.isArray(columns) || columns.length === 0) {
    return [];
  }

  let depthCurr = 0;
  let depthNext = 0;
  const nodePos: {
    index: number;
    total: number;
  }[] = [{ index: columns.length, total: columns.length }];
  const rowSpans: number[] = [];
  const columnsMap = new Map<number, Column<RecordType>[]>();
  const treeMap = new Map<Column<RecordType>, Column<RecordType>[]>();
  const lastSet = new Set<Column<RecordType>>();

  let specified = false;
  let tree: Column<RecordType>[] = columns.map(item => ({ ...item }));

  while (tree.length > 0) {
    depthCurr = depthNext;

    nodePos.splice(depthCurr + 1);
    rowSpans.splice(depthCurr);

    nodePos[depthCurr].index--;

    if (nodePos[depthCurr].index <= 0) {
      depthNext = 0;

      for (let i = nodePos.length - 1; i >= 0; i--) {
        if (nodePos[i].index > 0) {
          depthNext = i;
          break;
        }
      }
    }

    const node = tree.shift();

    if (!node || typeof node !== 'object' || node.hidden) {
      continue;
    }

    const colSpanSpecified = node.colSpan;
    const rowSpanSpecified = node.rowSpan;
    const colSpan = node.colSpan ?? 1;
    const rowSpan = node.rowSpan ?? 1;
    node.colSpan = colSpan;
    node.rowSpan = rowSpan;

    if (!specified && (colSpan > 1 || rowSpan > 1)) {
      specified = true;
    }

    const parentsRowCount = rowSpans.reduce((acc, num) => acc + num, 0);
    if (!columnsMap.has(parentsRowCount)) {
      columnsMap.set(parentsRowCount, []);
    }
    columnsMap.get(parentsRowCount).push(node);

    let leaf = node.children;
    delete node.children;

    if (Array.isArray(leaf) && leaf.length > 0) {
      depthNext = depthCurr + 1;
      nodePos[depthNext] = { index: leaf.length, total: leaf.length };
      rowSpans[depthCurr] = rowSpan;

      leaf = leaf.map(item => ({ ...item }));
      node.colSpanSpecified = colSpanSpecified;
      if (!treeMap.has(node)) {
        treeMap.set(node, []);
      }
      treeMap.get(node).push(...leaf);
      tree = [...leaf, ...tree];
    } else {
      node.rowSpanSpecified = rowSpanSpecified;
      node.parentsRowCount = parentsRowCount;
      lastSet.add(node);
    }
  }

  if (!specified) {
    return columns;
  }

  // correct colSpan of parent column in default state
  [...treeMap.keys()].reverse().forEach(column => {
    const { colSpanSpecified } = column;
    delete column.colSpanSpecified;

    if (column.hidden || Number.isInteger(colSpanSpecified)) {
      return;
    }

    const children = treeMap.get(column);
    column.colSpan = children.reduce((acc, item) => {
      return item.hidden ? acc : acc + item.colSpan;
    }, 0);
  });

  let rowCountMax = 0;
  lastSet.forEach(column => {
    const rowCount = column.rowSpan + column.parentsRowCount;
    if (rowCount > rowCountMax) {
      rowCountMax = rowCount;
    }
  });

  // correct rowSpan of column in default state
  lastSet.forEach(column => {
    const { rowSpanSpecified, parentsRowCount } = column;

    if (!Number.isInteger(rowSpanSpecified)) {
      column.rowSpan = rowCountMax - parentsRowCount;
    }

    delete column.rowSpanSpecified;
    delete column.parentsRowCount;
  });

  const keys = [...columnsMap.keys()].sort();
  for (let i = keys.length - 1; i >= 1; i--) {
    const parent = columnsMap.get(keys[i - 1]);
    parent[0].children = columnsMap.get(keys[i]);
  }

  return columnsMap.get(0) as unknown as ColumnsType<RecordType>;
}
