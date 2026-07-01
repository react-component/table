<div align="center">
  <h1>@rc-component/table</h1>
  <p><sub><a href="https://ant.design"><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /></a> Ant Design 生态的一部分。</sub></p>
  <p>📋 React 底层表格基础组件，服务于复杂数据展示。</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/table"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/table.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/table"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/table.svg?style=flat-square"></a>
    <a href="https://github.com/react-component/table/actions/workflows/main.yml"><img alt="build status" src="https://github.com/react-component/table/actions/workflows/main.yml/badge.svg"></a>
    <a href="https://app.codecov.io/gh/react-component/table"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/react-component/table/master.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/@rc-component/table"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@rc-component/table?style=flat-square"></a>
    <a href="https://github.com/umijs/dumi"><img alt="dumi" src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square"></a>
  </p>
</div>

<p align="center"><a href="./README.md">English</a> | 简体中文</p>

## 特性

- 灵活的列、摘要、固定标题、粘性、可扩展行和虚拟表支持。
- TypeScript-first API 专为设计系统中的组合而设计。
- 被 Ant Design 使用 Table 等 React 数据展示体验。

## 安装

```bash
npm install @rc-component/table
```

## 使用

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

## 示例

运行本地 dumi 站点：

```bash
npm install
npm start
```

然后打开 `http://localhost:8000`。

## API

### Properties

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| tableLayout | `auto` \| `fixed` | `auto` \| 任何列的 `fixed` 都是固定的，或者省略号或标题是固定的 | https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout |
| prefixCls | String | `rc-table` |  |
| className | String |  | 附加 className |
| id | String |  | 容器div的标识符 |
| useFixedHeader | Boolean | false | 是否对标题使用分隔符表。更好地设置列宽度 |
| scroll | Object | {x: false, y: false} | 表格是否可以在x/y方向滚动，`x`或`y`可以是一个数字，表示表格主体的宽度和高度 |
| expandable | Object |  | 配置展开道具 |
| expandable.defaultExpandAllRows | Boolean | false | 初始展开所有行 |
| expandable.defaultExpandedRowKeys | String[] | [] | 初始扩展行键 |
| expandable.expandedRowKeys | String[] |  | 当前扩展行键 |
| expandable.expandedRowRender | Function(recode, index, indent, expanded):ReactNode |  | 内容渲染到扩展行 |
| expandable.expandedRowClassName | `string` \| `(recode, index, indent) => string` |  | 获取扩展行的 className |
| expandable.expandRowByClick | boolean |  | 支持点击行展开 |
| expandable.expandIconColumnIndex | Number | 0 | ExpandIconAsCell 为 false 时将插入哪一列的 ExpandIcon 索引 |
| expandable.expandIcon | props => ReactNode |  | 自定义展开图标 |
| expandable.indentSize | Number | 15 | 每一级 `data[i].children` 的缩进尺寸，建议配合指定的 `column.width` 使用 |
| expandable.rowExpandable | (record) => boolean |  | 配置行支持可扩展 |
| expandable.onExpand | Function(expanded, record) |  | 单击展开图标时调用的函数 |
| expandable.onExpandedRowsChange | Function(expandedRows) |  | 扩展行更改时调用的函数 |
| expandable.fixed | String \| Boolean | - | 当表格水平滚动时，此展开图标将被修复： true 或 `left` 或 `right` 和 `expandIconColumnIndex` 需要保留在第一个或最后一个 |
| rowKey | string or Function(record, index):string | 'key' | 如果 rowKey 是字符串，则 `record[rowKey]` 将用作键。如果 rowKey 是函数，则 `rowKey(record, index)` 的返回值将用作 key。 |
| rowClassName | string or Function(record, index, indent):string |  | 获取行的 className |
| rowRef | Function(record, index, indent):string |  | 获取行 ref key |
| data | Object[] |  | 要呈现的数据记录数组 |
| onRow | Function(record, index) |  | 每行设置自定义道具。 |
| onHeaderRow | Function(record, index) |  | 为每个标题行设置自定义道具。 |
| showHeader | Boolean | true | 是否显示表头 |
| hidden | Boolean | `false` | 隐藏列。 |
| title | Function(currentData) |  | 表格标题渲染函数 |
| footer | Function(currentData) |  | 表页脚渲染函数 |
| emptyText | React.Node or Function | `No Data` | 数据为空时显示文本 |
| columns | Object[] |  | 表的列配置见下表 |
| components | Object |  | 覆盖表元素，请参阅 [#171](https://github.com/react-component/table/pull/171) 了解更多详细信息 |
| sticky | boolean \| {offsetHeader?: number, offsetScroll?: number, getContainer?: () => Window \| HTMLElement } | false | 粘贴标题和滚动条 |
| summary | (data: readonly RecordType[]) => React.ReactNode | - | `table` 组件中的 `summary` 属性用于定义汇总行。 |
| rowHoverable | boolean | true | 表格 hover 交互 |

### 方法

#### scrollTo

Table 组件公开 `scrollTo` 方法来滚动到特定位置：

```js
const tblRef = useRef();
tblRef.current?.scrollTo({ key: 'rowKey', align: 'start' });
```

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| index | number | - | 要滚动到的行索引 |
| top | number | - | 滚动到特定顶部位置（以像素为单位） |
| key | string | - | 按行键滚动至行 |
| offset | number | - | 与目标位置的额外偏移 |
| align | `start` \| `center` \| `end` \| `nearest` | `nearest` | 滚动容器内目标元素的对齐方式。 `start` 对齐到顶部，`center` 对齐到中间，`end` 对齐到底部，`nearest` 自动选择最接近的对齐方式。注意：虚拟表不支持 `center`。 |

## Column 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| key | String |  | 本栏目关键 |
| className | String |  | 该列的 className |
| colSpan | Number |  | 该列的 head colSpan |
| title | React节点 |  | 本栏目标题 |
| dataIndex | String |  | 数据记录的显示字段 |
| 宽度 | String \| Number |  | 宽度具体比例根据柱子的宽度计算 |
| minWidth | Number |  | 列的最小宽度，仅当 tableLayout 为 auto 时有效 |
| fixed | String \| Boolean |  | 当表格水平滚动时此列将被固定： true 或 'left' 或 'right' |
| align | String |  | 指定单元格内容的对齐方式 |
| ellipsis | Boolean |  | 指定单元格内容是否省略 |
| rowScope | 'row' \| 'rowgroup' |  | 设置此列中所有单元格的范围属性 |
| onCell | Function(record, index) |  | 为每个单元格设置自定义道具。 |
| onHeaderCell | Function(record) |  | 为每个标题单元格设置自定义属性。 |
| 使成为 | 函数（值、行、索引） |  | 单元格渲染函数，参数为单元格文本、当前行记录和行索引。可返回 `{ children: value, props: { colSpan: 1, rowSpan: 1 } }`，其中 `children` 是单元格文本，`props` 是单元格设置，例如 `colSpan` 设置 td colspan，`rowSpan` 设置 td rowspan |

## Summary Props

### Table.Summary

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| key | String |  | 本摘要的关键 |
| fixed | boolean \| 'top' \| 'bottom' | - | `true` 修复了表格底部的汇总行。 `top` 将汇总行固定在表格顶部，而 `bottom` 将其固定在底部。 `undefined` 或 `false` 使摘要行可随表格一起滚动。 |

### Table.Summary.Row

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| key | String |  | 本摘要的关键 |
| className | String | - | 此摘要行的 className |
| 风格 | React.CSSProperties | - | 此摘要行的样式 |
| onClick | (e?: React.MouseEvent\<HTMLElement>) => void | - | `Table.Summary.Row` 组件中的 `onClick` 属性可用于设置汇总行的单击事件处理程序。 |

## 本地开发

```bash
npm install
npm start
```

dumi 站点默认运行在 `http://localhost:8000`。

在发送拉取请求之前运行检查：

```bash
npm run lint
npm run tsc
npm test
npm run build
```

## 发布

```bash
npm run prepublishOnly
```

包构建完成后，发布流程由 `@rc-component/np` 通过 `rc-np` 命令处理。

## Ecosystem

该包属于 React Component 组织，并与 Ant Design 一同维护。 上方 Ant Design 标识仅用于说明生态归属；组件本身仍保持框架级、低样式耦合的定位。

## 许可证

@rc-component/table 基于 [MIT](./LICENSE) 许可证发布。
