import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'mini-store';
import { polyfill } from 'react-lifecycles-compat';
import shallowEqual from 'shallowequal';
import TableRow from './TableRow';
import { remove } from './utils';

class ExpandableTable extends React.Component {
  static propTypes = {
    expandIconAsCell: PropTypes.bool,
    expandedRowKeys: PropTypes.array,
    expandedRowClassName: PropTypes.func,
    defaultExpandAllRows: PropTypes.bool,
    defaultExpandedRowKeys: PropTypes.array,
    expandIconColumnIndex: PropTypes.number,
    expandedRowRender: PropTypes.func,
    expandIcon: PropTypes.func,
    childrenColumnName: PropTypes.string,
    indentSize: PropTypes.number,
    onExpand: PropTypes.func,
    onExpandedRowsChange: PropTypes.func,
    columnManager: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    prefixCls: PropTypes.string.isRequired,
    data: PropTypes.array,
    children: PropTypes.func.isRequired,
    getRowKey: PropTypes.func.isRequired,
  };

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
  };

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

  componentDidMount() {
    this.handleUpdated();
  }

  componentDidUpdate() {
    if ('expandedRowKeys' in this.props) {
      this.store.setState({
        expandedRowKeys: this.props.expandedRowKeys,
      });
    }
    this.handleUpdated();
  }

  handleUpdated() {
    // We should record latest expanded rows to avoid multiple rows remove cause `onExpandedRowsChange` trigger many times
    this.latestExpandedRows = null;
  }

  handleExpandChange = (expanded, record, event, rowKey, destroy = false) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const { onExpandedRowsChange, onExpand } = this.props;
    let { expandedRowKeys } = this.store.getState();

    if (expanded) {
      // row was expanded
      expandedRowKeys = [...expandedRowKeys, rowKey];
    } else {
      // row was collapse
      const expandedRowIndex = expandedRowKeys.indexOf(rowKey);
      if (expandedRowIndex !== -1) {
        expandedRowKeys = remove(expandedRowKeys, rowKey);
      }
    }

    if (!this.props.expandedRowKeys) {
      this.store.setState({ expandedRowKeys });
    }

    // De-dup of repeat call
    if (!this.latestExpandedRows || !shallowEqual(this.latestExpandedRows, expandedRowKeys)) {
      this.latestExpandedRows = expandedRowKeys;
      onExpandedRowsChange(expandedRowKeys);
    }
    if (!destroy) {
      onExpand(expanded, record);
    }
  };

  renderExpandIndentCell = (rows, fixed) => {
    const { prefixCls, expandIconAsCell } = this.props;
    if (!expandIconAsCell || fixed === 'right' || !rows.length) {
      return;
    }

    const iconColumn = {
      key: 'rc-table-expand-icon-cell',
      className: `${prefixCls}-expand-icon-th`,
      title: '',
      rowSpan: rows.length,
    };

    rows[0].unshift({ ...iconColumn, column: iconColumn });
  };

  renderExpandedRow(record, index, render, className, ancestorKeys, indent, fixed) {
    const { prefixCls, expandIconAsCell, indentSize } = this.props;
    const parentKey = ancestorKeys[ancestorKeys.length - 1];
    const rowKey = `${parentKey}-extra-row`;
    const components = {
      body: {
        row: 'tr',
        cell: 'td',
      },
    };
    let colCount;
    if (fixed === 'left') {
      colCount = this.columnManager.leftLeafColumns().length;
    } else if (fixed === 'right') {
      colCount = this.columnManager.rightLeafColumns().length;
    } else {
      colCount = this.columnManager.leafColumns().length;
    }
    const columns = [
      {
        key: 'extra-row',
        render: () => {
          const { expandedRowKeys } = this.store.getState();
          const expanded = !!~expandedRowKeys.indexOf(parentKey);
          return {
            props: {
              colSpan: colCount,
            },
            children: fixed !== 'right' ? render(record, index, indent, expanded) : '&nbsp;',
          };
        },
      },
    ];
    if (expandIconAsCell && fixed !== 'right') {
      columns.unshift({
        key: 'expand-icon-placeholder',
        render: () => null,
      });
    }

    return (
      <TableRow
        key={rowKey}
        columns={columns}
        className={className}
        rowKey={rowKey}
        ancestorKeys={ancestorKeys}
        prefixCls={`${prefixCls}-expanded-row`}
        indentSize={indentSize}
        indent={indent}
        fixed={fixed}
        components={components}
        expandedRow
      />
    );
  }

  renderRows = (renderRows, rows, record, index, indent, fixed, parentKey, ancestorKeys) => {
    const { expandedRowClassName, expandedRowRender, childrenColumnName } = this.props;
    const childrenData = record[childrenColumnName];
    const nextAncestorKeys = [...ancestorKeys, parentKey];
    const nextIndent = indent + 1;

    if (expandedRowRender) {
      rows.push(
        this.renderExpandedRow(
          record,
          index,
          expandedRowRender,
          expandedRowClassName(record, index, indent),
          nextAncestorKeys,
          nextIndent,
          fixed,
        ),
      );
    }

    if (childrenData) {
      rows.push(...renderRows(childrenData, nextIndent, nextAncestorKeys));
    }
  };

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

polyfill(ExpandableTable);

export default connect()(ExpandableTable);
