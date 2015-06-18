/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);
/******/ 		if(moreModules[0]) {
/******/ 			installedModules[0] = 0;
/******/ 			return __webpack_require__(0);
/******/ 		}
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		2:0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);
/******/
/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;
/******/
/******/ 			script.src = __webpack_require__.p + "" + chunkId + "." + ({"0":"key","1":"simple"}[chunkId]||chunkId) + ".js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(4);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	})();
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	}
	
	function _inherits(subClass, superClass) {
	  if (typeof superClass !== 'function' && superClass !== null) {
	    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
	}
	
	var React = __webpack_require__(2);
	
	//表格列
	
	var TableColumn = (function (_React$Component) {
	  function TableColumn() {
	    _classCallCheck(this, TableColumn);
	
	    if (_React$Component != null) {
	      _React$Component.apply(this, arguments);
	    }
	  }
	
	  _inherits(TableColumn, _React$Component);
	
	  _createClass(TableColumn, [{
	    key: 'render',
	    value: function render() {
	      return React.createElement('th', { width: this.props.width }, this.props.title);
	    }
	  }]);
	
	  return TableColumn;
	})(React.Component);
	
	/**
	 * 表格行
	 */
	
	var TableRow = (function (_React$Component2) {
	  function TableRow() {
	    _classCallCheck(this, TableRow);
	
	    if (_React$Component2 != null) {
	      _React$Component2.apply(this, arguments);
	    }
	  }
	
	  _inherits(TableRow, _React$Component2);
	
	  _createClass(TableRow, [{
	    key: 'render',
	    value: function render() {
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
	        cells.push(React.createElement('td', { key: col.key }, text));
	      }
	      return React.createElement('tr', null, cells);
	    }
	  }]);
	
	  return TableRow;
	})(React.Component);
	
	var Table = (function (_React$Component3) {
	  function Table() {
	    _classCallCheck(this, Table);
	
	    if (_React$Component3 != null) {
	      _React$Component3.apply(this, arguments);
	    }
	  }
	
	  _inherits(Table, _React$Component3);
	
	  _createClass(Table, [{
	    key: '_getColumns',
	    value: function _getColumns() {
	      var self = this,
	          columns = self.props.columns,
	          rst = [];
	      for (var i = 0; i < columns.length; i++) {
	        var col = columns[i];
	        rst.push(React.createElement(TableColumn, { title: col.title, dataIndex: col.dataIndex, width: col.width, key: col.key }));
	      }
	      return rst;
	    }
	  }, {
	    key: '_getRows',
	    value: function _getRows() {
	      var self = this,
	          data = self.props.data,
	          columns = self.props.columns,
	          rst = [];
	
	      var keyFn = this.props.rowKey;
	      for (var i = 0; i < data.length; i++) {
	        var record = data[i];
	        var key = keyFn ? keyFn(record, i) : undefined;
	        rst.push(React.createElement(TableRow, { record: record, index: i, columns: columns, key: key }));
	      }
	      return rst;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var self = this,
	          columns = self._getColumns(),
	          rows = self._getRows();
	      var className = 'rc-table';
	      if (this.props.className) {
	        className += ' ' + this.props.className;
	      }
	      return React.createElement('table', { className: className }, React.createElement('thead', null, React.createElement('tr', null, columns)), React.createElement('tbody', null, rows));
	    }
	  }]);
	
	  return Table;
	})(React.Component);
	
	module.exports = Table;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = {
		"name": "rc-table",
		"version": "2.2.0",
		"description": "table ui component for react",
		"keywords": [
			"react",
			"react-table"
		],
		"main": "./lib/index",
		"homepage": "http://github.com/react-component/table",
		"maintainers": [
			"dxq613@gmail.com",
			"yiminghe@gmail.com"
		],
		"repository": {
			"type": "git",
			"url": "git@github.com:react-component/table.git"
		},
		"bugs": {
			"url": "http://github.com/react-component/table/issues"
		},
		"licenses": "MIT",
		"config": {
			"port": 8000
		},
		"scripts": {
			"build": "rc-tools run build",
			"precommit": "rc-tools run precommit",
			"less": "rc-tools run less",
			"gh-pages": "rc-tools run gh-pages",
			"history": "rc-tools run history",
			"start": "node --harmony node_modules/.bin/rc-server",
			"publish": "rc-tools run tag",
			"lint": "rc-tools run lint",
			"saucelabs": "node --harmony node_modules/.bin/rc-tools run saucelabs",
			"browser-test": "node --harmony node_modules/.bin/rc-tools run browser-test",
			"browser-test-cover": "node --harmony node_modules/.bin/rc-tools run browser-test-cover"
		},
		"devDependencies": {
			"expect.js": "~0.3.1",
			"jquery": "^1.11.2",
			"precommit-hook": "^1.0.7",
			"rc-server": "3.x",
			"rc-tools": "3.x",
			"react": "~0.13.0"
		},
		"precommit": [
			"precommit"
		]
	}

/***/ }
/******/ ]);
//# sourceMappingURL=common.js.map