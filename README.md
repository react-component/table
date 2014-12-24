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

## Usage

```js
var Table = require('rc-table');

  var columns = [
    {title : 'header 1',dataIndex :'a', width:100},
    {id: '123',title : 'header 2',dataIndex :'b', width:100},
    {title : 'header 3',dataIndex : 'c',width:200},
    {title : 'operate',dataIndex : '',renderer :function (value,obj) {
      return <a href="#">edit</a>
    }}
  ];

  var data = [{a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2}];

  var table = React.renderComponent(
        <Table columns={columns} data={data} className="table"/>,
        document.getElementById('t1')
  );
  
// use table
```
## API 

### property

#### columns 
  * The columns config of table

    * title : The title of column
    * dataIndex : display the data field
    * width : The width of column. The width of the specific proportion calculation according to the width of the columns
    * renderer : The render function of cell , has two params. value : the text of this cell;obj : the record of this row

#### data
  * The Data to be shown

#### className 
  * The css class this table to be used

## Test Case

http://localhost:8000/tests/runner.html?coverage

## Coverage

http://localhost:8000/node_modules/rc-server/node_modules/node-jscover/lib/front-end/jscoverage.html?w=http://localhost:8000/tests/runner.html?coverage

## License

rc-table is released under the MIT license.