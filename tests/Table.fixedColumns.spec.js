/* eslint-disable no-undef */
import React from 'react';
import { render, mount } from 'enzyme';
import Table from '../src';

describe('Table.fixedColumns', () => {
  // see:
  // https://github.com/airbnb/enzyme/issues/49#issuecomment-270250193
  // https://github.com/tmpvar/jsdom/issues/653
  function mockClientRect(node, rect) {
    node.getBoundingClientRect = () => ({
      ...rect,
    });
  }
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
    const wrapper = render(<Table columns={columns} data={data} scroll={{ x: 1200 }} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('toggles hover class when user hovering', () => {
    const wrapper = mount(<Table columns={columns} data={data} scroll={{ x: 1200 }} />);
    let tables = wrapper.find('table');
    tables
      .at(0)
      .find('tbody tr')
      .at(0)
      .simulate('mouseEnter');
    tables = wrapper.find('table');
    expect(
      tables
        .at(0)
        .find('tbody tr')
        .at(0)
        .is('.rc-table-row-hover'),
    ).toBe(true);
    expect(
      tables
        .at(1)
        .find('tbody tr')
        .at(0)
        .is('.rc-table-row-hover'),
    ).toBe(true);
    expect(
      tables
        .at(2)
        .find('tbody tr')
        .at(0)
        .is('.rc-table-row-hover'),
    ).toBe(true);
    tables
      .at(0)
      .find('tbody tr')
      .at(0)
      .simulate('mouseLeave');
    tables = wrapper.find('table');
    expect(
      tables
        .at(0)
        .find('tbody tr')
        .at(0)
        .is('.rc-table-row-hover'),
    ).toBe(false);
    expect(
      tables
        .at(1)
        .find('tbody tr')
        .at(0)
        .is('.rc-table-row-hover'),
    ).toBe(false);
    expect(
      tables
        .at(2)
        .find('tbody tr')
        .at(0)
        .is('.rc-table-row-hover'),
    ).toBe(false);
  });

  it('has correct scroll classNames when table resize', () => {
    const wrapper = mount(
      <Table columns={columns} data={data} scroll={{ x: true }} style={{ width: 2000 }} />,
    );
    const tableNode = wrapper.instance().tableNode;
    const tableBodyContainer = tableNode.querySelectorAll('.rc-table-scroll > .rc-table-body')[0];
    const tableBodyNode = tableBodyContainer.children[0];
    expect(tableNode.className).toContain('rc-table-scroll-position-left');
    expect(tableNode.className).toContain('rc-table-scroll-position-right');
    mockClientRect(tableBodyContainer, {
      width: 500,
    });
    mockClientRect(tableBodyNode, {
      width: 800,
    });
    wrapper.setProps({ style: { width: 500 } });
    expect(tableNode.className).toContain('rc-table-scroll-position-left');
    expect(tableNode.className).not.toContain('rc-table-scroll-position-right');
  });

  it('update fixed column high after columns change', () => {
    const wrapper = mount(<Table columns={[]} data={[]} />);
    wrapper.setProps({ columns, data });
    expect(wrapper.instance().resizeEvent).not.toBeUndefined();
  });
});
