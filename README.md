# rc-table

React table component.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-table.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-table
[travis-image]: https://img.shields.io/travis/react-component/table.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/table
[coveralls-image]: https://img.shields.io/coveralls/react-component/table.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/table?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/table.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/table
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

http://react-component.github.io/table/examples/

## Usage

```js
import Table from 'rc-table';

const columns = [{
  title: 'Name', dataIndex: 'name', key:'name', width: 100,
}, {
  title: 'Age', dataIndex: 'age', key:'age', width: 100,
}, {
  title: 'Address', dataIndex: 'address', key:'address', width: 200,
}, {
  title: 'Apeartions', dataIndex: '', key:'opeartions', render: () => <a href="#">Delete</a>,
}];

const data = [
  { name: 'Jack', age: 28, address: 'some where', key:'1' },
  { name: 'Rose', age: 36, address: 'some where', key:'2' },
];

React.render(<Table columns={columns} data={data} />, mountNode);
```

## API

### Properties

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
          <td>string or Function(record, index):string</td>
          <th>'key'</th>
          <td>
              If rowKey is string, `record[rowKey]` will be used as key.
              If rowKey is function, the return value of `rowKey(record, index)` will be use as key.
          </td>
      </tr>
      <tr>
          <td>rowClassName</td>
          <td>Function(record, index, indent):string</td>
          <th></th>
          <td>get row's className</td>
      </tr>
      <tr>
          <td>rowRef</td>
          <td>Function(record, index, indent):string</td>
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
          <td>Function(recode, index, indent):string</td>
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
          <td>title</td>
          <td>Function(currentData)</td>
          <th></th>
          <td>table title render function</td>
      </tr>
      <tr>
          <td>footer</td>
          <td>Function(currentData)</td>
          <th></th>
          <td>table footer render function</td>
      </tr>
      <tr>
          <td>getBodyWrapper</td>
          <td>Function(body)</td>
          <th></th>
          <td>get wrapper of tbody, [demoe](http://react-component.github.io/table/examples/animation.html)</td>
      </tr>
      <tr>
          <td>emptyText</td>
          <td>React.Node</td>
          <th>`No Data`</th>
          <td>Display text when data is empty</td>
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
                     <td>colSpan</td>
                     <td>Number</td>
                     <th></th>
                     <td>thead colSpan of this column</td>
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
                      <td>The render function of cell, has three params: the text of this cell, the record of this row, the index of this row, it's return an object:{ children: value, props: { colSpan: 1, rowSpan:1 } } ==> 'children' is the text of this cell, props is some setting of this cell, eg: 'colspan' set td colspan, 'rowspan' set td rowspan</td>
                  </tr>
                </tbody>
            </table>
          </td>
      </tr>
    </tbody>
</table>

## License

rc-table is released under the MIT license.
