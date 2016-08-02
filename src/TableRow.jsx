import React, { PropTypes } from 'react';
import shallowequal from 'shallowequal';
import TableCell from './TableCell';
import ExpandIcon from './ExpandIcon';

const TableRow = React.createClass({
  propTypes: {
    onDestroy: PropTypes.func,
    onRowClick: PropTypes.func,
    record: PropTypes.object,
    prefixCls: PropTypes.string,
    expandIconColumnIndex: PropTypes.number,
    onHover: PropTypes.func,
    columns: PropTypes.array,
    style: PropTypes.object,
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
  },

  getDefaultProps() {
    return {
      onRowClick() {},
      onDestroy() {},
      expandIconColumnIndex: 0,
      onHover() {},
    };
  },

  shouldComponentUpdate(nextProps) {
    return !shallowequal(nextProps, this.props);
  },

  componentWillUnmount() {
    this.props.onDestroy(this.props.record);
  },

  render() {
    const {
      prefixCls, columns, record, style, visible, index, hoverKey,
      expandIconColumnIndex, expandIconAsCell, onRowClick, onHover, expanded,
      expandable, onExpand, needIndentSpaced, className, indent, indentSize,
    } = this.props;

    const cells = [];

    for (let i = 0; i < columns.length; i++) {
      if (expandIconAsCell && i === 0) {
        cells.push(
          <td
            className={`${prefixCls}-expand-icon-cell`}
            key="rc-table-expand-icon-cell"
          >
            <ExpandIcon
              expandable={expandable}
              prefixCls={prefixCls}
              onExpand={onExpand}
              needIndentSpaced={needIndentSpaced}
              expanded={expanded}
              record={record}
            />
          </td>
        );
      }
      const isColumnHaveExpandIcon = expandIconAsCell ? false : (i === expandIconColumnIndex);
      cells.push(
        <TableCell
          prefixCls={prefixCls}
          record={record}
          indentSize={indentSize}
          indent={indent}
          index={index}
          expandable={expandable}
          onExpand={onExpand}
          needIndentSpaced={needIndentSpaced}
          expanded={expanded}
          isColumnHaveExpandIcon={isColumnHaveExpandIcon}
          column={columns[i]}
          key={columns[i].key}
        />
      );
    }

    return (
      <tr
        onClick={() => onRowClick(record, index)}
        onMouseEnter={() => onHover(true, hoverKey)}
        onMouseLeave={() => onHover(false, hoverKey)}
        className={`${prefixCls} ${className} ${prefixCls}-level-${indent}`}
        style={visible ? style : { ...style, display: 'none' }}
      >
        {cells}
      </tr>
    );
  },
});

export default TableRow;
