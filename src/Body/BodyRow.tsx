import * as React from 'react';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import Cell from '../Cell';
import TableContext from '../context/TableContext';
import BodyContext from '../context/BodyContext';
import { getColumnKey } from '../utils/valueUtil';
import {
  ColumnType,
  StickyOffsets,
  CustomizeComponent,
  GetComponentProps,
  Key,
  GetRowKey,
} from '../interface';
import ResizeContext from '../context/ResizeContext';
import { getCellFixedInfo } from '../utils/fixUtil';
import ExpandedRow from './ExpandedRow';

export interface BodyRowProps<RecordType> {
  record: RecordType;
  index: number;
  className?: string;
  style?: React.CSSProperties;
  /** Set if need collect column width info */
  measureColumnWidth: boolean;
  stickyOffsets: StickyOffsets;
  recordKey: Key;
  expandedKeys: Set<Key>;
  rowComponent: CustomizeComponent;
  cellComponent: CustomizeComponent;
  onRow: GetComponentProps<RecordType>;
  rowExpandable: (record: RecordType) => boolean;
  indent?: number;
  getRowKey: GetRowKey<RecordType>;
}

function BodyRow<RecordType>(props: BodyRowProps<RecordType>) {
  const {
    className,
    style,
    stickyOffsets,
    record,
    index,
    getRowKey,
    rowExpandable,
    onRow,
    indent = 0,
    rowComponent: RowComponent,
    cellComponent,
    measureColumnWidth,
  } = props;
  const { prefixCls } = React.useContext(TableContext);
  const {
    fixHeader,
    fixColumn,
    componentWidth,
    flattenColumns,
    expandableType,
    expandRowByClick,
    onTriggerExpand,
    rowClassName,
    expandedRowClassName,
    indentSize,
    expandIcon,
    expandedRowRender,
  } = React.useContext(BodyContext);
  const { onColumnResize } = React.useContext(ResizeContext);
  const [expandRended, setExpandRended] = React.useState(false);

  const expanded = props.expandedKeys.has(props.recordKey);

  React.useEffect(() => {
    if (expanded) {
      setExpandRended(true);
    }
  }, [expanded]);

  // Move to Body to enhance performance
  const fixedInfoList = flattenColumns.map((column, colIndex) =>
    getCellFixedInfo(colIndex, colIndex, flattenColumns, stickyOffsets),
  );

  const rowSupportExpand = expandableType === 'row' && (!rowExpandable || rowExpandable(record));
  // Only when row is not expandable and `children` exist in record
  const nestExpandable = expandableType === 'nest';
  const hasNestChildren = 'children' in record;
  const mergedExpandable = rowSupportExpand || nestExpandable;

  // =========================== onRow ===========================
  let additionalProps: React.HTMLAttributes<HTMLElement>;
  if (onRow) {
    additionalProps = onRow(record, index);
  }

  const onClick: React.MouseEventHandler<HTMLTableRowElement> = (event, ...args) => {
    if (expandRowByClick && mergedExpandable) {
      onTriggerExpand(record, event);
    }

    if (additionalProps && additionalProps.onClick) {
      additionalProps.onClick(event, ...args);
    }
  };

  // ======================== Base tr row ========================
  let computeRowClassName: string;
  if (typeof rowClassName === 'string') {
    computeRowClassName = rowClassName;
  } else if (typeof rowClassName === 'function') {
    computeRowClassName = rowClassName(record, index, indent);
  }

  const baseRowNode = (
    <RowComponent
      {...additionalProps}
      className={classNames(
        className,
        `${prefixCls}-row`,
        `${prefixCls}-row-level-${indent}`,
        computeRowClassName,
        additionalProps && additionalProps.className,
      )}
      style={{
        ...style,
        ...(additionalProps ? additionalProps.style : null),
      }}
      onClick={onClick}
    >
      {flattenColumns.map((column: ColumnType<RecordType>, colIndex) => {
        const { render, dataIndex, className: columnClassName } = column;

        const key = getColumnKey(column, colIndex);
        const fixedInfo = fixedInfoList[colIndex];

        // ============= Used for nest expandable =============
        let appendCellNode: React.ReactNode;
        if (colIndex === 0 && nestExpandable) {
          appendCellNode = (
            <>
              <span
                style={{ paddingLeft: `${indentSize * indent}px` }}
                className={`${prefixCls}-indent indent-level-${indent}`}
              />
              {expandIcon({
                prefixCls,
                expanded,
                expandable: hasNestChildren,
                record,
                onExpand: onTriggerExpand,
              })}
            </>
          );
        }

        let additionalCellProps: React.HTMLAttributes<HTMLElement>;
        if (column.onCell) {
          additionalCellProps = column.onCell(record, index);
        }

        const cellNode = (
          <Cell
            className={columnClassName}
            ellipsis={column.ellipsis}
            component={cellComponent}
            prefixCls={prefixCls}
            key={key}
            record={record}
            index={index}
            dataIndex={dataIndex}
            render={render}
            {...fixedInfo}
            appendNode={appendCellNode}
            additionalProps={additionalCellProps}
          />
        );

        if (measureColumnWidth) {
          return (
            <ResizeObserver
              key={key}
              onResize={({ width }) => {
                onColumnResize(colIndex, width);
              }}
            >
              {cellNode}
            </ResizeObserver>
          );
        }

        return cellNode;
      })}
    </RowComponent>
  );

  // ======================== Expand Row =========================
  let expandRowNode: React.ReactElement;
  if (rowSupportExpand && (expandRended || expanded)) {
    const expandContent = expandedRowRender(record, index, indent + 1, expanded);
    const computedExpandedRowClassName =
      expandedRowClassName && expandedRowClassName(record, index, indent);
    expandRowNode = (
      <ExpandedRow
        expanded={expanded}
        className={computedExpandedRowClassName}
        prefixCls={prefixCls}
        fixHeader={fixHeader}
        fixColumn={fixColumn}
        component={RowComponent}
        componentWidth={componentWidth}
        indent={indent}
        cellComponent={cellComponent}
        colSpan={flattenColumns.length}
      >
        {expandContent}
      </ExpandedRow>
    );
  }

  // ========================= Nest Row ==========================
  let nestRowNode: React.ReactElement;
  if (hasNestChildren && expanded) {
    nestRowNode = ((record as any).children || []).map(
      (subRecord: RecordType, subIndex: number) => {
        const subKey = getRowKey(subRecord, subIndex);

        return (
          <BodyRow
            {...props}
            key={subKey}
            record={subRecord}
            recordKey={subKey}
            index={subIndex}
            indent={indent + 1}
            measureColumnWidth={false}
          />
        );
      },
    );
  }

  return (
    <>
      {baseRowNode}
      {expandRowNode}
      {nestRowNode}
    </>
  );
}

BodyRow.displayName = 'BodyRow';

export default BodyRow;
