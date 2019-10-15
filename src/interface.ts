import React from 'react';

export type Key = React.Key;

export type FixedType = 'left' | 'right' | boolean;

export type DefaultValueType = Record<string, any>;

export interface Column {
  // TODO: https://ant.design/components/table-cn/#Column
  key: Key;
  dataIndex?: Key;
  fixed?: boolean;
  className?: string;
  width?: number;
  rowSpan?: number;
  colSpan?: number;
  title?: React.ReactNode;
}

export interface InternalColumn extends Column {
  RC_TABLE_INTERNAL_COL_DEFINE?: object;
  children?: InternalColumn[];
}

export interface Cell {
  key: Key;
  className: string;
  children: React.ReactNode;
  column: Column;
  colSpan?: number;
  rowSpan?: number;
}

export interface TableStoreState {
  currentHoverKey: Key;
}

export interface TableStore {
  getState: () => TableStoreState;
  setState: (state: Partial<TableStoreState>) => void;
}

export type RenderRows<ValueType> = (
  renderData: ValueType[],
  indent: number,
  ancestorKeys?: Key[],
) => React.ReactElement[];

// TODO: Fill this
export interface Expander<ValueType = DefaultValueType> {
  props: any;
  needIndentSpaced: boolean;
  handleExpandChange: any;
  renderRows: (
    renderRows: RenderRows<ValueType>,
    rows: React.ReactElement[],
    record: ValueType,
    index: number,
    indent: number,
    fixed: FixedType,
    key: Key,
    ancestorKeys: Key[],
  ) => React.ReactElement[];
  renderExpandIndentCell: (rows: Cell[][], fixed: FixedType) => void;
}

export type GetRowKey<ValueType> = (value: ValueType, index: number) => Key;

export type RowHoverHandler = (isHover: boolean, key: Key) => void;

export type OnHeaderRow = any;
