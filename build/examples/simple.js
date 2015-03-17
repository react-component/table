webpackJsonp([0,1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(2);
	var Table = __webpack_require__(3);

	var columns = [
	  {title: '表头1', dataIndex: 'a', width: 100},
	  {id: '123', title: '表头2', dataIndex: 'b', width: 100},
	  {title: '表头3', dataIndex: 'c', width: 200},
	  {
	    title: '操作', dataIndex: '', renderer: function () {
	    return React.createElement("a", {href: "#"}, "操作")
	  }
	  }
	];

	var data = [{a: '123'}, {a: 'cdd', b: 'edd'}, {a: '1333', c: 'eee', d: 2}];

	var table = React.render(
	  React.createElement("div", null, 
	    React.createElement("link", {rel: "stylesheet", href: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css"}), 
	    React.createElement(Table, {columns: columns, data: data, className: "table"})
	  ),
	  document.getElementById('__react-content')
	);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(4);


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/** @jsx React.DOM */

	var React = __webpack_require__(2);

	//表格列
	var ____Class0=React.Component;for(var ____Class0____Key in ____Class0){if(____Class0.hasOwnProperty(____Class0____Key)){TableColumn[____Class0____Key]=____Class0[____Class0____Key];}}var ____SuperProtoOf____Class0=____Class0===null?null:____Class0.prototype;TableColumn.prototype=Object.create(____SuperProtoOf____Class0);TableColumn.prototype.constructor=TableColumn;TableColumn.__superConstructor__=____Class0;function TableColumn(){"use strict";if(____Class0!==null){____Class0.apply(this,arguments);}}
	  Object.defineProperty(TableColumn.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
	    return (React.createElement("th", {width: this.props.width}, this.props.title));
	  }});


	/**
	 * 表格行
	 */
	var ____Class1=React.Component;for(var ____Class1____Key in ____Class1){if(____Class1.hasOwnProperty(____Class1____Key)){TableRow[____Class1____Key]=____Class1[____Class1____Key];}}var ____SuperProtoOf____Class1=____Class1===null?null:____Class1.prototype;TableRow.prototype=Object.create(____SuperProtoOf____Class1);TableRow.prototype.constructor=TableRow;TableRow.__superConstructor__=____Class1;function TableRow(){"use strict";if(____Class1!==null){____Class1.apply(this,arguments);}}
	  Object.defineProperty(TableRow.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
	    var self = this,
	      columns = self.props.columns,
	      record = self.props.record,
	      index = self.props.index,
	      cells = [];
	    for (var i = 0; i < columns.length; i++) {
	      var col = columns[i],
	        renderer = col.renderer,
	        text = record[col.dataIndex];
	      if (renderer) {
	        text = renderer(text, record, index);
	      }
	      cells.push(React.createElement("td", null, text));
	    }
	    return (React.createElement("tr", null, cells));
	  }});


	var ____Class2=React.Component;for(var ____Class2____Key in ____Class2){if(____Class2.hasOwnProperty(____Class2____Key)){Table[____Class2____Key]=____Class2[____Class2____Key];}}var ____SuperProtoOf____Class2=____Class2===null?null:____Class2.prototype;Table.prototype=Object.create(____SuperProtoOf____Class2);Table.prototype.constructor=Table;Table.__superConstructor__=____Class2;function Table(){"use strict";if(____Class2!==null){____Class2.apply(this,arguments);}}
	  Object.defineProperty(Table.prototype,"$Table_getColumns",{writable:true,configurable:true,value:function() {"use strict";
	    var self = this,
	      columns = self.props.columns,
	      rst = [];
	    for (var i = 0; i < columns.length; i++) {
	      var col = columns[i];
	      rst.push(React.createElement(TableColumn, {title: col.title, dataIndex: col.dataIndex, width: col.width}));
	    }
	    return rst;
	  }});

	  Object.defineProperty(Table.prototype,"$Table_getRows",{writable:true,configurable:true,value:function() {"use strict";
	    var self = this,
	      data = self.props.data,
	      columns = self.props.columns,
	      rst = [];

	    for (var i = 0; i < data.length; i++) {
	      var record = data[i];
	      rst.push(React.createElement(TableRow, {record: record, index: i, columns: columns}));
	    }
	    return rst;

	  }});

	  Object.defineProperty(Table.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
	    var self = this,
	      columns = self.$Table_getColumns(),
	      rows = self.$Table_getRows();
	    var className = 'rc-table';
	    if (this.props.className) {
	      className += ' ' + this.props.className;
	    }
	    return (
	      React.createElement("table", {className: className}, 
	        React.createElement("thead", null, 
	          React.createElement("tr", null, 
	            columns
	          )
	        ), 
	        React.createElement("tbody", null, 
	          rows
	        )
	      )
	    );
	  }});


	module.exports = Table;


/***/ }
]);