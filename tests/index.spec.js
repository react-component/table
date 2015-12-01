const expect = require('expect.js');
const Table = require('../');
const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

describe('table', function() {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const columns = [
    {title: '表头1', dataIndex: 'a', colSpan: 2, width: 100, render: function(o, row, index) {
      // 第一列中第一行合并两列
      const obj = {
        children: o,
        props: {},
      };
      if (index === 0) {
        obj.props.colSpan = 2;
      }
      return obj;
    }},
    {id: '123', title: '表头2', colSpan: 0, dataIndex: 'b', width: 100, render: function(o, row, index) {
      // 2列被合并掉了colSpan:0，第二列中第一行合并两行rowSpan:2
      const obj = {
        children: o,
        props: {},
      };
      if (index === 0) {
        obj.props.colSpan = 0;
      }
      return obj;
    }},
    {title: '表头3', dataIndex: 'c', width: 200, render: function(o, row, index) {
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
    }},
    {
      title: '操作', dataIndex: '', renderer: function() {
        return <a href="#">操作</a>;
      },
    },
  ];
  const data = [{a: '123'}, {a: 'cdd', b: 'edd'}, {a: '1333', c: 'eee', d: 2}];
  let node = $(div);

  beforeEach(function() {
    ReactDOM.render(
      <Table columns={columns} data={data} className="table"/>,
      div
    );
    node = $(div);
  });

  afterEach(function() {
    ReactDOM.unmountComponentAtNode(div);
  });

  it('simple works', function() {
    expect(node.find('table').length).to.be(1);
    expect(node.find('tbody tr').length).to.be(data.length);
  });

  it('th colSpan works', function() {
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

  it('td colSpan works', function() {
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
    expect(trFstTds).to.be(columns.length - ( 2 - 1));
  });

  it('td rowSpan works', function() {
    expect(node.find('table').length).to.be(1);
    const rowspanNum = 2;
    expect(node.find('tbody tr').eq(1).find('td').length).to.be(columns.length - (rowspanNum - 1));
  });
});
