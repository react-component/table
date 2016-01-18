const expect = require('expect.js');
const Table = require('../');
const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');
const TestUtils = require('react-addons-test-utils');
const Simulate = TestUtils.Simulate;

describe('Table with paging columns ', function() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const divWithPagingColumns = document.createElement('div');
  document.body.appendChild(divWithPagingColumns);

  const columns = [
    {title: '表头1', dataIndex: 'a', key: 'a'},
    {title: '表头2', dataIndex: 'b', key: 'b'},
    {title: '表头3', dataIndex: 'b', key: 'c'},
    {title: '表头4', dataIndex: 'b', key: 'd'},
    {title: '表头5', dataIndex: 'b', key: 'e'},
    {title: '表头6', dataIndex: 'b', key: 'f'},
    {title: '表头7', dataIndex: 'b', key: 'g'},
    {title: '表头8', dataIndex: 'b', key: 'h'},
    {title: '表头9', dataIndex: 'b', key: 'i'},
    {title: '表头10', dataIndex: 'b', key: 'j'},
    {title: '表头11', dataIndex: 'b', key: 'k'},
    {title: '表头12', dataIndex: 'b', key: 'l'},
  ];

  const data = [{a: '123', key: '1'}, {a: 'cdd', b: 'edd', key: '2'}, {a: '1333', c: 'eee', d: 2, key: '3'}];
  let node;
  let nodeWithPagingColumns;

  beforeEach(function() {
    ReactDOM.render(
      <Table columns={columns} data={data} />,
      div
    );
    node = $(div);
    ReactDOM.render(
      <Table columns={columns} data={data} columnsPageRange={[1, 10]} columnsPageSize={4} />,
      divWithPagingColumns
    );
    nodeWithPagingColumns = $(divWithPagingColumns);
  });

  afterEach(function() {
    ReactDOM.unmountComponentAtNode(div);
    ReactDOM.unmountComponentAtNode(divWithPagingColumns);
  });

  it('should display all columns', function() {
    expect(node.find('.rc-table-thead th:not(.rc-table-column-hidden)').length).to.be(12);
  });

  it('should display columns in current page', function() {
    expect(nodeWithPagingColumns.find('.rc-table-thead th:not(.rc-table-column-hidden)').length).to.be(6);
    const hiddenColumns = nodeWithPagingColumns.find('.rc-table-thead th.rc-table-column-hidden');
    hiddenColumns.each(function(i, col) {
      expect(col.innerHTML).to.be('表头' + (6 + i));
    });
  });

  it('should be able to switch next and prev', function() {
    expect(nodeWithPagingColumns.find('.rc-table-prev-columns-page').length).to.be(1);
    expect(nodeWithPagingColumns.find('.rc-table-next-columns-page').length).to.be(1);
    expect(nodeWithPagingColumns.find('.rc-table-prev-columns-page').hasClass('rc-table-prev-columns-page-disabled')).to.be.ok();

    // 进入第二页
    Simulate.click(nodeWithPagingColumns.find('.rc-table-next-columns-page')[0]);
    expect(nodeWithPagingColumns.find('.rc-table-prev-columns-page').hasClass('rc-table-prev-columns-page-disabled')).not.to.be.ok();
    let hiddenColumns = nodeWithPagingColumns.find('.rc-table-thead th.rc-table-column-hidden');
    hiddenColumns.each(function(i, col) {
      if (i < 4) {
        // 2 3 4 5
        expect(col.innerHTML).to.be('表头' + (2 + i));
      } else {
        // 10 11
        expect(col.innerHTML).to.be('表头' + (6 + i));
      }
    });
    // 进入第三页
    Simulate.click(nodeWithPagingColumns.find('.rc-table-next-columns-page')[0]);
    expect(nodeWithPagingColumns.find('.rc-table-next-columns-page').hasClass('rc-table-next-columns-page-disabled')).to.be.ok();
    hiddenColumns = nodeWithPagingColumns.find('.rc-table-thead th.rc-table-column-hidden');
    expect(hiddenColumns.length).to.be(8);
    hiddenColumns.each(function(i, col) {
      expect(col.innerHTML).to.be('表头' + (2 + i));
    });
    // 进入第二页
    Simulate.click(nodeWithPagingColumns.find('.rc-table-prev-columns-page')[0]);
    expect(nodeWithPagingColumns.find('.rc-table-next-columns-page').hasClass('rc-table-next-columns-page-disabled')).not.to.be.ok();
    hiddenColumns = nodeWithPagingColumns.find('.rc-table-thead th.rc-table-column-hidden');
    hiddenColumns.each(function(i, col) {
      if (i < 4) {
        // 2 3 4 5
        expect(col.innerHTML).to.be('表头' + (2 + i));
      } else {
        // 10 11
        expect(col.innerHTML).to.be('表头' + (6 + i));
      }
    });
    // 进入第一页
    Simulate.click(nodeWithPagingColumns.find('.rc-table-prev-columns-page')[0]);
    expect(nodeWithPagingColumns.find('.rc-table-prev-columns-page').hasClass('rc-table-prev-columns-page-disabled')).to.be.ok();
    hiddenColumns = nodeWithPagingColumns.find('.rc-table-thead th.rc-table-column-hidden');
    expect(hiddenColumns.length).to.be(6);
    hiddenColumns.each(function(i, col) {
      expect(col.innerHTML).to.be('表头' + (6 + i));
    });
  });
});
