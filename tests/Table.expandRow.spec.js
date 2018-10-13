/* eslint-disable no-undef */
import React from 'react';
import { render, mount } from 'enzyme';
import Table from '../src';

describe('Table.expand', () => {
  const expandedRowRender = () => <p>extra data</p>;

  const sampleColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
  ];

  const sampleData = [{ key: 0, name: 'Lucy', age: 27 }, { key: 1, name: 'Jack', age: 28 }];

  const createTable = props => <Table columns={sampleColumns} data={sampleData} {...props} />;

  it('renders expand row correctly', () => {
    const wrapper = render(createTable({ expandedRowRender }));
    expect(wrapper).toMatchSnapshot();
  });

  it('pass proper paramters to expandedRowRender', () => {
    const rowRender = jest.fn(() => <div>expanded row</div>);
    const wrapper = mount(
      createTable({
        expandedRowRender: rowRender,
      }),
    );
    wrapper.setProps({ expandedRowKeys: [0] });
    expect(rowRender).toHaveBeenLastCalledWith(sampleData[0], 0, 1, true);
    wrapper.setProps({ expandedRowKeys: [] });
    expect(rowRender).toHaveBeenLastCalledWith(sampleData[0], 0, 1, false);
  });

  it('renders tree row correctly', () => {
    const data = [
      {
        key: 0,
        name: 'Lucy',
        age: 27,
        children: [{ key: 2, name: 'Jim', age: 1 }],
      },
      { key: 1, name: 'Jack', age: 28 },
    ];
    const wrapper = render(createTable({ data }));
    expect(wrapper).toMatchSnapshot();
  });

  it('renders fixed column correctly', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', fixed: true },
      { title: 'Age', dataIndex: 'age', key: 'age' },
      { title: 'Gender', dataIndex: 'gender', key: 'gender', fixed: 'right' },
    ];
    const data = [
      { key: 0, name: 'Lucy', age: 27, gender: 'F' },
      { key: 1, name: 'Jack', age: 28, gender: 'M' },
    ];
    const wrapper = render(createTable({ columns, data, expandedRowRender }));
    expect(wrapper).toMatchSnapshot();
  });

  it('renders expand icon as cell', () => {
    const wrapper = render(
      createTable({
        expandedRowRender,
        expandIconAsCell: true,
      }),
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders expand icon to the specify column', () => {
    const wrapper = render(
      createTable({
        expandedRowRender,
        expandIconColumnIndex: 1,
      }),
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders custom expand icon', () => {
    const onExpand = jest.fn();
    const wrapper = mount(
      createTable({
        expandedRowRender,
        expandIcon: expanded => (expanded ? '-' : '+'),
        onExpand,
      }),
    );
    const icon = wrapper.find('ExpandIcon').first();
    expect(icon.text()).toEqual('+');
    icon.simulate('click');
    expect(onExpand).toBeCalledWith(true, sampleData[0]);
    expect(icon.text()).toEqual('-');
    icon.simulate('click');
    expect(onExpand).toBeCalledWith(false, sampleData[0]);
  });

  it('renders nested data correctly', () => {
    const localData = [
      {
        key: '0',
        name: 'Lucy',
        age: 27,
        children: [{ key: '0-1', name: 'Jim', age: '2' }],
      },
      {
        key: 1,
        name: 'Jack',
        age: 28,
      },
    ];
    const wrapper = render(createTable({ data: localData }));
    expect(wrapper).toMatchSnapshot();
  });

  it('expand all rows by default', () => {
    const wrapper = render(
      createTable({
        expandedRowRender,
        defaultExpandAllRows: true,
      }),
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('expand rows by defaultExpandedRowKeys', () => {
    const wrapper = render(
      createTable({
        expandedRowRender,
        defaultExpandedRowKeys: [1],
      }),
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('controlled by expandedRowKeys', () => {
    const wrapper = mount(
      createTable({
        expandedRowRender,
        expandedRowKeys: [0],
      }),
    );
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.setProps({ expandedRowKeys: [1] });
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('renders expend row class correctly', () => {
    const expandedRowClassName = jest.fn().mockReturnValue('expand-row-test-class-name');
    const wrapper = render(
      createTable({
        expandedRowRender,
        expandedRowKeys: [0],
        expandedRowClassName,
      }),
    );
    expect(wrapper).toMatchSnapshot();
    expect(expandedRowClassName).toBeCalledWith(sampleData[0], 0, 0);
  });

  it('fires expand change event', () => {
    const onExpand = jest.fn();
    const wrapper = mount(
      createTable({
        expandedRowRender,
        onExpand,
      }),
    );
    wrapper
      .find('ExpandIcon')
      .first()
      .simulate('click');
    expect(onExpand).toBeCalledWith(true, sampleData[0]);
    wrapper
      .find('ExpandIcon')
      .first()
      .simulate('click');
    expect(onExpand).toBeCalledWith(false, sampleData[0]);
  });

  it('fires onExpandedRowsChange event', () => {
    const onExpandedRowsChange = jest.fn();
    const wrapper = mount(
      createTable({
        expandedRowRender,
        onExpandedRowsChange,
      }),
    );
    wrapper
      .find('ExpandIcon')
      .first()
      .simulate('click');
    expect(onExpandedRowsChange).toBeCalledWith([0]);
  });

  it('fires onExpandedRowsChange event when row is removed', () => {
    const onExpandedRowsChange = jest.fn();
    const onExpand = jest.fn();
    const wrapper = mount(
      createTable({
        defaultExpandAllRows: true,
        expandedRowRender,
        onExpandedRowsChange,
        onExpand,
      }),
    );
    wrapper.setProps({
      data: [{ key: 1, name: 'Jack', age: 28 }],
    });
    expect(onExpandedRowsChange).toBeCalledWith([1]);
    expect(onExpand).not.toBeCalled();
  });

  it('expand row by click', () => {
    const wrapper = mount(createTable({ expandedRowRender }));
    wrapper
      .find('ExpandIcon')
      .first()
      .simulate('click');
    expect(wrapper.render()).toMatchSnapshot();
  });
});
