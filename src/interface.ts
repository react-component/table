import React from 'react';

export type Key = React.Key;

export type FixedType = 'left' | 'right' | boolean;

export type DefaultRecordType = Record<string, any>;

export interface Cell<RecordType> {
  key?: Key;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  column?: ColumnType<RecordType>;
  colSpan?: number;
  rowSpan?: number;
}

export interface RenderedCell<RecordType> {
  props?: Cell<RecordType>;
  children?: React.ReactNode;
}

export type DataIndex = string | number | (string | number)[];

export interface ColumnType<RecordType> {
  align?: 'left' | 'center' | 'right';
  children?: ColumnType<RecordType>[];
  className?: string;
  colSpan?: number;
  dataIndex?: DataIndex;
  ellipsis?: boolean;
  fixed?: FixedType;
  key?: Key;
  render?: (
    value: any,
    record: RecordType,
    index: number,
  ) => React.ReactNode | RenderedCell<RecordType>;
  rowSpan?: number;
  title?: React.ReactNode;
  width?: number | string;
  onCell?: GetComponentProps<RecordType>;
  /** @deprecated Please use `onCell` instead */
  onCellClick?: (record: RecordType, e: React.MouseEvent<HTMLElement>) => void;
  onHeaderCell?: GetComponentProps<RecordType>;

  // Applied in antd
  // https://ant.design/components/table-cn/#Column
  // defaultSortOrder
  // filterDropdown
  // filterDropdownVisible
  // filtered
  // filteredValue
  // filterIcon
  // filterMultiple
  // filters
  // sorter
  // sortOrder
  // sortDirections
  // onFilter
  // onFilterDropdownVisibleChange
}

export type GetComponentProps<DataType> = (
  data: DataType,
  index?: number,
) => React.HTMLAttributes<HTMLElement>;

export type GetRowKey<RecordType> = (record: RecordType, index: number) => Key;
