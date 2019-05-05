import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'mini-store';
import { polyfill } from 'react-lifecycles-compat';
import isEqual from 'react-fast-compare';
import classNames from 'classnames';
import pick from 'lodash/pick';
import TableCell from './TableCell';
import { warningOnce } from './utils';

class TableRow extends React.Component {
  static propTypes = {
    onRow: PropTypes.func,
    onRowClick: PropTypes.func,
    onRowDoubleClick: PropTypes.func,
    onRowContextMenu: PropTypes.func,
    onRowMouseEnter: PropTypes.func,
    onRowMouseLeave: PropTypes.func,
    record: PropTypes.object,
    prefixCls: PropTypes.string,
    onHover: PropTypes.func,
    columns: PropTypes.array,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    index: PropTypes.number,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    className: PropTypes.string,
    indent: PropTypes.number,
    indentSize: PropTypes.number,
    hasExpandIcon: PropTypes.func,
    hovered: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired,
    store: PropTypes.object.isRequired,
    fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    renderExpandIcon: PropTypes.func,
    renderExpandIconCell: PropTypes.func,
    components: PropTypes.any,
    expandedRow: PropTypes.bool,
    isAnyColumnsFixed: PropTypes.bool,
    ancestorKeys: PropTypes.array.isRequired,
  };

  static defaultProps = {
    onRow() {},
    onHover() {},
    hasExpandIcon() {},
    renderExpandIcon() {},
    renderExpandIconCell() {},
  };

  constructor(props) {
    super(props);

    this.shouldRender = props.visible;

    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, prevState) {
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
    const compareItems = ['visible', 'fixed', 'expanded', 'hovered', 'height', 'record', 'columns'];
    const nextCompare = pick(nextProps, compareItems);
    const prevComare = pick(this.props, compareItems);
    return !isEqual(nextCompare, prevComare);
  }

  componentDidUpdate() {
    if (this.state.shouldRender && !this.rowRef) {
      this.saveRowRef();
    }
  }

  onTriggerEvent = (rowPropFunc, legacyFunc, additionalFunc) => {
    const { record, index } = this.props;

    return (...args) => {
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
    const height = this.rowRef.getBoundingClientRect().height;
    expandedRowsHeight = {
      ...expandedRowsHeight,
      [rowKey]: height,
    };
    store.setState({ expandedRowsHeight });
  }

  setRowHeight() {
    const { store, rowKey } = this.props;
    const { fixedColumnsBodyRowsHeight } = store.getState();
    const height = this.rowRef.getBoundingClientRect().height;
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
    this.rowRef = ReactDOM.findDOMNode(this);

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

    const cells = [];

    renderExpandIconCell(cells);

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      warningOnce(
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
    let style = { height };

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

export default connect((state, props) => {
  const { currentHoverKey, expandedRowKeys } = state;
  const { rowKey, ancestorKeys } = props;
  const visible = ancestorKeys.length === 0 || ancestorKeys.every(k => ~expandedRowKeys.indexOf(k));

  return {
    visible,
    hovered: currentHoverKey === rowKey,
    height: getRowHeight(state, props),
  };
})(TableRow);
