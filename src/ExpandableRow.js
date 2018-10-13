import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'mini-store';
import ExpandIcon from './ExpandIcon';

class ExpandableRow extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string.isRequired,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    fixed: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    record: PropTypes.object.isRequired,
    indentSize: PropTypes.number,
    needIndentSpaced: PropTypes.bool.isRequired,
    expandRowByClick: PropTypes.bool,
    expanded: PropTypes.bool.isRequired,
    expandIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    expandIconAsCell: PropTypes.bool,
    expandIconColumnIndex: PropTypes.number,
    childrenColumnName: PropTypes.string,
    expandedRowRender: PropTypes.func,
    onExpandedChange: PropTypes.func.isRequired,
    onRowClick: PropTypes.func,
    children: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    this.handleDestroy();
  }

  hasExpandIcon = columnIndex => {
    const { expandRowByClick, expandIcon } = this.props;
    return (
      expandIcon &&
      !this.expandIconAsCell &&
      !expandRowByClick &&
      columnIndex === this.expandIconColumnIndex
    );
  };

  handleExpandChange = (record, event) => {
    const { onExpandedChange, expanded, rowKey } = this.props;
    if (this.expandable) {
      onExpandedChange(!expanded, record, event, rowKey);
    }
  };

  handleDestroy() {
    const { onExpandedChange, rowKey, record } = this.props;
    if (this.expandable) {
      onExpandedChange(false, record, null, rowKey, true);
    }
  }

  handleRowClick = (record, index, event) => {
    const { expandRowByClick, onRowClick } = this.props;
    if (expandRowByClick) {
      this.handleExpandChange(record, event);
    }
    if (onRowClick) {
      onRowClick(record, index, event);
    }
  };

  renderExpandIcon = () => {
    const { prefixCls, expanded, record, needIndentSpaced, expandIcon } = this.props;

    return (
      <ExpandIcon
        expandable={this.expandable}
        prefixCls={prefixCls}
        onExpand={this.handleExpandChange}
        needIndentSpaced={needIndentSpaced}
        expanded={expanded}
        expandIcon={expandIcon}
        record={record}
      />
    );
  };

  renderExpandIconCell = cells => {
    if (!this.expandIconAsCell) {
      return;
    }
    const { prefixCls } = this.props;

    cells.push(
      <td className={`${prefixCls}-expand-icon-cell`} key="rc-table-expand-icon-cell">
        {this.renderExpandIcon()}
      </td>,
    );
  };

  render() {
    const {
      childrenColumnName,
      expandedRowRender,
      indentSize,
      record,
      fixed,
      expanded,
    } = this.props;

    this.expandIconAsCell = fixed !== 'right' ? this.props.expandIconAsCell : false;
    this.expandIconColumnIndex = fixed !== 'right' ? this.props.expandIconColumnIndex : -1;
    const childrenData = record[childrenColumnName];
    this.expandable = !!(childrenData || expandedRowRender);

    const expandableRowProps = {
      indentSize,
      expanded, // not used in TableRow, but it's required to re-render TableRow when `expanded` changes
      onRowClick: this.handleRowClick,
      hasExpandIcon: this.hasExpandIcon,
      renderExpandIcon: this.renderExpandIcon,
      renderExpandIconCell: this.renderExpandIconCell,
    };

    return this.props.children(expandableRowProps);
  }
}

export default connect(({ expandedRowKeys }, { rowKey }) => ({
  expanded: !!~expandedRowKeys.indexOf(rowKey),
}))(ExpandableRow);
