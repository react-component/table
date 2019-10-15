import React from 'react';

export type Key = React.Key;

export type FixedType = 'left' | 'right' | boolean;

export type DefaultValueType = Record<string, any>;

export interface RenderedCell {
  props?: Cell;
  children?: React.ReactNode;
}

export interface ColumnType<ValueType = DefaultValueType> {
  // TODO: https://ant.design/components/table-cn/#Column
  key?: Key;
  dataIndex?: Key;
  fixed?: boolean;
  className?: string;
  ellipsis?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  rowSpan?: number;
  colSpan?: number;
  title?: React.ReactNode;
  render?: (value: any, record: ValueType, index: number) => React.ReactNode | RenderedCell;

  /** @deprecated Please use `onCell` instead */
  onCellClick?: (record: ValueType, e: React.MouseEvent<HTMLElement>) => void;
  onCell?: GetComponentProps<ValueType>;
  onHeaderCell?: GetComponentProps<ColumnType>;
}

export interface InternalColumnType extends ColumnType {
  RC_TABLE_INTERNAL_COL_DEFINE?: object;
  children?: InternalColumnType[];
}

export interface Cell {
  key?: Key;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  column?: ColumnType;
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

export type RowHoverEventHandler = (isHover: boolean, key: Key) => void;

export type GetComponentProps<DataType> = (
  data: DataType,
  index: number,
) => {
  onClick?: React.MouseEventHandler<HTMLElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLElement>;
  onContextMenu?: React.MouseEventHandler<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
};

export type ExpandEventHandler<ValueType> = (
  record: ValueType,
  event: React.MouseEvent<HTMLElement>,
) => void;

export type CustomizeComponent<
  P extends React.HTMLAttributes<HTMLElement> = React.HTMLAttributes<HTMLElement>
> = React.ComponentType<P> | React.FC<P> | string;
