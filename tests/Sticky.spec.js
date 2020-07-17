import React from 'react';
import { mount } from 'enzyme';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import Table from '../src';

describe('Table.Sticky', () => {
  it('Sticky Header', () => {
    jest.useFakeTimers();
    const col1 = { dataIndex: 'light', width: 100 };
    const col2 = { dataIndex: 'bamboo', width: 200 };
    const wrapper = mount(
      <div
        style={{
          height: 10000,
        }}
      >
        <Table
          columns={[col1, col2]}
          data={[{ light: 'bamboo', bamboo: 'light', key: 1 }]}
          sticky={{
            isShowHeader: true,
          }}
        />
      </div>,
    );

    expect(wrapper.find('.rc-table-header').prop('style')).toEqual({
      overflow: 'hidden',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    });

    jest.useRealTimers();
  });

  it('Sticky scroll', () => {
    jest.useFakeTimers();
    window.pageYOffset = 900;
    document.documentElement.scrollTop = 200;
    let scrollLeft = 100;
    const domSpy = spyElementPrototypes(HTMLDivElement, {
      scrollLeft: {
        get: () => scrollLeft,
        set: left => {
          scrollLeft = left;
        },
      },
      scrollTop: {
        get: () => 100,
      },
      scrollWidth: {
        get: () => 200,
      },
      offsetWidth: {
        get: () => 100,
      },
      offsetHeight: {
        get: () => 100,
      },
    });

    const col1 = { dataIndex: 'light', width: 1000 };
    const col2 = { dataIndex: 'bamboo', width: 2000 };
    const wrapper = mount(
      <Table
        columns={[col1, col2]}
        data={[
          { light: 'bamboo', bamboo: 'light', key: 1 },
          { light: 'bamboo', bamboo: 'light', key: 2 },
          { light: 'bamboo', bamboo: 'light', key: 3 },
          { light: 'bamboo', bamboo: 'light', key: 4 },
          { light: 'bamboo', bamboo: 'light', key: 6 },
          { light: 'bamboo', bamboo: 'light', key: 7 },
          { light: 'bamboo', bamboo: 'light', key: 8 },
          { light: 'bamboo', bamboo: 'light', key: 9 },
          { light: 'bamboo', bamboo: 'light', key: 10 },
          { light: 'bamboo', bamboo: 'light', key: 11 },
          { light: 'bamboo', bamboo: 'light', key: 12 },
          { light: 'bamboo', bamboo: 'light', key: 13 },
          { light: 'bamboo', bamboo: 'light', key: 15 },
          { light: 'bamboo', bamboo: 'light', key: 16 },
          { light: 'bamboo', bamboo: 'light', key: 17 },
          { light: 'bamboo', bamboo: 'light', key: 18 },
          { light: 'bamboo', bamboo: 'light', key: 19 },
          { light: 'bamboo', bamboo: 'light', key: 20 },
          { light: 'bamboo', bamboo: 'light', key: 21 },
          { light: 'bamboo', bamboo: 'light', key: 22 },
          { light: 'bamboo', bamboo: 'light', key: 23 },
          { light: 'bamboo', bamboo: 'light', key: 24 },
          { light: 'bamboo', bamboo: 'light', key: 25 },
          { light: 'bamboo', bamboo: 'light', key: 26 },
        ]}
        scroll={{
          x: 10000,
        }}
        sticky={{
          isShowScroll: true,
        }}
      />,
    );

    jest.runAllTimers();

    expect(wrapper.find('.rc-table-sticky-scroll').get(0)).not.toBeUndefined();

    const mockFn = jest.fn();

    wrapper
      .find('.rc-table-sticky-scroll-bar')
      .simulate('mousedown', { persist: mockFn, preventDefault: mockFn, pageX: 0 });

    expect(mockFn).toHaveBeenCalledTimes(2);

    const mousemoveEvent = new Event('mousemove');

    mousemoveEvent.buttons = 1;
    mousemoveEvent.pageX = 50;
    mousemoveEvent.preventDefault = mockFn;

    document.body.dispatchEvent(mousemoveEvent);

    jest.runAllTimers();
    expect(mockFn).toHaveBeenCalledTimes(4);
    expect(wrapper.find('.rc-table-sticky-scroll-bar').prop('style')).toEqual({
      width: '50px',
      transform: 'translate3d(50px, 0px, 0px)',
    });

    mousemoveEvent.pageX = -50;
    mousemoveEvent.preventDefault = mockFn;
    document.body.dispatchEvent(mousemoveEvent);

    jest.runAllTimers();
    wrapper.update();

    expect(mockFn).toHaveBeenCalledTimes(6);
    expect(wrapper.find('.rc-table-sticky-scroll-bar').prop('style')).toEqual({
      width: '50px',
      transform: 'translate3d(0px, 0px, 0px)',
    });

    const mouseupEvent = new Event('mouseup');

    mouseupEvent.preventDefault = mockFn;

    document.body.dispatchEvent(mouseupEvent);

    expect(mockFn).toHaveBeenCalledTimes(8);

    wrapper.unmount();

    window.pageYOffset = 0;
    mockFn.mockRestore();
    domSpy.mockRestore();
    jest.useRealTimers();
  });
});
