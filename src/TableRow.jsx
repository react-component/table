import React, { PropTypes } from 'react';
import TableCell from './TableCell';
import ExpandIcon from './ExpandIcon';

const TableRow = React.createClass({
  propTypes: {
    onDestroy: PropTypes.func,
    onRowClick: PropTypes.func,
    onRowMouseOver: PropTypes.func,
    onRowMouseOut: PropTypes.func,
    onRowMouseUp: PropTypes.func,
    onRowDoubleClick: PropTypes.func,
    record: PropTypes.object,
    prefixCls: PropTypes.string,
    expandIconColumnIndex: PropTypes.number,
    onHover: PropTypes.func,
    columns: PropTypes.array,
    height: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    visible: PropTypes.bool,
    index: PropTypes.number,
    hoverKey: PropTypes.any,
    expanded: PropTypes.bool,
    expandable: PropTypes.any,
    onExpand: PropTypes.func,
    needIndentSpaced: PropTypes.bool,
    className: PropTypes.string,
    indent: PropTypes.number,
    indentSize: PropTypes.number,
    expandIconAsCell: PropTypes.bool,
    expandRowByClick: PropTypes.bool,
    store: PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      onRowClick() {},
      onRowMouseOver() {},
      onRowMouseOut() {},
      onRowMouseUp() {},
      onRowDoubleClick() {},
      onDestroy() {},
      expandIconColumnIndex: 0,
      expandRowByClick: false,
      onHover() {},
    };
  },

  getInitialState() {
    return {
      hovered: false,
    };
  },

  componentDidMount() {
    const { store, hoverKey } = this.props;
    this.unsubscribe = store.subscribe(() => {
      if (store.getState().currentHoverKey === hoverKey) {
        this.setState({ hovered: true });
      } else if (this.state.hovered === true) {
        this.setState({ hovered: false });
      }
    });
  },

  componentWillUnmount() {
    const { record, onDestroy, index } = this.props;
    onDestroy(record, index);
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },

  onRowClick(event) {
    const {
      record,
      index,
      onRowClick,
      expandable,
      expandRowByClick,
      expanded,
      onExpand,
    } = this.props;
    if (expandable && expandRowByClick) {
      onExpand(!expanded, record, index);
    }
    onRowClick(record, index, event);
  },

  onRowMouseOver(event) {
    const { record, index, onRowMouseOver } = this.props;
    onRowMouseOver(record, index, event);
  },

  onRowMouseOut(event) {
    const { record, index, onRowMouseOut } = this.props;
    onRowMouseOut(record, index, event);
  },

  onRowMouseUp(event) {
    const { record, index, onRowMouseUp } = this.props;
    onRowMouseUp(record, index, event);
  },

  onRowDoubleClick(event) {
    const { record, index, onRowDoubleClick } = this.props;
    onRowDoubleClick(record, index, event);
  },

  onMouseEnter() {
    const { onHover, hoverKey } = this.props;
    onHover(true, hoverKey);
  },

  onMouseLeave() {
    const { onHover, hoverKey } = this.props;
    onHover(false, hoverKey);
  },

  render() {
    const {
      prefixCls, columns, record, height, visible, index,
      expandIconColumnIndex, expandIconAsCell, expanded, expandRowByClick,
      expandable, onExpand, needIndentSpaced, indent, indentSize,
    } = this.props;

    let { className } = this.props;

    if (this.state.hovered) {
      className += ` ${prefixCls}-hover`;
    }

    const cells = [];

    const expandIcon = (
      <ExpandIcon
        expandable={expandable}
        prefixCls={prefixCls}
        onExpand={onExpand}
        needIndentSpaced={needIndentSpaced}
        expanded={expanded}
        record={record}
      />
    );

    for (let i = 0; i < columns.length; i++) {
      if (expandIconAsCell && i === 0) {
        cells.push(
          <td
            className={`${prefixCls}-expand-icon-cell`}
            key="rc-table-expand-icon-cell"
          >
            {expandIcon}
          </td>
        );
      }
      const isColumnHaveExpandIcon = (expandIconAsCell || expandRowByClick)
        ? false : (i === expandIconColumnIndex);
      cells.push(
        <TableCell
          prefixCls={prefixCls}
          record={record}
          indentSize={indentSize}
          indent={indent}
          index={index}
          column={columns[i]}
          key={columns[i].key}
          expandIcon={isColumnHaveExpandIcon ? expandIcon : null}
        />
      );
    }
    const style = { height };
    if (!visible) {
      style.display = 'none';
    }

    return (
      <tr
        onClick={this.onRowClick}
        onMouseOver={this.onRowMouseOver}
        onMouseOut={this.onRowMouseOut}
        onMouseUp={this.onRowMouseUp}
        onDoubleClick={this.onRowDoubleClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        className={`${prefixCls} ${className} ${prefixCls}-level-${indent}`}
        style={style}
      >
        {cells}
      </tr>
    );
  },
});

export default TableRow;
