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
    const domSpy = spyElementPrototypes(HTMLDivElement, {
      scrollLeft: {
        get: () => 100,
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

    jest.useRealTimers();
    domSpy.mockRestore();
  });
});
