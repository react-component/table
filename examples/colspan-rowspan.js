/* eslint-disable no-console,func-names,react/no-multi-comp */
const React = require('react');
const ReactDOM = require('react-dom');
const Table = require('rc-table');
require('rc-table/assets/index.less');

const columns = [
  { title: '手机号', dataIndex: 'a', colSpan: 2, width: 100, key: 'a', render(o, row, index) {
    const obj = {
      children: o,
      props: {},
    };
    // 设置第一行为链接
    if (index === 0) {
      obj.children = <a href="#">{o}</a>;
    }
    // 第5行合并两列
    if (index === 4) {
      obj.props.colSpan = 2;
    }

    if (index === 5) {
      obj.props.colSpan = 6;
    }
    return obj;
  } },
  { title: '电话', dataIndex: 'b', colSpan: 0, width: 100, key: 'b', render(o, row, index) {
    const obj = {
      children: o,
      props: {},
    };
    // 列合并掉的表格设置colSpan=0，不会去渲染
    if (index === 4 || index === 5) {
      obj.props.colSpan = 0;
    }
    return obj;
  } },
  { title: '姓名', dataIndex: 'c', width: 100, key: 'c', render(o, row, index) {
    const obj = {
      children: o,
      props: {},
    };

    if (index === 5) {
      obj.props.colSpan = 0;
    }
    return obj;
  } },
  { title: '住址', dataIndex: 'd', width: 200, key: 'd', render(o, row, index) {
    const obj = {
      children: o,
      props: {},
    };
    if (index === 0) {
      obj.props.rowSpan = 2;
    }
    if (index === 1 || index === 5) {
      obj.props.rowSpan = 0;
    }

    return obj;
  } },
  { title: '性别', dataIndex: 'e', width: 200, key: 'e', render(o, row, index) {
    const obj = {
      children: o,
      props: {},
    };
    if (index === 5) {
      obj.props.colSpan = 0;
    }
    return obj;
  } },
  {
    title: '操作', dataIndex: '', key: 'f',
    render(o, row, index) {
      if (index === 5) {
        return {
          props: {
            colSpan: 0,
          },
        };
      }
      return <a href="#">操作</a>;
    },
  },
];

const data = [
  { a: '13812340987', b: '0571-12345678', c: '张三', d: '文一西路', e: '男', key: '1' },
  { a: '13812340986', b: '0571-98787658', c: '张夫人', d: '文一西路', e: '女', key: '2' },
  { a: '13812988888', b: '0571-099877', c: '李四', d: '文二西路', e: '男', key: '3' },
  { a: '1381200008888', b: '0571-099877', c: '王五', d: '文二西路', e: '男', key: '4' },
  { a: '0571-88888110', c: '李警官', d: '武林门', e: '男', key: '5' },
  { a: '资料统计完毕于xxxx年xxx月xxx日', key: '6' },
];

ReactDOM.render(
  <div>
    <h2>colSpan & rowSpan</h2>
    <Table
      columns={columns}
      data={data}
      className="table"
    />
  </div>,
  document.getElementById('__react-content')
);
