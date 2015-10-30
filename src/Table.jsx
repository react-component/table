import React from 'react';
import TableRow from './TableRow';

const Table = React.createClass({
  propTypes: {
    data: React.PropTypes.array,
    expandIconAsCell: React.PropTypes.bool,
    useFixedHeader: React.PropTypes.bool,
    columns: React.PropTypes.array,
    prefixCls: React.PropTypes.string,
    bodyStyle: React.PropTypes.object,
    style: React.PropTypes.object,
    rowKey: React.PropTypes.func,
    rowClassName: React.PropTypes.func,
    expandedRowClassName: React.PropTypes.func,
    childrenColumnName: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      data: [],
      useFixedHeader: false,
      expandIconAsCell: false,
      columns: [],
      rowKey(o) {
        return o.key;
      },
      rowClassName() {
        return '';
      },
      expandedRowClassName() {
        return '';
      },
      prefixCls: 'rc-table',
      bodyStyle: {},
      style: {},
      childrenColumnName: 'children',
    };
  },

  getInitialState() {
    return {
      expandedRows: [],
      data: this.props.data.concat(),
    };
  },

  componentWillReceiveProps(nextProps) {
    if ('data' in nextProps) {
      this.setState({
        data: nextProps.data.concat(),
      });
    }
  },

  onExpanded(expanded, record) {
    const expandedRows = this.state.expandedRows.concat();
    const info = expandedRows.filter((i) => {
      return i.record === record;
    });
    if (info.length) {
      info[0].expanded = expanded;
    } else {
      expandedRows.push({record: record, expanded});
    }
    this.setState({
      expandedRows: expandedRows,
    });
  },

  onRowDestroy(record) {
    const expandedRows = this.state.expandedRows;
    let index = -1;
    expandedRows.forEach((r, i) => {
      if (r === record) {
        index = i;
      }
    });
    if (index !== -1) {
      expandedRows.splice(index, 1);
    }
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
    ths = ths.concat(this.props.columns);
    return ths.map((c)=> {
      if (c.colSpan !== 0) {
        return <th key={c.key} style={{textAlign: c.align || undefined}} colSpan={c.colSpan} className={c.className || ''}>{c.title}</th>;
      }
    });
  },

  getExpandedRow(key2, content, visible, className) {
    let key = key2;
    const prefixCls = this.props.prefixCls;
    if (key) {
      key += '-extra-row';
    }
    return (<tr key={key} style={{display: visible ? '' : 'none'}} className={`${prefixCls}-expanded-row ${className}`}>
      {this.props.expandIconAsCell ? <td key="rc-table-expand-icon-placeholder"></td> : ''}
      <td colSpan={this.props.columns.length}>
        {content}
      </td>
    </tr>);
  },

  getRowsByData(data, visible) {
    const props = this.props;
    const columns = props.columns;
    const childrenColumnName = props.childrenColumnName;
    const expandedRowRender = props.expandedRowRender;
    const expandIconAsCell = props.expandIconAsCell;
    let rst = [];
    const keyFn = props.rowKey;
    const rowClassName = props.rowClassName;
    const expandedRowClassName = props.expandedRowClassName;
    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      const key = keyFn ? keyFn(record, i) : undefined;
      const childrenColumn = record[childrenColumnName];
      const isRowExpanded = this.isRowExpanded(record);
      let expandedRowContent;
      if (expandedRowRender) {
        expandedRowContent = expandedRowRender(record, i);
      }
      const className = rowClassName(record, i);
      rst.push(<TableRow
        className={className}
        record={record}
        expandIconAsCell={expandIconAsCell}
        onDestroy={this.onRowDestroy}
        index={i}
        visible={visible}
        onExpand={this.onExpanded}
        expandable={childrenColumn || expandedRowContent}
        expanded={isRowExpanded}
        prefixCls={`${props.prefixCls}-row`}
        childrenColumnName={childrenColumnName}
        columns={columns}
        key={key}/>);

      const subVisible = visible && isRowExpanded;

      if (expandedRowContent && isRowExpanded) {
        rst.push(this.getExpandedRow(key, expandedRowContent, subVisible, expandedRowClassName(record, i)));
      }
      if (childrenColumn) {
        rst = rst.concat(this.getRowsByData(childrenColumn, subVisible));
      }
    }
    return rst;
  },

  getRows() {
    return this.getRowsByData(this.state.data, true);
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

  isRowExpanded(record) {
    const info = this.state.expandedRows.filter((i) => {
      return i.record === record;
    });
    return info[0] && info[0].expanded;
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
    let headerTable;
    let thead = (<thead className={`${prefixCls}-thead`}>
    <tr>
      {columns}
    </tr>
    </thead>);
    if (props.useFixedHeader) {
      headerTable = (<div className={`${prefixCls}-header`}>
        <table>
          {this.getColGroup()}
          {thead}
        </table>
      </div>);
      thead = null;
    }
    return (
      <div className={className} style={props.style}>
        {headerTable}
        <div className={`${prefixCls}-body`} style={props.bodyStyle}>
          <table>
            {this.getColGroup()}
            {thead}
            <tbody className={`${prefixCls}-tbody`}>
            {rows}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
});

export default Table;
