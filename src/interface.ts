import * as React from 'react';

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
  fixed?: FixedType;
  className?: string;
  ellipsis?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  rowSpan?: number;
  colSpan?: number;
  title?: React.ReactNode;
  children?: ColumnType[];
  render?: (value: any, record: ValueType, index: number) => React.ReactNode | RenderedCell;

  /** @deprecated Please use `onCell` instead */
  onCellClick?: (record: ValueType, e: React.MouseEvent<HTMLElement>) => void;
  onCell?: GetComponentProps<ValueType>;
  onHeaderCell?: GetComponentProps<ColumnType>;
}

export interface InternalColumnType extends ColumnType {
  RC_TABLE_INTERNAL_COL_DEFINE?: object;
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
  expandedRowKeys: Key[];
  expandedRowsHeight: Record<Key, number>;
  fixedColumnsHeadRowsHeight: Record<Key, number | 'auto'>;
  fixedColumnsBodyRowsHeight: Record<Key, number>;
}

export interface TableStore {
  getState: () => TableStoreState;
  setState: (state: Partial<TableStoreState>) => void;
}

// TODO: Fill this
export interface Expander<ValueType = DefaultValueType> {
  props: any;
  needIndentSpaced: boolean;
  handleExpandChange: any;
  renderRows: (
    renderRows: any,
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
  index?: number,
) => React.HTMLAttributes<HTMLElement>;

export type IconExpandEventHandler<ValueType> = (
  record: ValueType,
  event: React.MouseEvent<HTMLElement>,
) => void;

export type CustomizeComponent<
  P extends React.HTMLAttributes<HTMLElement> = React.HTMLAttributes<HTMLElement>
> = React.ComponentType<P> | React.FC<P> | string;

export type LegacyFunction<ValueType> = (
  record: ValueType,
  index: number,
  event: React.SyntheticEvent,
) => void;

export type RenderNode = () => React.ReactNode;

export interface TableComponents {
  table?: CustomizeComponent;
  header?: {
    wrapper?: CustomizeComponent;
    row?: CustomizeComponent;
    cell?: CustomizeComponent;
  };
  body?: {
    wrapper?: CustomizeComponent;
    row?: CustomizeComponent;
    cell?: CustomizeComponent;
  };
}

export type RenderExpandIcon<ValueType> = (props: {
  prefixCls: string;
  expanded: boolean;
  record: ValueType;
  needIndentSpaced: boolean;
  expandable: boolean;
  onExpand: IconExpandEventHandler<ValueType>;
}) => React.ReactNode;

export type RenderRows<ValueType> = (
  renderData: ValueType[],
  indent: number,
  ancestorKeys?: Key[],
) => React.ReactElement[];

export type ExpandedRowRender<ValueType> = (
  record: ValueType,
  index: number,
  indent: number,
  expanded: boolean,
) => React.ReactNode;

export type ScrollPosition = 'left' | 'middle' | 'right' | 'both';
