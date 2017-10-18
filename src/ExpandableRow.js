import React from 'react';
import { connect } from 'mini-store';
import ExpandIcon from './ExpandIcon';

class ExpandableRow extends React.Component {
  componentWillUnmount() {
    this.handleDestroy();
  }

  hasExpandIcon = (columnIndex) => {
    const { expandRowByClick } = this.props;
    return !this.expandIconAsCell && !expandRowByClick && columnIndex === this.expandIconColumnIndex;
  }

  handleExpandChange = (record, index, event) => {
    const { onExpandedChange, expanded } = this.props;
    if (this.expandable) {
      onExpandedChange(!expanded, record, event, index);
    }
  }

  handleDestroy() {
    const { onExpandedChange, index, record } = this.props;
    if (this.expandable) {
      onExpandedChange(false, record, null, index);
    }
  }

  handleRowClick = (record, index, event) => {
    const { expandRowByClick, onRowClick } = this.props;
    if (expandRowByClick) {
      this.handleExpandChange(record, index, event);
    }
    onRowClick(record, index, event);
  }

  renderExpandIcon = () => {
    const { prefixCls, expanded, record, needIndentSpaced, onExpandedChange } = this.props;

    return (
      <ExpandIcon
        expandable={this.expandable}
        prefixCls={prefixCls}
        onExpand={this.handleExpandChange}
        needIndentSpaced={needIndentSpaced}
        expanded={expanded}
        record={record}
      />
    );
  }

  renderExpandIconCell = (cells) => {
    if (!this.expandIconAsCell) {
      return;
    }
    const { prefixCls } = this.props;

    cells.push(
      <td
        className={`${prefixCls}-expand-icon-cell`}
        key="rc-table-expand-icon-cell"
      >
        {this.renderExpandIcon()}
      </td>
    );
  }

  render() {
    const {
      childrenColumnName,
      expandedRowRender,
      indentSize,
      record,
      fixed,
    } = this.props;

    this.expandIconAsCell = fixed !== 'right' ? this.props.expandIconAsCell : false;
    this.expandIconColumnIndex = fixed !== 'right' ? this.props.expandIconColumnIndex : -1;
    const childrenData = record[childrenColumnName];
    this.expandable = !!(childrenData || expandedRowRender);

    const expandableRowProps = {
      indentSize,
      onRowClick: this.handleRowClick,
      hasExpandIcon: this.hasExpandIcon,
      renderExpandIcon: this.renderExpandIcon,
      renderExpandIconCell: this.renderExpandIconCell,
    }

    return this.props.children(expandableRowProps);
  }
}

export default connect(({ expandedRowKeys }, { rowKey }) => ({
  expanded: !!~expandedRowKeys.indexOf(rowKey),
}))(ExpandableRow);

