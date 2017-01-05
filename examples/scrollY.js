webpackJsonp([19],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(317);


/***/ },

/***/ 317:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* eslint-disable no-console,func-names,react/no-multi-comp */
	var React = __webpack_require__(4);
	var ReactDOM = __webpack_require__(37);
	var Table = __webpack_require__(188);
	__webpack_require__(211);
	
	var data = [];
	for (var i = 0; i < 10; i++) {
	  data.push({
	    key: i,
	    a: 'a' + i,
	    b: 'b' + i,
	    c: 'c' + i
	  });
	}
	
	var Test = React.createClass({
	  displayName: 'Test',
	  getInitialState: function getInitialState() {
	    return {
	      showBody: true
	    };
	  },
	  toggleBody: function toggleBody() {
	    this.setState({
	      showBody: !this.state.showBody
	    });
	  },
	  render: function render() {
	    var columns = [{ title: 'title1', key: 'a', dataIndex: 'a', width: 100 }, { id: '123', title: 'title2', dataIndex: 'b', key: 'b', width: 100 }, { title: 'title3', key: 'c', dataIndex: 'c', width: 200 }, {
	      title: React.createElement(
	        'a',
	        { onClick: this.toggleBody, href: '#' },
	        this.state.showBody ? '隐藏' : '显示',
	        '\u4F53'
	      ),
	      key: 'x',
	      width: 200,
	      render: function render() {
	        return React.createElement(
	          'a',
	          { href: '#' },
	          'Operations'
	        );
	      }
	    }];
	    return React.createElement(Table, {
	      columns: columns,
	      data: data,
	      scroll: { y: 300 },
	      rowKey: function rowKey(record) {
	        return record.key;
	      },
	      bodyStyle: {
	        display: this.state.showBody ? '' : 'none'
	      }
	    });
	  }
	});
	
	ReactDOM.render(React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h2',
	    null,
	    'scroll body table'
	  ),
	  React.createElement(Test, null)
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=scrollY.js.map