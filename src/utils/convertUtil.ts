import type { CellType, ColumnsType, ColumnType, FixedType, HeadMatrix, Key } from '../interface';

interface Column<RecordType> extends ColumnType<RecordType> {
  colSpanSpecified?: number;
  rowSpanSpecified?: number;
  colStart?: number;
  colEnd?: number;
  children?: Column<RecordType>[];
}

export function convertColumns<RecordType = Column<any>>(
  columns: ColumnsType<RecordType>,
): [
  headCells: CellType<RecordType>[][],
  headMatrix: HeadMatrix,
  lastColumns: readonly ColumnType<RecordType>[],
] {
  if (!Array.isArray(columns) || columns.length === 0) {
    return [[[]], [0, 0], []];
  }

  let depthCurr = 0;
  let depthNext = 0;
  const nodePos: {
    index: number;
    total: number;
  }[] = [{ index: columns.length, total: columns.length }];
  const pKeys: Key[] = [];
  const rowSpans: number[] = [];
  const columnsMap = new Map<number, Column<RecordType>[]>();
  const flatMap = new Map<
    Key,
    /**
     * 0 => current column
     * 1 => parent key
     * 2 => parents row count
     */
    [Column<RecordType>, undefined | Key, undefined | number]
  >();
  const treeMap = new Map<Column<RecordType>, Column<RecordType>[]>();
  const lastSet = new Set<Column<RecordType>>();

  let rowCountMax = 0;
  let tree: Column<RecordType>[] = [...columns];

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
      const { index, total } = nodePos[depthCurr];
      const currIndex = total - 1 - index;
      const parentKey = pKeys[depthCurr - 1];

      if (parentKey === undefined) {
        columns.splice(currIndex, 1);
      } else {
        const parent = flatMap.get(parentKey)?.[0];
        parent?.children?.splice(currIndex, 1);
      }

      nodePos[depthCurr].total--;
      continue;
    }

    const colSpanSpecified = node.colSpan;
    const rowSpanSpecified = node.rowSpan;
    const colSpan = node.colSpan ?? 1;
    const rowSpan = node.rowSpan ?? 1;
    node.colSpan = colSpan;
    node.rowSpan = rowSpan;
    node.fixed = node.fixed === true ? 'left' : node.fixed;

    const parentsRowCount = rowSpans.reduce((acc, num) => acc + num, 0);
    if (!columnsMap.has(parentsRowCount)) {
      columnsMap.set(parentsRowCount, []);
    }
    columnsMap.get(parentsRowCount)!.push(node);
    // // mark vertical position of cell in table head matrix
    // node.rowStart = parentsRowCount;
    // node.rowEnd = node.rowStart + rowSpan - 1;

    const pathKey = nodePos.reduce((acc, { index, total }) => {
      return `${acc}-${total - 1 - index}`;
    }, 'key');
    node.key = node.key && !flatMap.has(node.key) ? node.key : pathKey;
    flatMap.set(node.key, [node, pKeys[depthCurr - 1], parentsRowCount]);

    const leaf = node.children;
    if (Array.isArray(leaf) && leaf.length > 0) {
      depthNext = depthCurr + 1;
      nodePos[depthNext] = { index: leaf.length, total: leaf.length };
      rowSpans[depthCurr] = rowSpan;
      pKeys[depthCurr] = node.key;

      node.colSpanSpecified = colSpanSpecified;
      if (!treeMap.has(node)) {
        treeMap.set(node, []);
      }
      treeMap.get(node)!.push(...leaf);
      tree = [...leaf, ...tree];
    } else {
      delete node.children;
      node.rowSpanSpecified = rowSpanSpecified;
      lastSet.add(node);

      // correct vertical cells count of table head matrix
      const rowCount = node.rowSpan + parentsRowCount;
      if (rowCount > rowCountMax) {
        rowCountMax = rowCount;
      }
    }
  }

  // correct colSpan of parent column in default state
  [...treeMap.keys()].reverse().forEach(column => {
    const { colSpanSpecified } = column;
    delete column.colSpanSpecified;

    if (Number.isInteger(colSpanSpecified)) {
      return;
    }

    const children = treeMap.get(column);
    column.colSpan = children!.reduce((acc, { colSpan = 1 }) => acc + colSpan, 0);
  });

  const lastColumns: ColumnType<RecordType>[] = [];
  lastSet.forEach(column => {
    // correct rowSpan of column in default state
    const { rowSpanSpecified } = column;
    const parentsRowCount = column.key ? flatMap.get(column.key)?.[2] ?? 0 : 0;
    delete column.rowSpanSpecified;

    if (!Number.isInteger(rowSpanSpecified)) {
      column.rowSpan = rowCountMax - parentsRowCount;
      // // correct vertical position of cell at last of branch
      // column.rowEnd = column.rowStart ?? 0 + column.rowSpan - 1;
    }

    // collect column at last of branch and correct fixed prop
    let size = flatMap.size;
    let key = column.key;
    const columnsFixed: (undefined | FixedType)[] = [column.fixed];

    while (size-- > 0) {
      const parentKey = key ? flatMap.get(key)?.[1] : null;

      if (!parentKey) {
        break;
      }

      const parentColumn = flatMap.get(parentKey)?.[0];
      key = parentColumn?.key;
      columnsFixed.unshift(parentColumn?.fixed);
    }

    let prev = 0,
      next = 1;
    while (next < columnsFixed.length) {
      if (columnsFixed[prev]) {
        columnsFixed[next] = columnsFixed[prev];
      }
      prev++;
      next++;
    }

    column.fixed = columnsFixed.pop();
    lastColumns.push(column as ColumnType<RecordType>);
  });

  let colCountMax = 0;
  const headCells: CellType<RecordType>[][] = [];
  // generate data of table head and handle horizontal related of table head matrix
  [...columnsMap.keys()].sort().forEach(key => {
    const group: Column<RecordType>[] = columnsMap.get(key) ?? [];

    const cells = group.map((column, index) => {
      // mark horizontal position of cell in table head matrix
      const parentKey = column.key ? flatMap.get(column.key)?.[1] : null;
      const parentColumn = parentKey ? flatMap.get(parentKey)?.[0] : null;
      const parentColStart = parentColumn?.colStart ?? 0;

      const previousIndex = index - 1;
      const previousColumn = previousIndex >= 0 ? group[previousIndex] : null;
      const previousColEnd = previousColumn?.colEnd ?? -1;

      const colSpan = column.colSpan ?? 1;
      const rowSpan = column.rowSpan ?? 1;
      const colStart = Math.max(parentColStart, previousColEnd + 1);
      const colEnd = colStart + colSpan - 1;

      // correct horizontal cells count of table head matrix
      if (colEnd + 1 > colCountMax) {
        colCountMax = colEnd + 1;
      }

      // avoid fixed columns rendering bug, but does not exist on type ColumnType
      column.colStart = colStart;
      column.colEnd = colEnd;

      // table head cell data
      const item = {
        column,
        key: column.key,
        className: column.className || '',
        children: column.title,
        colSpan,
        rowSpan,
        colStart,
        colEnd,
      };

      return item as CellType<RecordType>;
    });

    headCells.push(cells);
  });

  const headMatrix: HeadMatrix = [colCountMax, rowCountMax];

  return [headCells, headMatrix, lastColumns];
}
