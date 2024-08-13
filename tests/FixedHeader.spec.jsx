import { render, screen, fireEvent } from '@testing-library/react';
import RcResizeObserver from 'rc-resize-observer';
import { spyElementPrototype } from 'rc-util/lib/test/domHook';
import React from 'react';
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
    vi.useFakeTimers();
    visible = true;
  });

  afterAll(() => {
    domSpy.mockRestore();
  });

  it('should work', async () => {
    const col1 = { dataIndex: 'light', width: 100 };
    const col2 = { dataIndex: 'bamboo', width: 200 };
    const col3 = { dataIndex: 'empty', width: 0 };
    const { container } = render(
      <Table
        columns={[col1, col2, col3]}
        data={[{ light: 'bamboo', bamboo: 'light', key: 1 }]}
        scroll={{ y: 10 }}
      />,
    );

    async function triggerResize(resizeList) {
      fireEvent(container.querySelector(RcResizeObserver.Collection), new Event('resize', { bubbles: true }));
      await safeAct(container);
    }

    await triggerResize([
      {
        data: container.querySelector('ResizeObserver').first().props().data,
        size: { width: 100, offsetWidth: 100 },
      },
      {
        data: container.querySelector('ResizeObserver').at(1).props().data,
        size: { width: 200, offsetWidth: 200 },
      },
      {
        data: container.querySelector('ResizeObserver').at(2).props().data,
        size: { width: 0, offsetWidth: 0 },
      },
    ]);

    expect(container.querySelector('.rc-table-header table').style.visibility).toBeFalsy();

    expect(container.querySelector('colgroup col').at(0).style.width).toEqual(100);
    expect(container.querySelector('colgroup col').at(1).style.width).toEqual(200);
    expect(container.querySelector('colgroup col').at(2).style.width).toEqual(0);

    // Update columns
    rerender(<Table columns={[col2, col1]} />);

    await triggerResize([
      {
        data: container.querySelector('ResizeObserver').at(0).props().data,
        size: { width: 200, offsetWidth: 200 },
      },
      {
        data: container.querySelector('ResizeObserver').at(1).props().data,
        size: { width: 100, offsetWidth: 100 },
      },
    ]);

    expect(container.querySelector('colgroup col').at(0).style.width).toEqual(200);
    expect(container.querySelector('colgroup col').at(1).style.width).toEqual(100);

    vi.useRealTimers();
  });

  it('INTERNAL_COL_DEFINE', async () => {
    const col1 = {
      dataIndex: 'light',
      width: 100,
      [INTERNAL_COL_DEFINE]: { className: 'test-internal' },
    };
    const col2 = { dataIndex: 'bamboo', width: 200 };
    const { container } = render(
      <Table
        columns={[col1, col2]}
        data={[{ light: 'bamboo', bamboo: 'light', key: 1 }]}
        scroll={{ y: 10 }}
      />,
    );
    await safeAct(container);

    expect(container.querySelector('table').last().querySelector('colgroup col').first().className).toEqual(
      'test-internal',
    );
    expect(container.querySelector('table').first().querySelector('colgroup col').first().className).toEqual(
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

    const { container } = render(
      <Table
        columns={columns}
        data={[]}
        scroll={{
          x: true,
          y: 100,
        }}
      />,
    );

    await safeAct(container);
    expect(container.querySelector('.rc-table-header table').style).toEqual(
      expect.objectContaining({ visibility: null }),
    );
  });

  it('rtl', async () => {
    const { container } = render(
      <Table
        columns={[{ dataIndex: 'light', width: 100 }]}
        data={[{ key: 0, light: 'bamboo' }]}
        direction="rtl"
        scroll={{
          y: 100,
        }}
      />,
    );
    await safeAct(container);

    expect(container.querySelector('Header').props().stickyOffsets).toEqual(
      expect.objectContaining({
        isSticky: false,
        left: [expect.anything(), expect.anything()],
      }),
    );
  });

  it('invisible should not change width', async () => {
    const col1 = { dataIndex: 'light', width: 93 };
    const { container } = render(
      <Table
        columns={[col1]}
        data={[{ light: 'bamboo', bamboo: 'light', key: 1 }]}
        scroll={{ y: 10 }}
      />,
    );

    fireEvent(container.querySelector(RcResizeObserver.Collection), new Event('resize', { bubbles: true }));
    await safeAct(container);

    expect(container.querySelector('FixedHolder col').first().style).toEqual(
      expect.objectContaining({ width: 93 }),
    );

    // Hide Table should not modify column width
    visible = false;

    fireEvent(container.querySelector(RcResizeObserver.Collection), new Event('resize', { bubbles: true }));

    act(() => {
      vi.runAllTimers();
      container.update();
    });

    expect(container.querySelector('FixedHolder col').first().style).toEqual(
      expect.objectContaining({ width: 93 }),
    );

    vi.useRealTimers();
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
    const { container } = render(<Table columns={columns} data={data} scroll={{ x: true }} />);
    await safeAct(container);
    expect(container.querySelector('td').at(9).className).toContain('rc-table-cell-fix-left-last');
    expect(container.querySelector('th').first().className).not.toContain(
      'rc-table-cell-fix-left-last',
    );
  });
});
