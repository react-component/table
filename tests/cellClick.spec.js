/* eslint-disable no-console,func-names,react/no-multi-comp */
const expect = require('expect.js');
const Table = require('../');
const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');
const { Simulate } = require('react-addons-test-utils');

describe('click table cell', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  let node;

  const cellSpy = {
    callCount: 0,
    callArgs: null,
  };
  const onCellClick = (...args) => {
    cellSpy.callArgs = args;
    cellSpy.callCount += 1;
  };

  const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 400,
    onCellClick,
  }, {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 100,
  }, {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    width: 200,
    onCellClick,
  }];
  const data = [{
    key: 1,
    name: 'a',
    age: 32,
    address: 'I am a',
  }];

  beforeEach(() => {
    ReactDOM.render(
      <Table
        columns={columns}
        data={data}
      />,
      div
    );
    node = $(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    cellSpy.callArgs = null;
    cellSpy.callCount = 0;
  });

  it('click for first th', () => {
    Simulate.click(node.find('thead tr:first th:first')[0]);
    expect(cellSpy.callCount).to.be(1);
    expect(cellSpy.callArgs[0]).to.have.key('onCellClick');
    expect(cellSpy.callArgs[0].onCellClick).to.be.a('function');
    expect(cellSpy.callArgs[0]).to.have.key('title');
    expect(cellSpy.callArgs[0].title).to.be(columns[0].title);
    expect(cellSpy.callArgs[0]).to.have.key('dataIndex');
    expect(cellSpy.callArgs[0].dataIndex).to.be(columns[0].dataIndex);
    expect(cellSpy.callArgs[0]).to.have.key('key');
    expect(cellSpy.callArgs[0].key).to.be(columns[0].key);
    expect(cellSpy.callArgs[1]).to.be(columns[0].key);
    expect(cellSpy.callArgs[2].type).to.be('click');
  });

  it('click for first td', () => {
    Simulate.click(node.find('tbody tr:first td:first')[0]);
    expect(cellSpy.callCount).to.be(1);
    expect(cellSpy.callArgs[0]).to.be(data[0]);
    expect(cellSpy.callArgs[1]).to.be(columns[0].key);
    expect(cellSpy.callArgs[2].type).to.be('click');
  });

  it('no click for second td', () => {
    Simulate.click(node.find('tbody tr:first td:nth-child(2)')[0]);
    expect(cellSpy.callCount).to.be(0);
    expect(cellSpy.callArgs).to.be(null);
  });
});
