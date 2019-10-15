import React from 'react';
import ReactDOM from 'react-dom';
import warning from 'rc-util/lib/warning';
import { connect } from 'mini-store';
import { polyfill } from 'react-lifecycles-compat';
import classNames from 'classnames';
import TableCell from './TableCell';
import {
  GetComponentProps,
  LegacyFunction,
  Key,
  ColumnType,
  TableStore,
  FixedType,
  RenderNode,
  Cell,
  TableComponents,
  DefaultValueType,
  TableStoreState,
} from './interface';

export interface TableRowProps<ValueType> {
  onRow?: GetComponentProps<ValueType>;
  onRowClick?: LegacyFunction<ValueType>;
  onRowDoubleClick?: LegacyFunction<ValueType>;
  onRowContextMenu?: LegacyFunction<ValueType>;
  onRowMouseEnter?: LegacyFunction<ValueType>;
  onRowMouseLeave?: LegacyFunction<ValueType>;
  record?: ValueType;
  prefixCls?: string;
  onHover?: (hovered: boolean, rowKey: Key) => void;
  columns?: ColumnType[];
  height?: string | number;
  index?: number;
  rowKey: Key;
  className?: string;
  indent?: number;
  indentSize?: number;
  hasExpandIcon?: (index: number) => boolean;
  hovered: boolean;
  visible: boolean;
  store: TableStore;
  fixed?: FixedType;
  renderExpandIcon?: RenderNode;
  renderExpandIconCell?: (cells: Cell[]) => void;
  components?: TableComponents;
  expandedRow?: boolean;
  isAnyColumnsFixed?: boolean;
  ancestorKeys: Key[];
}

interface TableRowState {
  shouldRender?: boolean;
  visible?: boolean;
}

class TableRow<ValueType> extends React.Component<TableRowProps<ValueType>, TableRowState> {
  static defaultProps = {
    onRow() {},
    onHover() {},
    hasExpandIcon() {},
    renderExpandIcon() {},
    renderExpandIconCell() {},
  };

  state: TableRowState = {};

  rowRef: HTMLElement;

  style: React.CSSProperties;

  static getDerivedStateFromProps(
    nextProps: TableRowProps<DefaultValueType>,
    prevState: TableRowState,
  ): Partial<TableRowState> {
    if (prevState.visible || (!prevState.visible && nextProps.visible)) {
      return {
        shouldRender: true,
        visible: nextProps.visible,
      };
    }
    return {
      visible: nextProps.visible,
    };
  }

  componentDidMount() {
    if (this.state.shouldRender) {
      this.saveRowRef();
    }
  }

  shouldComponentUpdate(nextProps) {
    return !!(this.props.visible || nextProps.visible);
  }

  componentDidUpdate() {
    if (this.state.shouldRender && !this.rowRef) {
      this.saveRowRef();
    }
  }

  onTriggerEvent = (
    rowPropFunc: Function,
    legacyFunc: LegacyFunction<ValueType>,
    additionalFunc?: Function,
  ) => {
    const { record, index } = this.props;

    return (...args: [React.SyntheticEvent]) => {
      // Additional function like trigger `this.onHover` to handle self logic
      if (additionalFunc) {
        additionalFunc();
      }

      // [Legacy] Some legacy function like `onRowClick`.
      const [event] = args;
      if (legacyFunc) {
        legacyFunc(record, index, event);
      }

      // Pass to the function from `onRow`
      if (rowPropFunc) {
        rowPropFunc(...args);
      }
    };
  };

  onMouseEnter = () => {
    const { onHover, rowKey } = this.props;
    onHover(true, rowKey);
  };

  onMouseLeave = () => {
    const { onHover, rowKey } = this.props;
    onHover(false, rowKey);
  };

  setExpandedRowHeight() {
    const { store, rowKey } = this.props;
    let { expandedRowsHeight } = store.getState();
    const { height } = this.rowRef.getBoundingClientRect();
    expandedRowsHeight = {
      ...expandedRowsHeight,
      [rowKey]: height,
    };
    store.setState({ expandedRowsHeight });
  }

  setRowHeight() {
    const { store, rowKey } = this.props;
    const { fixedColumnsBodyRowsHeight } = store.getState();
    const { height } = this.rowRef.getBoundingClientRect();
    store.setState({
      fixedColumnsBodyRowsHeight: {
        ...fixedColumnsBodyRowsHeight,
        [rowKey]: height,
      },
    });
  }

  getStyle() {
    const { height, visible } = this.props;

    if (height && height !== this.style.height) {
      this.style = { ...this.style, height };
    }

    if (!visible && !this.style.display) {
      this.style = { ...this.style, display: 'none' };
    }

    return this.style;
  }

  saveRowRef() {
    this.rowRef = ReactDOM.findDOMNode(this) as HTMLElement;

    const { isAnyColumnsFixed, fixed, expandedRow, ancestorKeys } = this.props;

    if (!isAnyColumnsFixed) {
      return;
    }

    if (!fixed && expandedRow) {
      this.setExpandedRowHeight();
    }

    if (!fixed && ancestorKeys.length >= 0) {
      this.setRowHeight();
    }
  }

  render() {
    if (!this.state.shouldRender) {
      return null;
    }

    const {
      prefixCls,
      columns,
      record,
      rowKey,
      index,
      onRow,
      indent,
      indentSize,
      hovered,
      height,
      visible,
      components,
      hasExpandIcon,
      renderExpandIcon,
      renderExpandIconCell,
      onRowClick,
      onRowDoubleClick,
      onRowMouseEnter,
      onRowMouseLeave,
      onRowContextMenu,
    } = this.props;

    const BodyRow = components.body.row;
    const BodyCell = components.body.cell;

    let { className } = this.props;

    if (hovered) {
      className += ` ${prefixCls}-hover`;
    }

    const cells: Cell[] = [];

    renderExpandIconCell(cells);

    for (let i = 0; i < columns.length; i += 1) {
      const column = columns[i];

      warning(
        column.onCellClick === undefined,
        'column[onCellClick] is deprecated, please use column[onCell] instead.',
      );

      cells.push(
        <TableCell
          prefixCls={prefixCls}
          record={record}
          indentSize={indentSize}
          indent={indent}
          index={index}
          column={column}
          key={column.key || column.dataIndex}
          expandIcon={hasExpandIcon(i) && renderExpandIcon()}
          component={BodyCell}
        />,
      );
    }

    const { className: customClassName, style: customStyle, ...rowProps } =
      onRow(record, index) || {};
    let style: React.CSSProperties = { height };

    if (!visible) {
      style.display = 'none';
    }

    style = { ...style, ...customStyle };

    const rowClassName = classNames(
      prefixCls,
      className,
      `${prefixCls}-level-${indent}`,
      customClassName,
    );

    return (
      <BodyRow
        {...rowProps}
        onClick={this.onTriggerEvent(rowProps.onClick, onRowClick)}
        onDoubleClick={this.onTriggerEvent(rowProps.onDoubleClick, onRowDoubleClick)}
        onMouseEnter={this.onTriggerEvent(
          rowProps.onMouseEnter,
          onRowMouseEnter,
          this.onMouseEnter,
        )}
        onMouseLeave={this.onTriggerEvent(
          rowProps.onMouseLeave,
          onRowMouseLeave,
          this.onMouseLeave,
        )}
        onContextMenu={this.onTriggerEvent(rowProps.onContextMenu, onRowContextMenu)}
        className={rowClassName}
        style={style}
        data-row-key={rowKey}
      >
        {cells}
      </BodyRow>
    );
  }
}

function getRowHeight(state, props) {
  const { expandedRowsHeight, fixedColumnsBodyRowsHeight } = state;
  const { fixed, rowKey } = props;

  if (!fixed) {
    return null;
  }

  if (expandedRowsHeight[rowKey]) {
    return expandedRowsHeight[rowKey];
  }

  if (fixedColumnsBodyRowsHeight[rowKey]) {
    return fixedColumnsBodyRowsHeight[rowKey];
  }

  return null;
}

polyfill(TableRow);

export default connect((state: TableStoreState, props: TableRowProps<DefaultValueType>) => {
  const { currentHoverKey, expandedRowKeys } = state;
  const { rowKey, ancestorKeys } = props;
  const visible = ancestorKeys.length === 0 || ancestorKeys.every(k => expandedRowKeys.includes(k));

  return {
    visible,
    hovered: currentHoverKey === rowKey,
    height: getRowHeight(state, props),
  };
})(TableRow);
