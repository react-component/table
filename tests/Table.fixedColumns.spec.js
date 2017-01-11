/* eslint-disable no-undef */
import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import Table from '..';

describe('Table.fixedColumns', () => {
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

  it('renders correctly', () => {
    const wrapper = render(
      <Table
        columns={columns}
        data={data}
        scroll={{ x: 1200 }}
      />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('toggles hover class when user hovering', () => {
    const wrapper = mount(
      <Table
        columns={columns}
        data={data}
        scroll={{ x: 1200 }}
      />
    );
    const tables = wrapper.find('table');
    tables.at(0).find('tbody tr').at(0).simulate('mouseEnter');
    expect(tables.at(0).find('tbody tr').at(0).is('.rc-table-row-hover')).toBe(true);
    expect(tables.at(1).find('tbody tr').at(0).is('.rc-table-row-hover')).toBe(true);
    expect(tables.at(2).find('tbody tr').at(0).is('.rc-table-row-hover')).toBe(true);
    tables.at(0).find('tbody tr').at(0).simulate('mouseLeave');
    expect(tables.at(0).find('tbody tr').at(0).is('.rc-table-row-hover')).toBe(false);
    expect(tables.at(1).find('tbody tr').at(0).is('.rc-table-row-hover')).toBe(false);
    expect(tables.at(2).find('tbody tr').at(0).is('.rc-table-row-hover')).toBe(false);
  });
});
