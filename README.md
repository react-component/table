# rc-table

react table component

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-table.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-table
[travis-image]: https://img.shields.io/travis/react-component/table.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/table
[coveralls-image]: https://img.shields.io/coveralls/react-component/table.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/table?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/table.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/table
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/rc-table.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-table

## install

[![rc-table](https://nodei.co/npm/rc-table.png)](https://npmjs.org/package/rc-table)


## Development

```
npm install
npm start
```

## Example

http://localhost:8000/examples/

online example: http://react-component.github.io/table/examples/

## Usage

```js
var React = require('react');
var Table = require('rc-table');
require('rc-table/assets/index.css');

var columns = [
  {title: '表头1', dataIndex: 'a', colSpan: 2,key:'a',width: 100},
  {id: '123', title: '表头2', dataIndex: 'b', colSpan: 0,key:'b', width: 100, render: function(o, row, index){
      let obj ={
        children:o,
        props:{}
      }
      if(index === 0){
        obj.props.rowSpan = 2;
      }
      if(index === 1){
        obj.props.rowSpan = 0;
      }
      return obj;
    }},
  {title: '表头3', dataIndex: 'c',  key:'c',width: 200},
  {
    title: '操作', dataIndex: '',  key:'d',render: function () {
    return <a href="#">操作</a>
  }
  }
];

var data = [{a: '123',key:'1'}, {a: 'cdd', b: 'edd',key:'2'}, {a: '1333', c: 'eee', d: 2,key:'3'}];

var table = React.render(
  <div>
    <h2>simple table</h2>
    <Table columns={columns}
      data={data}
      className="table"/>
  </div>,
  document.getElementById('__react-content')
);
```
## API

### property

<table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th>default</th>
        <th>description</th>
    </tr>
    </thead>
    <tbody>
      <tr>
          <td>prefixCls</td>
          <td>String</td>
          <th>rc-table</th>
          <td></td>
      </tr>
      <tr>
          <td>className</td>
          <td>String</td>
          <th></th>
          <td>additional className</td>
      </tr>
      <tr>
         <td>colSpan</td>
         <td>Number</td>
         <th></th>
         <td>thead colSpan of this column</td>
      </tr>
      <tr>
          <td>useFixedHeader</td>
          <td>Boolean</td>
          <th>false</th>
          <td>whether use separator table for header. better set width for columns</td>
      </tr>
      <tr>
          <td>scroll</td>
          <td>Object</td>
          <th>{x: false, y: false}</th>
          <td>whether table can be scroll in x/y direction, `x` or `y` can be a number that indicated the width and height of table body</td>
      </tr>
      <tr>
          <td>expandIconAsCell</td>
          <td>Boolean</td>
          <th>false</th>
          <td>whether render expandIcon as a cell</td>
      </tr>
      <tr>
          <td>expandIconColumnIndex</td>
          <td>Number</td>
          <th>0</th>
          <td>The index of expandIcon which column will be inserted when expandIconAsCell is false</td>
      </tr>
      <tr>
          <td>rowKey</td>
          <td>Function(recode,index):string</td>
          <th>record.key</th>
          <td>default use record.key as rowKey</td>
      </tr>
      <tr>
          <td>rowClassName</td>
          <td>Function(recode,index):string</td>
          <th></th>
          <td>get row's className</td>
      </tr>
      <tr>
          <td>rowRef</td>
          <td>Function(record,index):string</td>
          <th></th>
          <td>get row's ref key</td>
      </tr>
      <tr>
          <td>defaultExpandedRowKeys</td>
          <td>String[]</td>
          <th>[]</th>
          <td>initial expanded rows keys</td>
      </tr>
      <tr>
          <td>expandedRowKeys</td>
          <td>String[]</td>
          <th></th>
          <td>current expanded rows keys</td>
      </tr>
      <tr>
          <td>defaultExpandAllRows</td>
          <td>Boolean</td>
          <th>false</th>
          <td>Expand All Rows initially</td>
      </tr>
      <tr>
          <td>onExpandedRowsChange</td>
          <td>Function(expandedRows)</td>
          <th>save the expanded rows in the internal state</th>
          <td>function to call when the expanded rows change</td>
      </tr>
      <tr>
          <td>onExpand</td>
          <td>Function(expanded, record)</td>
          <th></th>
          <td>function to call when click expand icon</td>
      </tr>
      <tr>
          <td>expandedRowClassName</td>
          <td>Function(recode,index):string</td>
          <th></th>
          <td>get expanded row's className</td>
      </tr>
      <tr>
          <td>data</td>
          <td>Object[]</td>
          <th></th>
          <td>data record array to be rendered</td>
      </tr>
      <tr>
          <td>indentSize</td>
          <td>Number</td>
          <th>15</th>
          <td>indentSize for every level of data.i.children, better using with column.width specified</td>
      </tr>
      <tr>
          <td>onRowClick</td>
          <td>Function(record, index)</td>
          <th></th>
          <td>handle rowClick action, index means the index of current row among fatherElement[childrenColumnName]</td>
      </tr>
      <tr>
          <td>columnsPageSize</td>
          <td>Number</td>
          <th>5</th>
          <td>pageSize of columns. (Deprecated, use fixed columns)</td>
      </tr>
      <tr>
          <td>columnsPageRange</td>
          <td>Array</td>
          <th></th>
          <td>columns index range need paging, like [2,10]. (Deprecated, use column.fixed)</td>
      </tr>
      <tr>
          <td>showHeader</td>
          <td>Boolean</td>
          <th>true</th>
          <td>whether table head is shown</td>
      </tr>
      <tr>
          <td>footer</td>
          <td>Function(currentData)</td>
          <th></th>
          <td>table footer render function</td>
      </tr>
      <tr>
          <td>columns</td>
          <td>Object[]<Object></td>
          <th></th>
          <td>
            The columns config of table. contains
            <table>
             <thead>
                <tr>
                    <th style="width: 100px;">name</th>
                    <th style="width: 50px;">type</th>
                    <th>default</th>
                    <th>description</th>
                </tr>
                </thead>
                <tbody>
                  <tr>
                      <td>key</td>
                      <td>String</td>
                      <th></th>
                      <td>key of this column</td>
                  </tr>
                  <tr>
                      <td>className</td>
                      <td>String</td>
                      <th></th>
                      <td>className of this column</td>
                  </tr>
                  <tr>
                      <td>title</td>
                      <td>React Node</td>
                      <th></th>
                      <td>title of this column</td>
                  </tr>
                  <tr>
                      <td>dataIndex</td>
                      <td>String</td>
                      <th></th>
                      <td>display field of the data record</td>
                  </tr>
                  <tr>
                      <td>width</td>
                      <td>String|Number</td>
                      <th></th>
                      <td>width of the specific proportion calculation according to the width of the columns</td>
                  </tr>
                  <tr>
                      <td>fixed</td>
                      <td>String|Boolean</td>
                      <th></th>
                      <td>this column will be fixed when table scroll horizontally: true or 'left' or 'right'</td>
                  </tr>
                  <tr>
                      <td>render</td>
                      <td>Function(value, row, index)</td>
                      <th></th>
                      <td>The render function of cell, has three params: the text of this cell, the record of this row, the index of this row, it's return an object:{children: value, props:{colSpan: 1, rowSpan:1}}==>'children' is the text of this cell, props is some setting of this cell, eg: 'colspan' set td colspan, 'rowspan' set td rowspan</td>
                  </tr>
                </tbody>
            </table>
          </td>
      </tr>
    </tbody>
</table>

## Test Case

http://localhost:8000/tests/runner.html?coverage

## Coverage

http://localhost:8000/node_modules/rc-server/node_modules/node-jscover/lib/front-end/jscoverage.html?w=http://localhost:8000/tests/runner.html?coverage

## License

rc-table is released under the MIT license.
