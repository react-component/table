/* eslint-disable no-console,func-names,react/no-multi-comp,max-len */
const expect = require('expect.js');
const Table = require('../');
const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');
const { Simulate } = require('react-addons-test-utils');

describe('Table with fixed columns', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  let node;
  const columns = [
    { title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
    { title: 'title2', dataIndex: 'b', key: 'b', width: 100, fixed: 'left' },
    { title: 'title3', dataIndex: 'c', key: 'c' },
    { title: 'title4', dataIndex: 'b', key: 'd' },
    { title: 'title5', dataIndex: 'b', key: 'e' },
    { title: 'title6', dataIndex: 'b', key: 'f' },
    { title: 'title7', dataIndex: 'b', key: 'g' },
    { title: 'title8', dataIndex: 'b', key: 'h' },
    { title: 'title9', dataIndex: 'b', key: 'i' },
    { title: 'title10', dataIndex: 'b', key: 'j' },
    { title: 'title11', dataIndex: 'b', key: 'k' },
    { title: 'title12', dataIndex: 'b', key: 'l', width: 100, fixed: 'right' },
  ];

  const data = [
    { a: '123', b: 'xxxxxxxx', d: 3, key: '1' },
    { a: 'cdd', b: 'edd12221', d: 3, key: '2' },
    { a: '133', c: 'edd12221', d: 2, key: '3' },
    { a: '133', c: 'edd12221', d: 2, key: '4' },
    { a: '133', c: 'edd12221', d: 2, key: '5' },
    { a: '133', c: 'edd12221', d: 2, key: '6' },
    { a: '133', c: 'edd12221', d: 2, key: '7' },
    { a: '133', c: 'edd12221', d: 2, key: '8' },
    { a: '133', c: 'edd12221', d: 2, key: '9' },
  ];

  beforeEach(() => {
    ReactDOM.render(
      <Table
        columns={columns}
        data={data}
        scroll={{ x: 1200 }}
      />,
      div
    );
    node = $(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
  });

  it('should has three table', () => {
    expect(node.find('table').length).to.be(3);
    expect(node.find('table').eq(0).find('th').length).to.be(2);
    expect(node.find('table').eq(1).find('th').length).to.be(columns.length);
    expect(node.find('table').eq(2).find('th').length).to.be(1);
  });

  it('should be fixed in left initially', () => {
    expect(node.find('.rc-table').hasClass('rc-table-scroll-position-left')).to.be(true);
  });

  // not working in PhantomJS
  xit('should be fixed in right when scroll', () => {
    const scrollNode = node.find('.rc-table-scroll .rc-table-body')[0];
    Simulate.mouseOver(scrollNode);
    scrollNode.scrollLeft = 100;
    Simulate.scroll(scrollNode, { target: scrollNode });
    expect(node.find('.rc-table').hasClass('rc-table-scroll-position-left')).to.be(false);
    expect(node.find('.rc-table').hasClass('rc-table-scroll-position-right')).to.be(false);
    Simulate.mouseOver(scrollNode);
    scrollNode.scrollLeft = 2000;
    Simulate.scroll(scrollNode, { target: scrollNode });
    expect(node.find('.rc-table').hasClass('rc-table-scroll-position-left')).to.be(false);
    expect(node.find('.rc-table').hasClass('rc-table-scroll-position-right')).to.be(true);
  });

  it('should has hover className', () => {
    Simulate.mouseEnter(node.find('table').eq(0).find('tbody tr')[0]);
    expect(node.find('table').eq(0).find('tbody tr').eq(0).hasClass('rc-table-row-hover')).to.be(true);
    expect(node.find('table').eq(1).find('tbody tr').eq(0).hasClass('rc-table-row-hover')).to.be(true);
    expect(node.find('table').eq(2).find('tbody tr').eq(0).hasClass('rc-table-row-hover')).to.be(true);
    Simulate.mouseLeave(node.find('table').eq(0).find('tbody tr')[0]);
    expect(node.find('table').eq(0).find('tbody tr').eq(0).hasClass('rc-table-row-hover')).to.be(false);
    expect(node.find('table').eq(1).find('tbody tr').eq(0).hasClass('rc-table-row-hover')).to.be(false);
    expect(node.find('table').eq(2).find('tbody tr').eq(0).hasClass('rc-table-row-hover')).to.be(false);
  });
});
