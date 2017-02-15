/* eslint-disable no-console,func-names,react/no-multi-comp */
const expect = require('expect.js');
const Table = require('../');
const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');
const { Simulate } = require('react-addons-test-utils');

describe('mouse event in table row', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  let node;

  const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 400,
  }, {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: 100,
    render: (text) => (
      <a href="#">
        Alert: {text}, click will pop to row click
      </a>
    ),
  }, {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    width: 200,
  }];
  const data = [{
    key: 1,
    name: 'a',
    age: 32,
    address: 'I am a',
  }];

  const spy = {
    callCount: 0,
    callArgs: null,
  };

  const onRowMouseOver = (...args) => {
    spy.callArgs = args;
    spy.callCount += 1;
  };

  const onRowMouseOut = (...args) => {
    spy.callArgs = args;
    spy.callCount += 1;
  };

  const onRowMouseUp = (...args) => {
    spy.callArgs = args;
    spy.callCount += 1;
  };

  beforeEach(() => {
    ReactDOM.render(
      <Table
        columns={columns}
        data={data}
        onRowMouseUp={onRowMouseUp}
        onRowMouseOver={onRowMouseOver}
        onRowMouseOut={onRowMouseOut}
      />,
      div
    );
    node = $(div);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    spy.callArgs = null;
    spy.callCount = 0;
  });

  it('mouseOver', () => {
    Simulate.mouseOver(node.find('tbody tr:first')[0]);
    expect(spy.callCount).to.be(1);
    expect(spy.callArgs[0]).to.be(data[0]);
    expect(spy.callArgs[1]).to.be(0);
    expect(spy.callArgs[2].type).to.be('mouseover');
  });

  it('mouseUp', () => {
    Simulate.mouseUp(node.find('tbody tr:first')[0]);
    expect(spy.callCount).to.be(1);
    expect(spy.callArgs[0]).to.be(data[0]);
    expect(spy.callArgs[1]).to.be(0);
    expect(spy.callArgs[2].type).to.be('mouseup');
  });

  it('mouseOut', () => {
    Simulate.mouseOut(node.find('tbody tr:first')[0]);
    expect(spy.callCount).to.be(1);
    expect(spy.callArgs[0]).to.be(data[0]);
    expect(spy.callArgs[1]).to.be(0);
    expect(spy.callArgs[2].type).to.be('mouseout');
  });
});
