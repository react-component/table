import React from 'react';
import { isEqual } from 'lodash';
import shallowequal from 'shallowequal';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'mini-store';
import { polyfill } from 'react-lifecycles-compat';
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

  static contextTypes = {
    table: PropTypes.any,
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

    this.state = { height: 0 };
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

  shouldComponentUpdate({
    scrolling,
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
    virtualizedRelatedStyle,
    visible,
    components: {
      body: { row, cell },
    },
    hasExpandIcon,
    renderExpandIcon,
    renderExpandIconCell,
  }) {
    const shouldNotUpdate =
      scrolling === this.props.scrolling &&
      prefixCls === this.props.prefixCls &&
      isEqual(columns, this.props.columns) &&
      shallowequal(record, this.props.record) &&
      rowKey === this.props.rowKey &&
      index === this.props.index &&
      indent === this.props.indent &&
      indentSize === this.props.indentSize &&
      hovered === this.props.hovered &&
      height === this.props.height &&
      visible === this.props.visible &&
      hasExpandIcon === this.props.hasExpandIcon &&
      renderExpandIcon === this.props.renderExpandIcon &&
      renderExpandIconCell === this.props.renderExpandIconCell &&
      shallowequal(row, this.props.components.body.row) &&
      shallowequal(cell, this.props.components.body.cell) &&
      shallowequal(virtualizedRelatedStyle, this.props.virtualizedRelatedStyle) &&
      shallowequal(onRow, this.props.onRow);
    return !shouldNotUpdate;
  }

  updateRowHeight = () => {
    const { rowKey } = this.props;
    const { height } = this.state;
    const newHeight = this.rowRef && this.rowRef.offsetHeight;
    if (height != newHeight) {
      this.context.table.saveRowHeight(rowKey, newHeight);
      this.setState({
        height: newHeight,
      });
    }
  };

  componentDidUpdate({scrolling}) {
    if ((this.state.shouldRender && !this.rowRef) || (scrolling!==this.props.scrolling)) {
      this.saveRowRef();
    }
    if (this.props.virtualized) {
      this.updateRowHeight();
    }
  }

  onRowClick = event => {
    const { record, index, onRowClick } = this.props;
    if (onRowClick) {
      onRowClick(record, index, event);
    }
  };

  onRowDoubleClick = event => {
    const { record, index, onRowDoubleClick } = this.props;
    if (onRowDoubleClick) {
      onRowDoubleClick(record, index, event);
    }
  };

  onContextMenu = event => {
    const { record, index, onRowContextMenu } = this.props;
    if (onRowContextMenu) {
      onRowContextMenu(record, index, event);
    }
  };

  onMouseEnter = event => {
    const { record, index, onRowMouseEnter, onHover, rowKey } = this.props;
    onHover(true, rowKey);
    if (onRowMouseEnter) {
      onRowMouseEnter(record, index, event);
    }
  };

  onMouseLeave = event => {
    const { record, index, onRowMouseLeave, onHover, rowKey } = this.props;
    onHover(false, rowKey);
    if (onRowMouseLeave) {
      onRowMouseLeave(record, index, event);
    }
  };

  setExpanedRowHeight() {
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
      this.setExpanedRowHeight();
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
      placeholder,
      indent,
      indentSize,
      hovered,
      height,
      virtualizedRelatedStyle,
      virtualized,
      scrolling,
      visible,
      components,
      hasExpandIcon,
      renderExpandIcon,
      renderExpandIconCell,
    } = this.props;

    let style = { height };

    if (!visible) {
      style.display = 'none';
    }

    style = { ...virtualizedRelatedStyle, ...style, ...customStyle };

    if(scrolling && placeholder){
      return(
        <tr
        style={style}
        data-row-key={rowKey}
      >
        {this.props.placeholder(record, index)}
      </tr>
      );
    }

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
          columnIndex={i}
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

    const rowClassName = `${prefixCls} ${className} ${prefixCls}-level-${indent}`.trim();
    const rowProps = onRow(record, index);
    const customStyle = rowProps ? rowProps.style : {};

    return (
      <BodyRow
        onClick={this.onRowClick}
        onDoubleClick={this.onRowDoubleClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onContextMenu={this.onContextMenu}
        className={rowClassName}
        {...rowProps}
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
  const { scrolling, virtualized, currentHoverKey, expandedRowKeys } = state;
  const { rowKey, ancestorKeys } = props;
  const visible = ancestorKeys.length === 0 || ancestorKeys.every(k => ~expandedRowKeys.indexOf(k));

  return {
    scrolling,
    virtualized,
    visible,
    hovered: currentHoverKey === rowKey,
    height: getRowHeight(state, props),
  };
})(TableRow);
