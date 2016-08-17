/* eslint-disable no-console,func-names,react/no-multi-comp */
const expect = require('expect.js');
const Table = require('../');
const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');
import './PagingColumns.spec';

describe('table', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const columns = [
    { title: '表头1', dataIndex: 'a', key: 'a', colSpan: 2,
      width: 100, render(o, row, index) {
      // 第一列中第一行合并两列
        const obj = {
          children: o,
          props: {},
        };
        if (index === 0) {
          obj.props.colSpan = 2;
        }
        return obj;
      } },
    { id: '123', title: '表头2', colSpan: 0, dataIndex: 'b', key: 'b',
      width: 100, render(o, row, index) {
      // 2列被合并掉了colSpan:0，第二列中第一行合并两行rowSpan:2
        const obj = {
          children: o,
          props: {},
        };
        if (index === 0) {
          obj.props.colSpan = 0;
        }
        return obj;
      } },
    { title: '表头3', dataIndex: 'c', key: 'c', width: 200, render(o, row, index) {
      const obj = {
        children: o,
        props: {},
      };
      if (index === 0) {
        obj.props.rowSpan = 2;
      }
      if (index === 1) {
        obj.props.rowSpan = 0;
      }
      return obj;
    } },
    {
      title: 'operation', dataIndex: '', key: 'operation', render() {
        return <a href="#">操作</a>;
      },
    },
    {
      title: 'number', dataIndex: '', key: 'number', render() {
        return 123;
      },
    },
    {
      title: 'zero', dataIndex: '', key: 'zero', render() {
        return 0;
      },
    },
    {
      title: 'empty string', dataIndex: '', key: 'empty-string', render() {
        return '';
      },
    },
    {
      title: 'string', dataIndex: '', key: 'string', render() {
        return 'text';
      },
    },
    {
      title: 'false', dataIndex: '', key: 'false', render() {
        return false;
      },
    },
    {
      title: 'Array', dataIndex: '', key: 'array', render() {
        return [<a href="#" key="1">操作1</a>, <a href="#" key="2">操作2</a>];
      },
    },
  ];
  const data = [
    { a: '123', key: '1' },
    { a: 'cdd', b: 'edd', key: '2' },
    { a: '1333', c: 'eee', d: 2, key: '3' },
    { a: {}, key: '4' },
  ];
  let node = $(div);

  beforeEach(() => {
    ReactDOM.render(
      <Table columns={columns} data={data} className="table"
        expandedRowRender={(record) => (<p>{record.a}</p>)}
        expandRowByClick
      />,
      div
    );
    node = $(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
  });

  it('simple works', () => {
    expect(node.find('table').length).to.be(1);
    expect(node.find('tbody tr').length).to.be(data.length);
  });

  it('th colSpan works', () => {
    expect(node.find('table').length).to.be(1);
    let colspanNum = 0;
    const cLen = columns.length;
    for (let i = 0; i < cLen; i++) {
      const headerColSpan = columns[i].colSpan;
      if (headerColSpan) {
        colspanNum += headerColSpan;
      }
    }
    expect(node.find('thead th').length).to.be(columns.length - (colspanNum - 1));
  });

  it('td colSpan works', () => {
    expect(node.find('table').length).to.be(1);

    // 第一行第一列合并了
    const trFstTds = node.find('tbody tr:first td').length;
    // 最后一行是没有合并的
    const trLstTds = node.find('tbody tr:last td').length;
    // 检查未合并列是否受到影响
    expect(trLstTds).to.be(columns.length);
    // 合并和未合并行中列数是否相等
    expect(trFstTds).to.not.be(trLstTds);
    // 合并的列数是否正确
    expect(trFstTds).to.be(columns.length - (2 - 1));
  });

  it('td rowSpan works', () => {
    expect(node.find('table').length).to.be(1);
    const rowspanNum = 2;
    expect(node.find('tbody tr').eq(1).find('td').length).to.be(columns.length - (rowspanNum - 1));
  });

  it('should render columns', () => {
    const trLstTds = node.find('tbody tr:last td');
    expect(trLstTds.eq(3).find('a').length).to.be(1); // jsx
    expect(trLstTds.eq(4).text()).to.be('123'); // number
    expect(trLstTds.eq(5).text()).to.be('0'); // 0
    expect(trLstTds.eq(6).text()).to.be(''); // empty string
    expect(trLstTds.eq(7).text()).to.be('text'); // string
    expect(trLstTds.eq(8).text()).to.be(''); // false
    expect(trLstTds.eq(9).find('a').length).to.be(2); // array
  });

  // https://github.com/ant-design/ant-design/issues/1202
  it('should not render object in cell', () => {
    const trLstTds = node.find('tbody tr:last td');
    expect(trLstTds.eq(0).text()).to.be('');
  });

  it('should use rowClick to expand', () => {
    const clickRow = node.find('tbody tr:first').trigger('click');
    const newRow = clickRow.next();
    expect(newRow.text()).to.be('123');
  });
});
