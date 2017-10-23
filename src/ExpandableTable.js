import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'mini-store';
import TableRow from './TableRow';

class ExpandableTable extends React.Component {
  static propTypes = {
    expandIconAsCell: PropTypes.bool,
    expandedRowKeys: PropTypes.array,
    expandedRowClassName: PropTypes.func,
    defaultExpandAllRows: PropTypes.bool,
    defaultExpandedRowKeys: PropTypes.array,
    expandIconColumnIndex: PropTypes.number,
    expandedRowRender: PropTypes.func,
    childrenColumnName: PropTypes.string,
    indentSize: PropTypes.number,
    onExpand: PropTypes.func,
    onExpandedRowsChange: PropTypes.func,
    columnManager: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    prefixCls: PropTypes.string.isRequired,
    data: PropTypes.array,
    children: PropTypes.func.isRequired,
  }

  static defaultProps = {
    expandIconAsCell: false,
    expandedRowClassName: () => '',
    expandIconColumnIndex: 0,
    defaultExpandAllRows: false,
    defaultExpandedRowKeys: [],
    childrenColumnName: 'children',
    indentSize: 15,
    onExpand() {},
    onExpandedRowsChange() {},
  }

  constructor(props) {
    super(props);

    const {
      data,
      childrenColumnName,
      defaultExpandAllRows,
      expandedRowKeys,
      defaultExpandedRowKeys,
      getRowKey,
    } = props;

    let finnalExpandedRowKeys = [];
    let rows = [...data];

    if (defaultExpandAllRows) {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        finnalExpandedRowKeys.push(getRowKey(row, i));
        rows = rows.concat(row[childrenColumnName] || []);
      }
    } else {
      finnalExpandedRowKeys = expandedRowKeys || defaultExpandedRowKeys;
    }

    this.columnManager = props.columnManager;
    this.store = props.store;

    this.store.setState({
      expandedRowsHeight: {},
      expandedRowKeys: finnalExpandedRowKeys,
    });
  }

  componentWillReceiveProps(nextProps) {
    if ('expandedRowKeys' in nextProps) {
      this.store.setState({
        expandedRowKeys: nextProps.expandedRowKeys,
      });
    }
  }

  handleExpandChange = (expanded, record, event, rowKey) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const { onExpandedRowsChange, onExpand } = this.props;
    const { expandedRowKeys } = this.store.getState();

    if (expanded) {
      // row was expaned
      expandedRowKeys.push(rowKey);
    } else {
      // row was collapse
      const expandedRowIndex = expandedRowKeys.indexOf(rowKey);
      if (expandedRowIndex !== -1) {
        expandedRowKeys.splice(expandedRowIndex, 1);
      }
    }

    if (!this.props.expandedRowKeys) {
      this.store.setState({ expandedRowKeys });
    }

    onExpandedRowsChange(expandedRowKeys);
    onExpand(expanded, record);
  }

  renderExpandIndentCell = (rows, fixed) => {
    const { prefixCls, expandIconAsCell } = this.props;
    if (!expandIconAsCell || fixed === 'right') {
      return;
    }

    rows[0].unshift({
      key: 'rc-table-expandIconAsCell',
      className: `${prefixCls}-expand-icon-th`,
      title: '',
      rowSpan: rows.length,
    });
  }

  renderExpandedRow(content, className, ancestorKeys, fixed) {
    const { prefixCls, expandIconAsCell } = this.props;
    let colCount;
    if (fixed === 'left') {
      colCount = this.columnManager.leftLeafColumns().length;
    } else if (fixed === 'right') {
      colCount = this.columnManager.rightLeafColumns().length;
    } else {
      colCount = this.columnManager.leafColumns().length;
    }
    const columns = [{
      key: 'extra-row',
      render: () => ({
        props: {
          colSpan: colCount,
        },
        children: fixed !== 'right' ? content : '&nbsp;',
      }),
    }];
    if (expandIconAsCell && fixed !== 'right') {
      columns.unshift({
        key: 'expand-icon-placeholder',
        render: () => null,
      });
    }

    const rowKey = `${ancestorKeys[0]}-extra-row`;

    return (
      <TableRow
        key={rowKey}
        columns={columns}
        className={className}
        rowKey={rowKey}
        ancestorKeys={ancestorKeys}
        prefixCls={`${prefixCls}-expanded-row`}
        indent={1}
        fixed={fixed}
      />
    );
  }

  renderRows = (renderRows, record, index, indent, fixed, parentKey, ancestorKeys) => {
    const { expandedRowClassName, expandedRowRender, childrenColumnName } = this.props;
    const childrenData = record[childrenColumnName];
    const expandedRowContent = expandedRowRender && expandedRowRender(record, index, indent);
    const nextAncestorKeys = [...ancestorKeys, parentKey];

    if (expandedRowContent) {
      return [
        this.renderExpandedRow(
          expandedRowContent,
          expandedRowClassName(record, index, indent),
          nextAncestorKeys,
          fixed,
        ),
      ];
    }

    if (childrenData) {
      return renderRows(
        childrenData,
        indent + 1,
        nextAncestorKeys,
      );
    }
  }

  render() {
    const { data, childrenColumnName, children } = this.props;
    const needIndentSpaced = data.some(record => record[childrenColumnName]);

    return children({
      props: this.props,
      needIndentSpaced,
      renderRows: this.renderRows,
      handleExpandChange: this.handleExpandChange,
      renderExpandIndentCell: this.renderExpandIndentCell,
    });
  }
}

export default connect()(ExpandableTable);
