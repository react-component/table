webpackJsonp([3],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(215);


/***/ },

/***/ 215:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* eslint-disable no-console,func-names,react/no-multi-comp */
	var React = __webpack_require__(4);
	var ReactDOM = __webpack_require__(37);
	var Table = __webpack_require__(188);
	__webpack_require__(211);
	
	var columns = [{ title: '手机号', dataIndex: 'a', colSpan: 2, width: 100, key: 'a', render: function render(o, row, index) {
	    var obj = {
	      children: o,
	      props: {}
	    };
	    // 设置第一行为链接
	    if (index === 0) {
	      obj.children = React.createElement(
	        'a',
	        { href: '#' },
	        o
	      );
	    }
	    // 第5行合并两列
	    if (index === 4) {
	      obj.props.colSpan = 2;
	    }
	
	    if (index === 5) {
	      obj.props.colSpan = 6;
	    }
	    return obj;
	  }
	}, { title: '电话', dataIndex: 'b', colSpan: 0, width: 100, key: 'b', render: function render(o, row, index) {
	    var obj = {
	      children: o,
	      props: {}
	    };
	    // 列合并掉的表格设置colSpan=0，不会去渲染
	    if (index === 4 || index === 5) {
	      obj.props.colSpan = 0;
	    }
	    return obj;
	  }
	}, { title: 'Name', dataIndex: 'c', width: 100, key: 'c', render: function render(o, row, index) {
	    var obj = {
	      children: o,
	      props: {}
	    };
	
	    if (index === 5) {
	      obj.props.colSpan = 0;
	    }
	    return obj;
	  }
	}, { title: 'Address', dataIndex: 'd', width: 200, key: 'd', render: function render(o, row, index) {
	    var obj = {
	      children: o,
	      props: {}
	    };
	    if (index === 0) {
	      obj.props.rowSpan = 2;
	    }
	    if (index === 1 || index === 5) {
	      obj.props.rowSpan = 0;
	    }
	
	    return obj;
	  }
	}, { title: 'Gender', dataIndex: 'e', width: 200, key: 'e', render: function render(o, row, index) {
	    var obj = {
	      children: o,
	      props: {}
	    };
	    if (index === 5) {
	      obj.props.colSpan = 0;
	    }
	    return obj;
	  }
	}, {
	  title: 'Operations', dataIndex: '', key: 'f',
	  render: function render(o, row, index) {
	    if (index === 5) {
	      return {
	        props: {
	          colSpan: 0
	        }
	      };
	    }
	    return React.createElement(
	      'a',
	      { href: '#' },
	      'Operations'
	    );
	  }
	}];
	
	var data = [{ a: '13812340987', b: '0571-12345678', c: '张三', d: '文一西路', e: 'Male', key: '1' }, { a: '13812340986', b: '0571-98787658', c: '张夫人', d: '文一西路', e: 'Female', key: '2' }, { a: '13812988888', b: '0571-099877', c: '李四', d: '文二西路', e: 'Male', key: '3' }, { a: '1381200008888', b: '0571-099877', c: '王五', d: '文二西路', e: 'Male', key: '4' }, { a: '0571-88888110', c: '李警官', d: '武林门', e: 'Male', key: '5' }, { a: '资料统计完毕于xxxx年xxx月xxx日', key: '6' }];
	
	ReactDOM.render(React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h2',
	    null,
	    'colSpan & rowSpan'
	  ),
	  React.createElement(Table, {
	    columns: columns,
	    data: data,
	    className: 'table'
	  })
	), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=colspan-rowspan.js.map