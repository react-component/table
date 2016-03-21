import React from 'react';
import TableRow from './TableRow';
import objectAssign from 'object-assign';

const Table = React.createClass({
  propTypes: {
    data: React.PropTypes.array,
    expandIconAsCell: React.PropTypes.bool,
    expandedRowKeys: React.PropTypes.array,
    defaultExpandedRowKeys: React.PropTypes.array,
    useFixedHeader: React.PropTypes.bool,
    columns: React.PropTypes.array,
    prefixCls: React.PropTypes.string,
    bodyStyle: React.PropTypes.object,
    style: React.PropTypes.object,
    rowKey: React.PropTypes.func,
    rowClassName: React.PropTypes.func,
    expandedRowClassName: React.PropTypes.func,
    childrenColumnName: React.PropTypes.string,
    onExpandedRowsChange: React.PropTypes.func,
    indentSize: React.PropTypes.number,
    onRowClick: React.PropTypes.func,
    columnsPageRange: React.PropTypes.array,
    columnsPageSize: React.PropTypes.number,
    expandIconColumnIndex: React.PropTypes.number,
    showHeader: React.PropTypes.bool,
    footer: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      data: [],
      useFixedHeader: false,
      expandIconAsCell: false,
      columns: [],
      defaultExpandedRowKeys: [],
      rowKey(o) {
        return o.key;
      },
      rowClassName() {
        return '';
      },
      expandedRowClassName() {
        return '';
      },
      onExpandedRowsChange() {
      },
      prefixCls: 'rc-table',
      bodyStyle: {},
      style: {},
      childrenColumnName: 'children',
      indentSize: 15,
      columnsPageSize: 5,
      expandIconColumnIndex: 0,
      showHeader: true,
    };
  },

  getInitialState() {
    const props = this.props;
    return {
      expandedRowKeys: props.expandedRowKeys || props.defaultExpandedRowKeys,
      data: this.props.data,
      currentColumnsPage: 0,
    };
  },

  componentWillReceiveProps(nextProps) {
    if ('data' in nextProps) {
      this.setState({
        data: nextProps.data,
      });
    }
    if ('expandedRowKeys' in nextProps) {
      this.setState({
        expandedRowKeys: nextProps.expandedRowKeys,
      });
    }
  },

  onExpandedRowsChange(expandedRowKeys) {
    if (!this.props.expandedRowKeys) {
      this.setState({
        expandedRowKeys: expandedRowKeys,
      });
    }
    this.props.onExpandedRowsChange(expandedRowKeys);
  },

  onExpanded(expanded, record) {
    const info = this.findExpandedRow(record);
    if (info && !expanded) {
      this.onRowDestroy(record);
    } else if (!info && expanded) {
      const expandedRows = this.getExpandedRows().concat();
      expandedRows.push(this.props.rowKey(record));
      this.onExpandedRowsChange(expandedRows);
    }
  },

  onRowDestroy(record) {
    const expandedRows = this.getExpandedRows().concat();
    const rowKey = this.props.rowKey(record);
    let index = -1;
    expandedRows.forEach((r, i) => {
      if (r === rowKey) {
        index = i;
      }
    });
    if (index !== -1) {
      expandedRows.splice(index, 1);
    }
    this.onExpandedRowsChange(expandedRows);
  },

  getExpandedRows() {
    return this.props.expandedRowKeys || this.state.expandedRowKeys;
  },

  getThs() {
    let ths = [];
    if (this.props.expandIconAsCell) {
      ths.push({
        key: 'rc-table-expandIconAsCell',
        className: `${this.props.prefixCls}-expand-icon-th`,
        title: '',
      });
    }
    ths = ths.concat(this.getCurrentColumns());
    return ths.map((c)=> {
      if (c.colSpan !== 0) {
        return <th key={c.key} colSpan={c.colSpan} className={c.className || ''}>{c.title}</th>;
      }
    });
  },

  getExpandedRow(key, content, visible, className) {
    const prefixCls = this.props.prefixCls;
    return (<tr key={key + '-extra-row'} style={{display: visible ? '' : 'none'}} className={`${prefixCls}-expanded-row ${className}`}>
      {this.props.expandIconAsCell ? <td key="rc-table-expand-icon-placeholder"></td> : ''}
      <td colSpan={this.props.columns.length}>
        {content}
      </td>
    </tr>);
  },

  getRowsByData(data, visible, indent) {
    const props = this.props;
    const columns = this.getCurrentColumns();
    const childrenColumnName = props.childrenColumnName;
    const expandedRowRender = props.expandedRowRender;
    const expandIconAsCell = props.expandIconAsCell;
    let rst = [];
    const keyFn = props.rowKey;
    const rowClassName = props.rowClassName;
    const expandedRowClassName = props.expandedRowClassName;
    const needIndentSpaced = props.data.some(record =>
      record[childrenColumnName] && record[childrenColumnName].length > 0);
    const onRowClick = props.onRowClick;
    const expandIconColumnIndex = props.expandIconColumnIndex;

    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      const key = keyFn ? keyFn(record, i) : undefined;
      const childrenColumn = record[childrenColumnName];
      const isRowExpanded = this.isRowExpanded(record);
      let expandedRowContent;
      if (expandedRowRender && isRowExpanded) {
        expandedRowContent = expandedRowRender(record, i);
      }
      const className = rowClassName(record, i);
      rst.push(<TableRow
        indent={indent}
        indentSize={props.indentSize}
        needIndentSpaced={needIndentSpaced}
        className={className}
        record={record}
        expandIconAsCell={expandIconAsCell}
        onDestroy={this.onRowDestroy}
        index={i}
        visible={visible}
        onExpand={this.onExpanded}
        expandable={childrenColumn || expandedRowRender}
        expanded={isRowExpanded}
        prefixCls={`${props.prefixCls}-row`}
        childrenColumnName={childrenColumnName}
        columns={columns}
        expandIconColumnIndex={expandIconColumnIndex}
        onRowClick={onRowClick}
        key={key}/>);

      const subVisible = visible && isRowExpanded;

      if (expandedRowContent && isRowExpanded) {
        rst.push(this.getExpandedRow(key, expandedRowContent, subVisible, expandedRowClassName(record, i)));
      }
      if (childrenColumn) {
        rst = rst.concat(this.getRowsByData(childrenColumn, subVisible, indent + 1));
      }
    }
    return rst;
  },

  getRows() {
    return this.getRowsByData(this.state.data, true, 0);
  },

  getColGroup() {
    let cols = [];
    if (this.props.expandIconAsCell) {
      cols.push(<col className={`${this.props.prefixCls}-expand-icon-col`} key="rc-table-expand-icon-col"></col>);
    }
    cols = cols.concat(this.props.columns.map((c)=> {
      return <col key={c.key} style={{width: c.width}}></col>;
    }));
    return <colgroup>{cols}</colgroup>;
  },

  getCurrentColumns() {
    const { columns, columnsPageRange, columnsPageSize, prefixCls } = this.props;
    const { currentColumnsPage } = this.state;
    if (!columnsPageRange || columnsPageRange[0] > columnsPageRange[1]) {
      return columns;
    }
    return columns.map((column, i) => {
      let newColumn = objectAssign({}, column);
      if (i >= columnsPageRange[0] && i <= columnsPageRange[1]) {
        const pageIndexStart = columnsPageRange[0] + currentColumnsPage * columnsPageSize;
        let pageIndexEnd = columnsPageRange[0] + (currentColumnsPage + 1) * columnsPageSize - 1;
        if (pageIndexEnd > columnsPageRange[1]) {
          pageIndexEnd = columnsPageRange[1];
        }
        if (i < pageIndexStart || i > pageIndexEnd) {
          newColumn.className = newColumn.className || '';
          newColumn.className += ' ' + prefixCls + '-column-hidden';
        }
        newColumn = this.wrapPageColumn(newColumn, (i === pageIndexStart), (i === pageIndexEnd));
      }
      return newColumn;
    });
  },

  getMaxColumnsPage() {
    const { columnsPageRange, columnsPageSize } = this.props;
    return Math.floor((columnsPageRange[1] - columnsPageRange[0] - 1) / columnsPageSize);
  },

  goToColumnsPage(currentColumnsPage) {
    const maxColumnsPage = this.getMaxColumnsPage();
    let page = currentColumnsPage;
    if (page < 0) {
      page = 0;
    }
    if (page > maxColumnsPage) {
      page = maxColumnsPage;
    }
    this.setState({
      currentColumnsPage: page,
    });
  },

  prevColumnsPage() {
    this.goToColumnsPage(this.state.currentColumnsPage - 1);
  },

  nextColumnsPage() {
    this.goToColumnsPage(this.state.currentColumnsPage + 1);
  },

  wrapPageColumn(column, hasPrev, hasNext) {
    const { prefixCls } = this.props;
    const { currentColumnsPage } = this.state;
    const maxColumnsPage = this.getMaxColumnsPage();
    let prevHandlerCls = `${prefixCls}-prev-columns-page`;
    if (currentColumnsPage === 0) {
      prevHandlerCls += ` ${prefixCls}-prev-columns-page-disabled`;
    }
    const prevHandler = <span className={prevHandlerCls} onClick={this.prevColumnsPage}></span>;
    let nextHandlerCls = `${prefixCls}-next-columns-page`;
    if (currentColumnsPage === maxColumnsPage) {
      nextHandlerCls += ` ${prefixCls}-next-columns-page-disabled`;
    }
    const nextHandler = <span className={nextHandlerCls} onClick={this.nextColumnsPage}></span>;
    if (hasPrev) {
      column.title = <span>{prevHandler}{column.title}</span>;
      column.className = (column.className || '') + ` ${prefixCls}-column-has-prev`;
    }
    if (hasNext) {
      column.title = <span>{column.title}{nextHandler}</span>;
      column.className = (column.className || '') + ` ${prefixCls}-column-has-next`;
    }
    return column;
  },

  findExpandedRow(record) {
    const keyFn = this.props.rowKey;
    const currentRowKey = keyFn(record);
    const rows = this.getExpandedRows().filter((i) => {
      return i === currentRowKey;
    });
    return rows[0] || null;
  },

  isRowExpanded(record) {
    return !!this.findExpandedRow(record);
  },

  render() {
    const props = this.props;
    const prefixCls = props.prefixCls;
    const columns = this.getThs();
    const rows = this.getRows();
    let className = props.prefixCls;
    if (props.className) {
      className += ' ' + props.className;
    }
    if (props.columnsPageRange) {
      className += ` ${prefixCls}-columns-paging`;
    }
    let headerTable;
    let thead = props.showHeader ? (
      <thead className={`${prefixCls}-thead`}>
        <tr>{columns}</tr>
      </thead>
    ) : null;
    if (props.useFixedHeader) {
      headerTable = (
        <div className={`${prefixCls}-header`}>
          <table>
            {this.getColGroup()}
            {thead}
          </table>
        </div>
      );
      thead = null;
    }
    const tfoot = props.footer ? (
      <tfoot className={`${prefixCls}-tfoot`}>
        <tr><td colSpan="0">{props.footer(this.state.data)}</td></tr>
      </tfoot>
    ) : null;
    return (
      <div className={className} style={props.style}>
        {headerTable}
        <div className={`${prefixCls}-body`} style={props.bodyStyle}>
          <table>
            {this.getColGroup()}
            {thead}
            <tbody className={`${prefixCls}-tbody`}>{rows}</tbody>
            {tfoot}
          </table>
        </div>
      </div>
    );
  },
});

export default Table;
