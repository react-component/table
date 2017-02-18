/* eslint-disable no-undef */
import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson, mountToJson } from 'enzyme-to-json';
import Table from '..';

describe('Table.expand', () => {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
  ];
  const data = [
    { key: 0, name: 'Lucy', age: 27 },
    { key: 1, name: 'Jack', age: 28 },
  ];
  const expandedRowRender = () => <p>extra data</p>;
  const createTable = (props) => (
    <Table
      columns={columns}
      data={data}
      {...props}
    />
  );

  it('renders expand row correctly', () => {
    const wrapper = render(createTable({ expandedRowRender }));
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('renders tree row correctly', () => {
    const localData = [
      { key: 0, name: 'Lucy', age: 27, children: [
        { key: 2, name: 'Jim', age: 1 },
      ] },
      { key: 1, name: 'Jack', age: 28 },
    ];
    const wrapper = render(createTable({ data: localData }));
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('renders expand icon as cell', () => {
    const wrapper = render(createTable({
      expandedRowRender,
      expandIconAsCell: true,
    }));
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('renders expand icon to the specify column', () => {
    const wrapper = render(createTable({
      expandedRowRender,
      expandIconColumnIndex: 1,
    }));
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('renders nested data correctly', () => {
    const localData = [
      {
        key: '0',
        name: 'Lucy',
        age: 27,
        children: [
          { key: '0-1', name: 'Jim', age: '2' },
        ],
      },
      {
        key: 1,
        name: 'Jack',
        age: 28,
      },
    ];
    const wrapper = render(createTable({ data: localData }));
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('expand all rows by default', () => {
    const wrapper = render(createTable({
      expandedRowRender,
      defaultExpandAllRows: true,
    }));
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('expand rows by defaultExpandedRowKeys', () => {
    const wrapper = render(createTable({
      expandedRowRender,
      defaultExpandedRowKeys: [1],
    }));
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('controlled by expandedRowKeys', () => {
    const wrapper = mount(createTable({
      expandedRowRender,
      expandedRowKeys: [0],
    }));
    expect(mountToJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({ expandedRowKeys: [1] });
    expect(mountToJson(wrapper)).toMatchSnapshot();
  });

  it('renders expend row class correctly', () => {
    const expandedRowClassName = jest.fn().mockReturnValue('expand-row-test-class-name');
    const wrapper = render(createTable({
      expandedRowRender,
      expandedRowKeys: [0],
      expandedRowClassName,
    }));
    expect(renderToJson(wrapper)).toMatchSnapshot();
    expect(expandedRowClassName).toBeCalledWith(data[0], 0, 0);
  });

  it('fires expand change event', () => {
    const onExpand = jest.fn();
    const wrapper = mount(createTable({
      expandedRowRender,
      onExpand,
    }));
    wrapper.find('ExpandIcon').first().simulate('click');
    expect(onExpand).toBeCalledWith(true, data[0]);
    wrapper.find('ExpandIcon').first().simulate('click');
    expect(onExpand).toBeCalledWith(false, data[0]);
  });

  it('fires onExpandedRowsChange event', () => {
    const onExpandedRowsChange = jest.fn();
    const wrapper = mount(createTable({
      expandedRowRender,
      onExpandedRowsChange,
    }));
    wrapper.find('ExpandIcon').first().simulate('click');
    expect(onExpandedRowsChange).toBeCalledWith([0]);
  });

  it('fires onExpandedRowsChange event when row is removed', () => {
    const onExpandedRowsChange = jest.fn();
    const wrapper = mount(createTable({
      defaultExpandAllRows: true,
      expandedRowRender,
      onExpandedRowsChange,
    }));
    wrapper.setProps({ data: [
      { key: 1, name: 'Jack', age: 28 },
    ] });
    expect(onExpandedRowsChange).toBeCalledWith([1]);
  });

  it('expand row by click', () => {
    const wrapper = mount(createTable({ expandedRowRender }));
    wrapper.find('ExpandIcon').first().simulate('click');
    expect(mountToJson(wrapper)).toMatchSnapshot();
  });
});
