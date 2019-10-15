import { Component, MouseEvent } from "react";

export type Layout = "auto" | "fixed";

export interface Scroll {
    x?: boolean | number;
    y?: boolean | number;
}

export type ColumnProps = { [key in string]: any };

export interface ColumnRenderOutput {
    children: JSX.Element | string,
    props: ColumnProps
}

export interface Column<RecordType> {
    key: string;

    className?: string;

    colSpan?: number;

    title: string | JSX.Element;

    dataIndex?: string;

    width?: number | string;  //it can be a string for percentage values

    fixed?: string | Boolean;

    align?: string;

    ellipsis?: Boolean;

    onCell?: ((record: RecordType, index: number) => Object);

    onHeaderCell?: ((column: Column<RecordType>) => Object);

    render?: (value: JSX.Element | string, row: RecordType, index: number) => ColumnRenderOutput;
}

export interface TableProps<RecordType> {
    tableLayout?: Layout;

    prefixCls?: string;

    className?: string;

    id?: string;

    tableNodeRef?: ((node: HTMLElement) => void);

    useFixedHeader?: boolean;

    scroll?: Scroll;

    expandIconAsCell?: boolean;

    expandIconColumnIndex?: number;

    rowKey?: string | ((record: RecordType) => string);

    rowClassName?: string | ((record: RecordType, index: number, indent: number) => string);

    rowRef?: ((record: RecordType, index: number, indent: number) => string);

    defaultExpandedRowKeys?: string[];

    expandedRowKeys?: string[];

    defaultExpandAllRows?: boolean;

    onExpandedRowsChange?: ((rows: RecordType[]) => void);

    onExpand?: ((expanded: boolean, record: RecordType) => void);

    expandedRowClassName?: ((record: RecordType, index: number, indent: number) => string);

    expandedRowRender?: ((record: RecordType, index: number, indent: number, expanded: boolean) => string);

    data: RecordType[];

    indentSize?: number;

    onRow?: ((record: any, index: number) => any);

    onHeaderRow?: ((record: RecordType, index: number) => any);

    showHeader?: boolean;

    title?: ((currentData: RecordType[]) => JSX.Element);

    footer?: ((currentData: RecordType[]) => JSX.Element);

    emptyText?: string | JSX.Element | (() => JSX.Element);

    columns: Column<RecordType>[];

    components?: any;
}

export default class Table<RecordType> extends Component<TableProps<RecordType>> { }
