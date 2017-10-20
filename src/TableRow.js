import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'mini-store';
import TableCell from './TableCell';

class TableRow extends React.Component {
  static propTypes = {
    onRowClick: PropTypes.func,
    onRowDoubleClick: PropTypes.func,
    onRowContextMenu: PropTypes.func,
    onRowMouseEnter: PropTypes.func,
    onRowMouseLeave: PropTypes.func,
    record: PropTypes.object,
    prefixCls: PropTypes.string,
    onHover: PropTypes.func,
    columns: PropTypes.array,
    height: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    index: PropTypes.number,
    rowKey: PropTypes.any,
    className: PropTypes.string,
    indent: PropTypes.number,
    indentSize: PropTypes.number,
    expandedRow: PropTypes.bool,
  }

  static defaultProps = {
    onRowClick() {},
    onRowDoubleClick() {},
    onRowContextMenu() {},
    onRowMouseEnter() {},
    onRowMouseLeave() {},
    expandIconColumnIndex: 0,
    expandRowByClick: false,
    onHover() {},
    hasExpandIcon() {},
    renderExpandIcon() {},
    renderExpandIconCell() {},
  }

  constructor(props) {
    super(props);

    this.shouldRender = props.visible;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible || (!this.props.visible && nextProps.visible)) {
      this.shouldRender = true;
    }
  }

  onRowClick = (event) => {
    const { record, index, onRowClick } = this.props;
    onRowClick(record, index, event);
  }

  onRowDoubleClick = (event) => {
    const { record, index, onRowDoubleClick } = this.props;
    onRowDoubleClick(record, index, event);
  }

  onContextMenu = (event) => {
    const { record, index, onRowContextMenu } = this.props;
    onRowContextMenu(record, index, event);
  }

  onMouseEnter = (event) => {
    const { record, index, onRowMouseEnter, onHover, rowKey } = this.props;
    onHover(true, rowKey);
    onRowMouseEnter(record, index, event);
  }

  onMouseLeave = (event) => {
    const { record, index, onRowMouseLeave, onHover, rowKey } = this.props;
    onHover(false, rowKey);
    onRowMouseLeave(record, index, event);
  }

  render() {
    if (!this.shouldRender) {
      return null;
    }

    const {
      prefixCls,
      columns,
      record,
      index,
      indent,
      indentSize,
      visible,
      height,
      hovered,
      saveRowRef,
      hasExpandIcon,
      addExpandIconCell,
      renderExpandIcon,
      renderExpandIconCell
    } = this.props;

    let { className } = this.props;

    if (hovered) {
      className += ` ${prefixCls}-hover`;
    }

    const cells = [];

    renderExpandIconCell(cells);

    for (let i = 0; i < columns.length; i++) {
      cells.push(
        <TableCell
          prefixCls={prefixCls}
          record={record}
          indentSize={indentSize}
          indent={indent}
          index={index}
          column={columns[i]}
          key={columns[i].key || columns[i].dataIndex}
          expandIcon={hasExpandIcon(i) && renderExpandIcon()}
        />
      );
    }

    const style = { height };

    if (!visible) {
      style.display = 'none';
    }

    const rowClassName =
      `${prefixCls} ${className} ${prefixCls}-level-${indent}`.trim();

    return (
      <tr
        ref={saveRowRef}
        onClick={this.onRowClick}
        onDoubleClick={this.onRowDoubleClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onContextMenu={this.onContextMenu}
        className={rowClassName}
        style={style}
      >
        {cells}
      </tr>
    );
  }
}

export default connect(({ currentHoverKey, expandedRowKeys }, { rowKey, ancestorKeys }) => {
  return ({
    hovered: currentHoverKey === rowKey,
    visible: ancestorKeys.length === 0 || ancestorKeys.every(k => ~expandedRowKeys.indexOf(k)),
  })
})(TableRow);
