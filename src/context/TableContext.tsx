import * as React from 'react';
import { ColumnType, DefaultRecordType, ColumnsType, GetRowKey, GetComponent } from '../interface';

export interface TableContextProps<RecordType = DefaultRecordType> {
  columns: ColumnsType<RecordType>;
  flattenColumns: ColumnType<RecordType>[];
  prefixCls: string;
  getComponent: GetComponent;
  getRowKey: GetRowKey<RecordType>;
  componentWidth: number;
  fixHeader: boolean;
  fixColumn: boolean;
}

const TableContext = React.createContext<TableContextProps>(null);

export default TableContext;

export type DefaultPureCompareProps<RecordType, RestProps> = {
  context: TableContextProps<RecordType>;
} & RestProps;

export interface PureContextConsumerProps<RecordType, RestProps, CompareProps> {
  shouldUpdate?: (prevProps: CompareProps, props: CompareProps) => boolean;
  useComputeProps?: (props: DefaultPureCompareProps<RecordType, RestProps>) => CompareProps;
  children: (props: CompareProps) => React.ReactElement;
}

function defaultComputeProps<P>(p: P) {
  return p;
}

export function PureContextConsumer<
  RecordType,
  RestProps,
  CompareProps = DefaultPureCompareProps<RecordType, RestProps>
>(
  props: PureContextConsumerProps<RecordType, RestProps, CompareProps> & RestProps,
): React.ReactElement {
  const { children, shouldUpdate, useComputeProps = defaultComputeProps, ...restProps } = props;
  const propsRef = React.useRef<CompareProps>(null);
  const childrenRef = React.useRef<React.ReactElement>(null);
  const context = React.useContext(TableContext);

  const compareProps = { context, ...restProps } as any;
  const computedProps: CompareProps = useComputeProps(compareProps);

  if (!propsRef.current || !shouldUpdate || shouldUpdate(propsRef.current, computedProps)) {
    childrenRef.current = children(computedProps);
  }
  propsRef.current = computedProps;

  return childrenRef.current;
}
