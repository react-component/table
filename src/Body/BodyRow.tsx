import * as React from 'react';
import classNames from 'classnames';
import Cell from '../Cell';
import TableContext from '../context/TableContext';
import BodyContext from '../context/BodyContext';
import { getColumnsKey } from '../utils/valueUtil';
import { ColumnType, CustomizeComponent, GetComponentProps, Key, GetRowKey } from '../interface';
import ExpandedRow from './ExpandedRow';

export interface BodyRowProps<RecordType> {
  record: RecordType;
  index: number;
  className?: string;
  style?: React.CSSProperties;
  recordKey: Key;
  expandedKeys: Set<Key>;
  rowComponent: CustomizeComponent;
  cellComponent: CustomizeComponent;
  onRow: GetComponentProps<RecordType>;
  rowExpandable: (record: RecordType) => boolean;
  indent?: number;
  rowKey: React.Key;
  getRowKey: GetRowKey<RecordType>;
  childrenColumnName: string;
}

function BodyRow<RecordType extends { children?: RecordType[] }>(props: BodyRowProps<RecordType>) {
  const {
    className,
    style,
    record,
    index,
    rowKey,
    getRowKey,
    rowExpandable,
    expandedKeys,
    onRow,
    indent = 0,
    rowComponent: RowComponent,
    cellComponent,
    childrenColumnName,
  } = props;
  const { prefixCls, fixedInfoList } = React.useContext(TableContext);
  const {
    fixHeader,
    fixColumn,
    horizonScroll,
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
    expandIconColumnIndex,
  } = React.useContext(BodyContext);
  const [expandRended, setExpandRended] = React.useState(false);

  const expanded = expandedKeys && expandedKeys.has(props.recordKey);

  React.useEffect(() => {
    if (expanded) {
      setExpandRended(true);
    }
  }, [expanded]);

  const rowSupportExpand = expandableType === 'row' && (!rowExpandable || rowExpandable(record));
  // Only when row is not expandable and `children` exist in record
  const nestExpandable = expandableType === 'nest';
  const hasNestChildren = childrenColumnName && record && record[childrenColumnName];
  const mergedExpandable = rowSupportExpand || nestExpandable;

  // =========================== onRow ===========================
  let additionalProps: React.HTMLAttributes<HTMLElement>;
  if (onRow) {
    additionalProps = onRow(record, index);
  }

  const onClick: React.MouseEventHandler<HTMLElement> = (event, ...args) => {
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

  const columnsKey = getColumnsKey(flattenColumns);
  const baseRowNode = (
    <RowComponent
      {...additionalProps}
      data-row-key={rowKey}
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

        const key = columnsKey[colIndex];
        const fixedInfo = fixedInfoList[colIndex];

        // ============= Used for nest expandable =============
        let appendCellNode: React.ReactNode;
        if (colIndex === (expandIconColumnIndex || 0) && nestExpandable) {
          appendCellNode = (
            <>
              <span
                style={{ paddingLeft: `${indentSize * indent}px` }}
                className={`${prefixCls}-row-indent indent-level-${indent}`}
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

        return (
          <Cell
            className={columnClassName}
            ellipsis={column.ellipsis}
            align={column.align}
            component={cellComponent}
            prefixCls={prefixCls}
            key={key}
            record={record}
            index={index}
            dataIndex={dataIndex}
            render={render}
            shouldCellUpdate={column.shouldCellUpdate}
            {...fixedInfo}
            appendNode={appendCellNode}
            additionalProps={additionalCellProps}
          />
        );
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
        className={classNames(
          `${prefixCls}-expanded-row`,
          `${prefixCls}-expanded-row-level-${indent + 1}`,
          computedExpandedRowClassName,
        )}
        prefixCls={prefixCls}
        fixHeader={fixHeader}
        fixColumn={fixColumn}
        horizonScroll={horizonScroll}
        component={RowComponent}
        componentWidth={componentWidth}
        cellComponent={cellComponent}
        colSpan={flattenColumns.length}
      >
        {expandContent}
      </ExpandedRow>
    );
  }

  // ========================= Nest Row ==========================
  let nestRowNode: React.ReactElement[];
  if (hasNestChildren && expanded) {
    nestRowNode = (record[childrenColumnName] || []).map(
      (subRecord: RecordType, subIndex: number): React.ReactElement => {
        const subKey = getRowKey(subRecord, subIndex);

        return (
          <BodyRow
            {...props}
            key={subKey}
            rowKey={subKey}
            record={subRecord}
            recordKey={subKey}
            index={subIndex}
            indent={indent + 1}
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
