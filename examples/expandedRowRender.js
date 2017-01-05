webpackJsonp([5],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(302);


/***/ },

/***/ 302:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* eslint-disable no-console,func-names,react/no-multi-comp */
	var React = __webpack_require__(4);
	var ReactDOM = __webpack_require__(37);
	var Table = __webpack_require__(188);
	__webpack_require__(211);
	
	var tableData = [{ key: 0, a: '123' }, { key: 1, a: 'cdd', b: 'edd' }, { key: 2, a: '1333', c: 'eee', d: 2 }];
	
	var App = React.createClass({
	  displayName: 'App',
	  getInitialState: function getInitialState() {
	    this.columns = [{ title: 'title 1', dataIndex: 'a', key: 'a', width: 100 }, { title: 'title 2', dataIndex: 'b', key: 'b', width: 100 }, { title: 'title 3', dataIndex: 'c', key: 'c', width: 200 }, { title: 'Operation', dataIndex: '', key: 'x', render: this.renderAction }];
	    return {
	      data: tableData,
	      expandedRowKeys: [],
	      expandIconAsCell: true,
	      expandRowByClick: false
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
	  onExpandIconAsCellChange: function onExpandIconAsCellChange(e) {
	    this.setState({
	      expandIconAsCell: e.target.checked
	    });
	  },
	  onExpandRowByClickChange: function onExpandRowByClickChange(e) {
	    this.setState({
	      expandRowByClick: e.target.checked
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
	        'Close All'
	      );
	    }
	    var openAll = function openAll() {
	      return _this.setState({ expandedRowKeys: [0, 1, 2] });
	    };
	    return React.createElement(
	      'button',
	      { onClick: openAll },
	      'Expand All'
	    );
	  },
	  remove: function remove(index) {
	    var data = this.state.data;
	    data.splice(index, 1);
	    this.setState({ data: data });
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
	    var _this2 = this;
	
	    return React.createElement(
	      'a',
	      { href: '#', onClick: function onClick() {
	          return _this2.remove(index);
	        } },
	      'Delete'
	    );
	  },
	  render: function render() {
	    var _state = this.state,
	        expandIconAsCell = _state.expandIconAsCell,
	        expandRowByClick = _state.expandRowByClick,
	        expandedRowKeys = _state.expandedRowKeys,
	        data = _state.data;
	
	    return React.createElement(
	      'div',
	      null,
	      this.toggleButton(),
	      React.createElement('span', { style: { display: 'inline-block', width: 20 } }),
	      React.createElement('input', {
	        type: 'checkbox',
	        checked: expandIconAsCell,
	        onChange: this.onExpandIconAsCellChange
	      }),
	      'expandIconAsCell',
	      React.createElement('span', { style: { display: 'inline-block', width: 20 } }),
	      React.createElement('input', {
	        type: 'checkbox',
	        checked: expandRowByClick,
	        onChange: this.onExpandRowByClickChange
	      }),
	      'expandRowByClick',
	      React.createElement(Table, {
	        columns: this.columns,
	        expandIconAsCell: expandIconAsCell,
	        expandRowByClick: expandRowByClick,
	        expandedRowRender: this.expandedRowRender,
	        expandedRowKeys: expandedRowKeys,
	        onExpandedRowsChange: this.onExpandedRowsChange,
	        onExpand: this.onExpand,
	        data: data
	      })
	    );
	  }
	});
	
	ReactDOM.render(React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h2',
	    null,
	    'expandedRowRender'
	  ),
	  React.createElement(App, null)
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=expandedRowRender.js.map