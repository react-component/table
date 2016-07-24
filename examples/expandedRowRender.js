webpackJsonp([5],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(286);


/***/ },

/***/ 286:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* eslint-disable no-console,func-names,react/no-multi-comp */
	var React = __webpack_require__(4);
	var ReactDOM = __webpack_require__(38);
	var Table = __webpack_require__(182);
	__webpack_require__(197);
	
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
	  onExpand: function onExpand(expanded, record) {
	    console.log('onExpand', expanded, record);
	  },
	  onExpandedRowsChange: function onExpandedRowsChange(rows) {
	    this.setState({
	      expandedRowKeys: rows
	    });
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
	        onExpand: this.onExpand,
	        data: state.data
	      })
	    );
	  }
	});
	
	var data = [{ key: 0, a: '123' }, { key: 1, a: 'cdd', b: 'edd' }, { key: 2, a: '1333', c: 'eee', d: 2 }];
	
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