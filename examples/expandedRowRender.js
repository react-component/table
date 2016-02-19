webpackJsonp([4],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(218);


/***/ },

/***/ 218:
/***/ function(module, exports, __webpack_require__) {

	/* eslint react/no-multi-comp: 0*/
	'use strict';
	
	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(159);
	var Table = __webpack_require__(160);
	__webpack_require__(165);
	
	var CheckBox = React.createClass({
	  displayName: 'CheckBox',
	
	  render: function render() {
	    var props = this.props;
	    return React.createElement(
	      'label',
	      null,
	      React.createElement('input', { type: 'checkbox' }),
	      props.id
	    );
	  }
	});
	
	var MyTable = React.createClass({
	  displayName: 'MyTable',
	
	  getInitialState: function getInitialState() {
	    var props = this.props;
	    return {
	      data: props.data,
	      expandedRowKeys: []
	    };
	  },
	
	  onExpandedRowsChange: function onExpandedRowsChange(rows) {
	    this.setState({
	      expandedRowKeys: rows
	    });
	  },
	
	  getRowKey: function getRowKey(record) {
	    return record.a;
	  },
	
	  toggleButton: function toggleButton() {
	    var _this = this;
	
	    if (this.state.expandedRowKeys.length) {
	      var closeAll = function closeAll() {
	        return _this.setState({ expandedRowKeys: [] });
	      };
	      return React.createElement(
	        'button',
	        { onClick: closeAll },
	        '关闭所有'
	      );
	    }
	    var openAll = function openAll() {
	      return _this.setState({ expandedRowKeys: ['123', 'cdd', '1333'] });
	    };
	    return React.createElement(
	      'button',
	      { onClick: openAll },
	      '展开全部'
	    );
	  },
	
	  handleClick: function handleClick(index) {
	    var self = this;
	    return function () {
	      self.remove(index);
	    };
	  },
	
	  remove: function remove(index) {
	    var rows = this.state.data;
	    rows.splice(index, 1);
	    this.setState({
	      data: rows
	    });
	  },
	
	  checkbox: function checkbox(a) {
	    return React.createElement(CheckBox, { id: a });
	  },
	
	  expandedRowRender: function expandedRowRender(record) {
	    console.log(record);
	    return React.createElement(
	      'p',
	      null,
	      'extra: ',
	      record.a
	    );
	  },
	
	  renderAction: function renderAction(o, row, index) {
	    return React.createElement(
	      'a',
	      { href: '#', onClick: this.handleClick(index) },
	      '删除'
	    );
	  },
	
	  render: function render() {
	    var state = this.state;
	    var columns = [{ title: '表头1', dataIndex: 'a', key: 'a', width: 100, render: this.checkbox }, { title: '表头2', dataIndex: 'b', key: 'b', width: 100 }, { title: '表头3', dataIndex: 'c', key: 'c', width: 200 }, { title: '操作', dataIndex: '', key: 'x', render: this.renderAction }];
	    return React.createElement(
	      'div',
	      null,
	      this.toggleButton(),
	      React.createElement(Table, {
	        columns: columns,
	        expandIconAsCell: true,
	        expandedRowRender: this.expandedRowRender,
	        expandedRowKeys: this.state.expandedRowKeys,
	        onExpandedRowsChange: this.onExpandedRowsChange,
	        data: state.data,
	        className: 'table',
	        rowKey: this.getRowKey
	      })
	    );
	  }
	});
	
	var data = [{ a: '123' }, { a: 'cdd', b: 'edd' }, { a: '1333', c: 'eee', d: 2 }];
	
	ReactDOM.render(React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h2',
	    null,
	    'expandedRowRender'
	  ),
	  React.createElement(MyTable, {
	    data: data,
	    className: 'table'
	  })
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=expandedRowRender.js.map