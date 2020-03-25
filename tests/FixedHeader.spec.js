import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Table from '../src';

describe('Table.FixedHeader', () => {
  it('switch column', () => {
    jest.useFakeTimers();
    const col1 = { dataIndex: 'light', width: 100 };
    const col2 = { dataIndex: 'bamboo', width: 200 };
    const wrapper = mount(
      <Table
        columns={[col1, col2]}
        data={[{ light: 'bamboo', bamboo: 'light', key: 1 }]}
        scroll={{ y: 10 }}
      />,
    );

    wrapper
      .find('ResizeObserver')
      .at(0)
      .props()
      .onResize({ width: 100, offsetWidth: 100 });
    wrapper
      .find('ResizeObserver')
      .at(1)
      .props()
      .onResize({ width: 200, offsetWidth: 200 });

    act(() => {
      jest.runAllTimers();
      wrapper.update();
    });

    expect(
      wrapper
        .find('colgroup col')
        .first()
        .props().style.width,
    ).toEqual(100);
    expect(
      wrapper
        .find('colgroup col')
        .last()
        .props().style.width,
    ).toEqual(200);

    // Update columns
    wrapper.setProps({ columns: [col2, col1] });
    wrapper.update();

    expect(
      wrapper
        .find('colgroup col')
        .first()
        .props().style.width,
    ).toEqual(200);
    expect(
      wrapper
        .find('colgroup col')
        .last()
        .props().style.width,
    ).toEqual(100);

    jest.useRealTimers();
  });
});
