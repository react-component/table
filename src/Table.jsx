'use strict';

var React = require('react');
var TableRow = require('./TableRow');

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedRows: [],
      data: (props.data || []).concat()
    };
    ['handleRowDestroy', 'handleExpand'].forEach((m)=> {
      this[m] = this[m].bind(this);
    });
  }

  componentWillReceiveProps(nextProps) {
    if ('data' in nextProps) {
      this.setState({
        data: (nextProps.data || []).concat()
      });
    }
  }

  handleExpand(expanded, record) {
    var expandedRows = this.state.expandedRows.concat();
    var info = expandedRows.filter(function (i) {
      return i.record === record;
    });
    if (info.length) {
      info[0].expanded = expanded;
    } else {
      expandedRows.push({record: record, expanded});
    }
    this.setState({
      expandedRows: expandedRows
    });
  }

  handleRowDestroy(record) {
    var expandedRows = this.state.expandedRows;
    var index = -1;
    expandedRows.forEach(function (r, i) {
      if (r === record) {
        index = i;
      }
    });
    if (index !== -1) {
      expandedRows.splice(index, 1);
    }
  }

  isRowExpanded(record) {
    var info = this.state.expandedRows.filter(function (i) {
      return i.record === record;
    });
    return info[0] && info[0].expanded;
  }

  getRowsIsExpand(data) {
    var props = this.props;
    var childrenColumnName = props.childrenColumnName;
    var expandedRowRender = props.expandedRowRender;
    for (var i = 0; i < data.length; i++) {
      var record = data[i];
      var childrenColumn = record[childrenColumnName];
      var expandedRowContent;
      if (expandedRowRender) {
        expandedRowContent = expandedRowRender(record, i);
      }
      if (childrenColumn || expandedRowContent) {
        return true;
      }
    }
    return false;
  }

  getThs() {
    if (this.getRowsIsExpand(this.state.data)) {
      this.props.columns.unshift({
        title: '',
        dataIndex: '',
        key: '',
        width: 100
      });
    }
    return this.props.columns.map((c)=> {
      return <th key={c.key} className={c.className || ''}>{c.title}</th>;
    });
  }

  getExpandedRow(key, content, visible, className) {
    var prefixCls = this.props.prefixCls;
    if (key) {
      key += '-extra-row';
    }
    return <tr key={key} style={{display: visible ? '' : 'none'}} className={`${prefixCls}-expanded-row ${className}`}>
      <td colSpan={this.props.columns.length}>
        {content}
      </td>
    </tr>;
  }

  getRowsByData(data, visible) {
    var props = this.props;
    var columns = props.columns;
    var childrenColumnName = props.childrenColumnName;
    var expandedRowRender = props.expandedRowRender;
    var rst = [];
    var keyFn = props.rowKey;
    var rowClassName = props.rowClassName;
    var expandedRowClassName = props.expandedRowClassName;
    for (var i = 0; i < data.length; i++) {
      var record = data[i];
      var key = keyFn ? keyFn(record, i) : undefined;
      var childrenColumn = record[childrenColumnName];
      var expandedRowContent;
      if (expandedRowRender) {
        expandedRowContent = expandedRowRender(record, i);
      }
      var className = rowClassName(record, i);
      rst.push(<TableRow
        className={className}
        record={record}
        onDestroy={this.handleRowDestroy}
        index={i}
        visible={visible}
        onExpand={this.handleExpand}
        expandable={childrenColumn || expandedRowContent}
        expanded={this.isRowExpanded(record)}
        prefixCls={`${props.prefixCls}-row`}
        childrenColumnName={childrenColumnName}
        columns={columns}
        key={key}/>);

      var subVisible = visible && this.isRowExpanded(record);

      if (expandedRowContent) {
        rst.push(this.getExpandedRow(key, expandedRowContent, subVisible, expandedRowClassName(record, i)));
      }
      if (childrenColumn) {
        rst = rst.concat(this.getRowsByData(childrenColumn, subVisible));
      }
    }
    return rst;
  }

  getRows() {
    return this.getRowsByData(this.state.data, true);
  }

  getColGroup() {
    var cols = this.props.columns.map((c)=> {
      return <col key={c.key} style={{width: c.width}}></col>;
    });
    return <colgroup>{cols}</colgroup>;
  }

  render() {
    var props = this.props;
    var prefixCls = props.prefixCls;
    var columns = this.getThs();
    var rows = this.getRows();
    var className = props.prefixCls;
    if (props.className) {
      className += ' ' + props.className;
    }
    var headerTable;
    var thead = <thead className={`${prefixCls}-thead`}>
    <tr>
      {columns}
    </tr>
    </thead>;
    if (props.useFixedHeader) {
      headerTable = <div className={`${prefixCls}-header`}>
        <table>
          {this.getColGroup()}
          {thead}
        </table>
      </div>;
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
  }
}

Table.propTypes = {
  useFixedHeader: React.PropTypes.bool,
  columns: React.PropTypes.array,
  prefixCls: React.PropTypes.string,
  bodyStyle: React.PropTypes.object,
  style: React.PropTypes.object,
  rowKey: React.PropTypes.func,
  rowClassName: React.PropTypes.func,
  expandedRowClassName: React.PropTypes.func,
  childrenColumnName: React.PropTypes.string
};

Table.defaultProps = {
  useFixedHeader: false,
  columns: [],
  rowKey: function (o) {
    return o.key;
  },
  rowClassName: function (o) {
    return '';
  },
  expandedRowClassName: function (o) {
    return '';
  },
  prefixCls: 'rc-table',
  bodyStyle: {},
  style: {},
  childrenColumnName: 'children'
};

module.exports = Table;
