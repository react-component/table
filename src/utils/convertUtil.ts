interface Column {
  [key: string | symbol]: any;
}

interface Options {
  children: string;
  colSpan: string;
  rowSpan: string;
  hidden: string;
}

export function convertColumns<Columns extends readonly any[] = Column[]>(
  columns: Columns,
  options: Partial<Options> = {},
) {
  if (!Array.isArray(columns) || columns.length === 0) {
    return [] as unknown as Columns;
  }

  const defaultOptions = {
    children: 'children',
    colSpan: 'colSpan',
    rowSpan: 'rowSpan',
    hidden: 'hidden',
  };
  const {
    children: childrenProp,
    colSpan: colSpanProp,
    rowSpan: rowSpanProp,
    hidden: hiddenProp,
  } = Object.assign({}, defaultOptions, options);

  let specified = false;
  let tree = columns.map(item => ({ ...item }) as Column);

  let depthCurr = 0;
  let depthNext = 0;
  const nodePos: {
    index: number;
    total: number;
  }[] = [
    {
      index: tree.length,
      total: tree.length,
    },
  ];
  const rowSpans: number[] = [];
  const columnsMap = new Map<number, Column[]>();
  const treeMap = new Map<Column, Column[]>();
  const branchLastSet = new Set<Column>();

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

    if (!node || typeof node !== 'object' || node[hiddenProp]) {
      continue;
    }

    const colSpanSpecified = node[colSpanProp];
    const rowSpanSpecified = node[rowSpanProp];
    const colSpan = node[colSpanProp] ?? 1;
    const rowSpan = node[rowSpanProp] ?? 1;
    node[colSpanProp] = colSpan;
    node[rowSpanProp] = rowSpan;

    if (!specified && (colSpan > 1 || rowSpan > 1)) {
      specified = true;
    }

    const parentsRowCount = rowSpans.reduce((acc, num) => acc + num, 0);
    if (!columnsMap.has(parentsRowCount)) {
      columnsMap.set(parentsRowCount, []);
    }
    columnsMap.get(parentsRowCount).push(node);

    let leaf = node[childrenProp];
    delete node[childrenProp];

    if (Array.isArray(leaf) && leaf.length > 0) {
      depthNext = depthCurr + 1;
      nodePos[depthNext] = { index: leaf.length, total: leaf.length };
      rowSpans[depthCurr] = rowSpan;

      leaf = leaf.map(item => ({ ...item }) as Column);
      node.colSpanSpecified = colSpanSpecified;
      if (!treeMap.has(node)) {
        treeMap.set(node, []);
      }
      treeMap.get(node).push(...leaf);
      tree = [...leaf, ...tree];
    } else {
      node.rowSpanSpecified = rowSpanSpecified;
      node.parentsRowCount = parentsRowCount;
      branchLastSet.add(node);
    }
  }

  if (!specified) {
    return columns;
  }

  // correct colSpan of parent column in default state
  [...treeMap.keys()].reverse().forEach(column => {
    const { colSpanSpecified } = column;
    delete column.colSpanSpecified;

    if (column[hiddenProp] || Number.isInteger(colSpanSpecified)) {
      return;
    }

    const children = treeMap.get(column);
    column[colSpanProp] = children.reduce((acc, item) => {
      return item[hiddenProp] ? acc : acc + item[colSpanProp];
    }, 0);
  });

  let rowCountMax = 0;
  branchLastSet.forEach(column => {
    const rowCount = column[rowSpanProp] + column.parentsRowCount;
    if (rowCount > rowCountMax) {
      rowCountMax = rowCount;
    }
  });

  // correct rowSpan of column in default state
  branchLastSet.forEach(column => {
    const { rowSpanSpecified, parentsRowCount } = column;

    if (!Number.isInteger(rowSpanSpecified)) {
      column[rowSpanProp] = rowCountMax - parentsRowCount;
    }

    delete column.rowSpanSpecified;
    delete column.parentsRowCount;
  });

  const keys = [...columnsMap.keys()].sort();
  for (let i = keys.length - 1; i >= 1; i--) {
    const parent = columnsMap.get(keys[i - 1]);
    parent[0][childrenProp] = columnsMap.get(keys[i]);
  }

  return columnsMap.get(0) as unknown as Columns;
}
