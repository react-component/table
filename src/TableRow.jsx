import React, { PropTypes } from 'react';
import shallowequal from 'shallowequal';
import TableCell from './TableCell';
import ExpandIcon from './ExpandIcon';
import ColumnManager from './ColumnManager';

const TableRow = React.createClass({
  propTypes: {
    onDestroy: PropTypes.func,
    onRowClick: PropTypes.func,
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

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowequal(nextProps, this.props) ||
           !shallowequal(nextState, this.state) ||
           ColumnManager.includesCustomRender(nextProps.columns);
  },

  componentWillUnmount() {
    this.props.onDestroy(this.props.record);
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
      onExpand(!expanded, record);
    }
    onRowClick(record, index, event);
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
