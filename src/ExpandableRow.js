import React from 'react';
import ExpandIcon from './ExpandIcon';

export default class ExpandableRow extends React.Component {
  constructor(props) {
    super(props);

    this.store = props.store;

    const { expandedRowKeys } = this.store.getState();

    this.state = {
      expanded: !!~expandedRowKeys.indexOf(props.rowKey),
    };
  }

  componentDidMount() {
    this.unsubscribe = this.store.subscribe(() => {
      this.toggleExpand();
    });
  }

  componentWillUnmount() {
    this.handleDestroy();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  toggleExpand() {
    const { rowKey, parentKey } = this.props;
    const { expandedRowKeys } = this.store.getState();
    if (~expandedRowKeys.indexOf(rowKey)) {
      this.setState({ expanded: true });
    } else if (this.state.expanded === true) {
      this.setState({ expanded: false });
    }
  }

  addExpandIconCell = (cells) => {
    if (this.props.expandIconAsCell) {
      cells.push(this.renderExpandIconCell());
    }
  }

  hasExpandIcon = (columnIndex) => {
    const { expandIconAsCell, expandRowByClick, expandIconColumnIndex } = this.props;
    return !expandIconAsCell && !expandRowByClick && columnIndex === expandIconColumnIndex;
  }

  handleExpandChange = (record, index, event) => {
    if (this.expandable) {
      this.props.onExpandedChange(!this.state.expanded, record, event, index);
    }
  }

  handleDestroy = () => {
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
    const { prefixCls, record, needIndentSpaced, onExpandedChange } = this.props;

    return (
      <ExpandIcon
        expandable={this.expandable}
        prefixCls={prefixCls}
        onExpand={this.handleExpandChange}
        needIndentSpaced={needIndentSpaced}
        expanded={this.state.expanded}
        record={record}
      />
    );
  }

  renderExpandIconCell = () => {
    const { prefixCls } = this.props;

    return (
      <td
        className={`${prefixCls}-expand-icon-cell`}
        key="rc-table-expand-icon-cell"
      >
        {this.renderExpandIcon()}
      </td>
    );
  }

  render() {
    const { expanded } = this.state;
    const {
      childrenColumnName,
      expandedRowRender,
      expandRowByClick,
      indentSize,
      record,
    } = this.props;

    const expandIconAsCell = this.fixed !== 'right' ? this.props.expandIconAsCell : false;
    const expandIconColumnIndex = this.fixed !== 'right' ? this.props.expandIconColumnIndex : -1;
    const childrenData = record[childrenColumnName];
    // this.expanded = this.expander.isRowExpanded(this.record, this.index);
    this.expandable = childrenData || expandedRowRender;

    const expandableRowProps = {
      indentSize,
      onRowClick: this.handleRowClick,
      addExpandIconCell: this.addExpandIconCell,
      hasExpandIcon: this.hasExpandIcon,
      renderExpandIcon: this.renderExpandIcon,
      renderExpandIconCell: this.renderExpandIconCell,
    }

    return this.props.children(expandableRowProps);
  }
}
