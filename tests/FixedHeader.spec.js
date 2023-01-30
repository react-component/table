import { mount } from 'enzyme';
import RcResizeObserver from 'rc-resize-observer';
import { spyElementPrototype } from 'rc-util/lib/test/domHook';
import React from 'react';
import { act } from 'react-dom/test-utils';
import Table, { INTERNAL_COL_DEFINE } from '../src';
import { safeAct } from './utils';

describe('Table.FixedHeader', () => {
  let domSpy;
  let visible = true;

  beforeAll(() => {
    domSpy = spyElementPrototype(HTMLElement, 'offsetParent', {
      get: () => (visible ? {} : null),
    });
  });

  beforeEach(() => {
    jest.useFakeTimers();
    visible = true;
  });

  afterAll(() => {
    domSpy.mockRestore();
  });

  it('should work', async () => {
    const col1 = { dataIndex: 'light', width: 100 };
    const col2 = { dataIndex: 'bamboo', width: 200 };
    const col3 = { dataIndex: 'empty', width: 0 };
    const wrapper = mount(
      <Table
        columns={[col1, col2, col3]}
        data={[{ light: 'bamboo', bamboo: 'light', key: 1 }]}
        scroll={{ y: 10 }}
      />,
    );
    wrapper
      .find(RcResizeObserver.Collection)
      .first()
      .props()
      .onBatchResize([
        {
          data: wrapper.find('ResizeObserver').at(0).props().data,
          size: { width: 100, offsetWidth: 100 },
        },
        {
          data: wrapper.find('ResizeObserver').at(1).props().data,
          size: { width: 200, offsetWidth: 200 },
        },
        {
          data: wrapper.find('ResizeObserver').at(2).props().data,
          size: { width: 0, offsetWidth: 0 },
        },
      ]);
    await safeAct(wrapper);

    expect(wrapper.find('.rc-table-header table').props().style.visibility).toBeFalsy();

    expect();
    expect(wrapper.find('colgroup col').at(0).props().style.width).toEqual(100);
    expect(wrapper.find('colgroup col').at(1).props().style.width).toEqual(200);
    expect(wrapper.find('colgroup col').at(2).props().style.width).toEqual(0);

    // Update columns
    wrapper.setProps({ columns: [col2, col1] });
    wrapper.update();

    expect(wrapper.find('colgroup col').at(0).props().style.width).toEqual(200);
    expect(wrapper.find('colgroup col').at(1).props().style.width).toEqual(100);

    jest.useRealTimers();
  });

  it('INTERNAL_COL_DEFINE', async () => {
    const col1 = {
      dataIndex: 'light',
      width: 100,
      [INTERNAL_COL_DEFINE]: { className: 'test-internal' },
    };
    const col2 = { dataIndex: 'bamboo', width: 200 };
    const wrapper = mount(
      <Table
        columns={[col1, col2]}
        data={[{ light: 'bamboo', bamboo: 'light', key: 1 }]}
        scroll={{ y: 10 }}
      />,
    );
    await safeAct(wrapper);

    expect(wrapper.find('table').last().find('colgroup col').first().props().className).toEqual(
      'test-internal',
    );
    expect(wrapper.find('table').first().find('colgroup col').first().props().className).toEqual(
      'test-internal',
    );
  });

  it('show header when data is null', async () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
    ];

    const wrapper = mount(
      <Table
        columns={columns}
        data={[]}
        scroll={{
          x: true,
          y: 100,
        }}
      />,
    );

    await safeAct(wrapper);
    expect(wrapper.find('.rc-table-header table').props().style).toEqual(
      expect.objectContaining({ visibility: null }),
    );
  });

  it('rtl', async () => {
    const wrapper = mount(
      <Table
        columns={[{ dataIndex: 'light', width: 100 }]}
        data={[{ key: 0, light: 'bamboo' }]}
        direction="rtl"
        scroll={{
          y: 100,
        }}
      />,
    );
    await safeAct(wrapper);

    expect(wrapper.find('Header').props().stickyOffsets).toEqual(
      expect.objectContaining({
        isSticky: false,
        left: [expect.anything(), expect.anything()],
      }),
    );
  });

  it('invisible should not change width', async () => {
    const col1 = { dataIndex: 'light', width: 93 };
    const wrapper = mount(
      <Table
        columns={[col1]}
        data={[{ light: 'bamboo', bamboo: 'light', key: 1 }]}
        scroll={{ y: 10 }}
      />,
    );

    wrapper
      .find(RcResizeObserver.Collection)
      .first()
      .props()
      .onBatchResize([
        {
          data: wrapper.find('ResizeObserver').at(0).props().data,
          size: { width: 93, offsetWidth: 93 },
        },
      ]);
    await safeAct(wrapper);

    expect(wrapper.find('FixedHolder col').first().props().style).toEqual(
      expect.objectContaining({ width: 93 }),
    );

    // Hide Table should not modify column width
    visible = false;

    wrapper
      .find(RcResizeObserver.Collection)
      .first()
      .props()
      .onBatchResize([
        {
          data: wrapper.find('ResizeObserver').at(0).props().data,
          size: { width: 0, offsetWidth: 0 },
        },
      ]);

    act(() => {
      jest.runAllTimers();
      wrapper.update();
    });

    expect(wrapper.find('FixedHolder col').first().props().style).toEqual(
      expect.objectContaining({ width: 93 }),
    );

    jest.useRealTimers();
  });

  it('do not mask as ant-table-cell-fix-left-last in nested table parent cell', async () => {
    const columns = [
      {
        title: '父表头右侧的阴影导致整个表格最右侧有空隙',
        children: [
          {
            key: 'name',
            title: 'Name',
            fixed: 'left',
            dataIndex: 'name',
          },
          {
            key: 'name',
            title: 'Name',
            fixed: 'left',
            dataIndex: 'name',
          },
          {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
          },
          {
            key: 'name',
            title: 'Name',
            fixed: 'right',
            dataIndex: 'name',
          },
        ],
      },
    ];

    const data = [
      {
        key: 0,
        name: 'Jack',
      },
      {
        key: 1,
        name: 'Jack1',
      },
      {
        key: 2,
        name: 'Jack1',
      },
    ];
    const wrapper = mount(<Table columns={columns} data={data} scroll={{ x: true }} />);
    await safeAct(wrapper);
    expect(wrapper.find('td').at(9).props().className).toContain('rc-table-cell-fix-left-last');
    expect(wrapper.find('th').first().props().className).not.toContain(
      'rc-table-cell-fix-left-last',
    );
  });
});
