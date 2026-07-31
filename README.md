<div align="center">
  <h1>@rc-component/table</h1>
  <p><sub><a href="https://ant.design"><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /></a> Part of the Ant Design ecosystem.</sub></p>
  <p>📋 Low-level table primitives for React, maintained in the Ant Design ecosystem.</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/table"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/table.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/table"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/table.svg?style=flat-square"></a>
    <a href="https://github.com/react-component/table/actions/workflows/main.yml"><img alt="build status" src="https://github.com/react-component/table/actions/workflows/main.yml/badge.svg"></a>
    <a href="https://app.codecov.io/gh/react-component/table"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/react-component/table/master.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/@rc-component/table"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@rc-component/table?style=flat-square"></a>
    <a href="https://github.com/umijs/dumi"><img alt="dumi" src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square"></a>
  </p>
</div>

<p align="center">English | <a href="./README.zh-CN.md">简体中文</a></p>

## Highlights

- Flexible column, summary, fixed header, sticky, expandable row, and virtual table support.
- TypeScript-first API designed for composition in design systems.
- Used by Ant Design Table and other React data display experiences.

## Install

```bash
npm install @rc-component/table
```

## Usage

```tsx
import Table from '@rc-component/table';
import type { ColumnsType } from '@rc-component/table';

interface User {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnsType<User> = [
  { title: 'Name', dataIndex: 'name', key: 'name', width: 120 },
  { title: 'Age', dataIndex: 'age', key: 'age', width: 80 },
  { title: 'Address', dataIndex: 'address', key: 'address' },
];

const data: User[] = [
  { key: '1', name: 'Jack', age: 28, address: 'Somewhere' },
  { key: '2', name: 'Rose', age: 36, address: 'Somewhere else' },
];

export default () => <Table columns={columns} data={data} />;
```

## Examples

Run the local dumi site:

```bash
npm install
npm start
```

Then open `http://localhost:8000`.

## API

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| tableLayout | `auto` \| `fixed` | `auto` \| `fixed` for any columns is fixed or ellipsis or header is fixed | https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout |
| prefixCls | String | `rc-table` |  |
| className | String |  | additional className |
| id | String |  | identifier of the container div |
| useFixedHeader | Boolean | false | whether use separator table for header. better set width for columns |
| scroll | Object | {x: false, y: false} | whether table can be scroll in x/y direction, `x` or `y` can be a number that indicated the width and height of table body |
| expandable | Object |  | Config expand props |
| expandable.defaultExpandAllRows | Boolean | false | Expand All Rows initially |
| expandable.defaultExpandedRowKeys | String[] | [] | initial expanded rows keys |
| expandable.expandedRowKeys | String[] |  | current expanded rows keys |
| expandable.expandedRowRender | Function(recode, index, indent, expanded):ReactNode |  | Content render to expanded row |
| expandable.expandedRowClassName | `string` \| `(recode, index, indent) => string` |  | get expanded row's className |
| expandable.expandRowByClick | boolean |  | Support expand by click row |
| expandable.expandIconColumnIndex | Number | 0 | The index of expandIcon which column will be inserted when expandIconAsCell is false |
| expandable.expandIcon | props => ReactNode |  | Customize expand icon |
| expandable.indentSize | Number | 15 | indentSize for every level of data.i.children, better using with column.width specified |
| expandable.rowExpandable | (record) => boolean |  | Config row support expandable |
| expandable.onExpand | Function(expanded, record) |  | function to call when click expand icon |
| expandable.onExpandedRowsChange | Function(expandedRows) |  | function to call when the expanded rows change |
| expandable.fixed | String \| Boolean | - | this expand icon will be fixed when table scroll horizontally: true or `left` or `right` and `expandIconColumnIndex` need to stay first or last |
| rowKey | string or Function(record, index):string | 'key' | If rowKey is string, `record[rowKey]` will be used as key. If rowKey is function, the return value of `rowKey(record, index)` will be use as key. |
| rowClassName | string or Function(record, index, indent):string |  | get row's className |
| rowRef | Function(record, index, indent):string |  | get row's ref key |
| data | Object[] |  | data record array to be rendered |
| onRow | Function(record, index) |  | Set custom props per each row. |
| onHeaderRow | Function(record, index) |  | Set custom props per each header row. |
| showHeader | Boolean | true | whether table head is shown |
| hidden | Boolean | `false` | Hidden column. |
| title | Function(currentData) |  | table title render function |
| footer | Function(currentData) |  | table footer render function |
| emptyText | React.Node or Function | `No Data` | Display text when data is empty |
| columns | Object[] |  | The columns config of table, see table below |
| components | Object |  | Override table elements, see [#171](https://github.com/react-component/table/pull/171) for more details |
| sticky | boolean \| {offsetHeader?: number, offsetScroll?: number, getContainer?: () => Window \| HTMLElement } | false | stick header and scroll bar |
| summary | (data: readonly RecordType[]) => React.ReactNode | - | `summary` attribute in `table` component is used to define the summary row. |
| rowHoverable | boolean | true | Table hover interaction |

### Methods

#### scrollTo

Table component exposes `scrollTo` method to scroll to a specific position:

```js
const tblRef = useRef();
tblRef.current?.scrollTo({ key: 'rowKey', align: 'start' });
```

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| index | number | - | Row index to scroll to |
| top | number | - | Scroll to specific top position (in px) |
| key | string | - | Scroll to row by row key |
| offset | number | - | Additional offset from target position |
| align | `start` \| `center` \| `end` \| `nearest` | `nearest` | Alignment of the target element within the scroll container. `start` aligns to top, `center` to middle, `end` to bottom, `nearest` automatically chooses the closest alignment. Note: Virtual table does not support `center`. |

## Column Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| key | String |  | key of this column |
| className | String |  | className of this column |
| colSpan | Number |  | thead colSpan of this column |
| title | React Node |  | title of this column |
| dataIndex | String |  | display field of the data record |
| width | String \| Number |  | width of the specific proportion calculation according to the width of the columns |
| minWidth | Number |  | the minimum width of the column, only worked when tableLayout is auto |
| fixed | String \| Boolean |  | this column will be fixed when table scroll horizontally: true or 'left' or 'right' |
| align | String |  | specify how cell content is aligned |
| ellipsis | Boolean |  | specify whether cell content be ellipsized |
| rowScope | 'row' \| 'rowgroup' |  | Set scope attribute for all cells in this column |
| onCell | Function(record, index) |  | Set custom props per each cell. |
| onHeaderCell | Function(record) |  | Set custom props per each header cell. |
| render | Function(value, row, index) |  | The render function of cell, has three params: the text of this cell, the record of this row, the index of this row, it's return an object:{ children: value, props: { colSpan: 1, rowSpan:1 } } ==> 'children' is the text of this cell, props is some setting of this cell, eg: 'colspan' set td colspan, 'rowspan' set td rowspan |

## Summary Props

### Table.Summary

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| key | String |  | key of this summary |
| fixed | boolean \| 'top' \| 'bottom' | - | `true` fixes the summary row at the bottom of the table. `top` fixes the summary row at the top of the table, while `bottom` fixes it at the bottom. `undefined` or `false` makes the summary row scrollable along with the table. |

### Table.Summary.Row

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| key | String |  | key of this summary |
| className | String | - | className of this summary row |
| style | React.CSSProperties | - | style of this summary row |
| onClick | (e?: React.MouseEvent\<HTMLElement>) => void | - | The `onClick` attribute in `Table.Summary.Row` component can be used to set a click event handler for the summary row. |

## Development

```bash
npm install
npm start
```

The dumi site runs at `http://localhost:8000` by default.

Run checks before sending a pull request:

```bash
npm run lint
npm run tsc
npm test
npm run build
```

## Release

```bash
npm run prepublishOnly
```

The release flow is handled by `@rc-component/np` through the `rc-np` command after the package build.

## Ecosystem

This package is part of the React Component organization and is maintained alongside Ant Design. The Ant Design mark above is used only as ecosystem context; the package itself stays framework-level and unstyled except for its bundled assets.

## License

@rc-component/table is released under the [MIT](./LICENSE) license.
