import * as React from 'react';
import { connect } from 'mini-store';
import ExpandIcon from './ExpandIcon';
import {
  Key,
  FixedType,
  ExpandedRowRender,
  IconExpandEventHandler,
  RenderExpandIcon,
  LegacyFunction,
} from './interface';

export interface ExpandableRowProps<ValueType> {
  prefixCls: string;
  rowKey: Key;
  fixed?: FixedType;
  record: ValueType;
  indentSize?: number;
  needIndentSpaced: boolean;
  expandRowByClick?: boolean;
  expanded: boolean;
  expandIconAsCell?: boolean;
  expandIconColumnIndex?: number;
  childrenColumnName?: string;
  expandedRowRender?: ExpandedRowRender<ValueType>;
  expandIcon?: RenderExpandIcon<ValueType>;
  onExpandedChange: (
    expanded: boolean,
    record: ValueType,
    event: React.MouseEvent<HTMLElement>,
    rowKey: Key,
    destroy?: boolean,
  ) => void;
  onRowClick?: LegacyFunction<ValueType>;
  children: (info: {
    indentSize: number;
    expanded: boolean;
    onRowClick: LegacyFunction<ValueType>;
    hasExpandIcon: (index: number) => boolean;
    renderExpandIcon: () => React.ReactNode;
    renderExpandIconCell: (cells: React.ReactElement[]) => void;
  }) => React.ReactNode;
}

class ExpandableRow<ValueType> extends React.Component<ExpandableRowProps<ValueType>> {
  expandIconAsCell: boolean;

  expandIconColumnIndex: number;

  expandable: boolean;

  componentWillUnmount() {
    this.handleDestroy();
  }

  // Show icon within first column
  hasExpandIcon = (columnIndex: number) => {
    const { expandRowByClick, expandIcon } = this.props;

    if (this.expandIconAsCell || columnIndex !== this.expandIconColumnIndex) {
      return false;
    }

    return !!expandIcon || !expandRowByClick;
  };

  handleExpandChange: IconExpandEventHandler<ValueType> = (record, event) => {
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

    if (expandIcon) {
      return expandIcon({
        prefixCls,
        expanded,
        record,
        needIndentSpaced,
        expandable: this.expandable,
        onExpand: this.handleExpandChange,
      });
    }

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
      // not used in TableRow, but it's required to re-render TableRow when `expanded` changes
      expanded,
      onRowClick: this.handleRowClick,
      hasExpandIcon: this.hasExpandIcon,
      renderExpandIcon: this.renderExpandIcon,
      renderExpandIconCell: this.renderExpandIconCell,
    };

    return this.props.children(expandableRowProps);
  }
}

export default connect(({ expandedRowKeys }, { rowKey }) => ({
  expanded: expandedRowKeys.includes(rowKey),
}))(ExpandableRow);
