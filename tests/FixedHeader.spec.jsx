import { render, act, fireEvent } from '@testing-library/react';
import RcResizeObserver, { _rs } from '@rc-component/resize-observer';
import { spyElementPrototype, spyElementPrototypes } from '@rc-component/util/lib/test/domHook';
import React from 'react';
import Table, { INTERNAL_COL_DEFINE } from '../src';
import { safeAct } from './utils';

async function triggerResize(ele) {
  await act(async () => {
    _rs([{ target: ele }]);
    await Promise.resolve();
  });
}

describe('Table.FixedHeader', () => {
  let domSpy;
  let visible = true;
  let measureWidth = 100;

  beforeAll(() => {
    domSpy = spyElementPrototypes(HTMLElement, {
      offsetParent: {
        get: () => (visible ? {} : null),
      },
      offsetWidth: {
        get: () => (visible ? measureWidth : 0),
      },
    });
  });

  beforeEach(() => {
    measureWidth = 100;
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
    const { container, rerender } = render(
      <Table
        columns={[col1, col2, col3]}
        data={[{ light: 'bamboo', bamboo: 'light', key: 1 }]}
        scroll={{ y: 10 }}
      />,
    );

    const measureCells = container.querySelectorAll('.rc-table-measure-row');

    await triggerResize(measureCells[0]);
    await triggerResize(measureCells[1]);
    await triggerResize(measureCells[2]);
    act(() => {
      vi.runAllTimers();
    });

    expect(container.querySelector('.rc-table-header table').style.visibility).toBeFalsy();

    expect(parseInt(container.querySelectorAll('colgroup col')[0].style.width)).toEqual(100);
    expect(parseInt(container.querySelectorAll('colgroup col')[1].style.width)).toEqual(100);
    expect(parseInt(container.querySelectorAll('colgroup col')[2].style.width)).toEqual(100);

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

    const tables = container.querySelectorAll('table');
    expect(tables[tables.length - 1].querySelector('colgroup col').className).toEqual(
      'test-internal',
    );
    expect(tables[0].querySelector('colgroup col').className).toEqual('test-internal');
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

    await act(async () => {
      vi.runAllTimers();
      await Promise.resolve();
    });

    expect(container.querySelector('.rc-table-header table')).not.toHaveStyle({
      visibility: 'hidden',
    });
  });

  it('invisible should not change width', async () => {
    const col1 = { dataIndex: 'light' };
    const { container } = render(
      <Table
        columns={[col1]}
        data={[{ light: 'bamboo', bamboo: 'light', key: 1 }]}
        scroll={{ y: 10 }}
      />,
    );

    await triggerResize(container.querySelector('.rc-table-measure-row'));

    expect(parseInt(container.querySelector('col').style.width)).toEqual(100);

    // Hide Table should not modify column width
    visible = false;
    await triggerResize(container.querySelector('.rc-table-measure-row'));

    await act(async () => {
      vi.runAllTimers();
      await Promise.resolve();
    });

    expect(parseInt(container.querySelector('col').style.width)).toEqual(100);

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
    expect(container.querySelectorAll('td')[9].className).toContain('rc-table-cell-fix-left-last');
    expect(container.querySelector('th').className).not.toContain('rc-table-cell-fix-left-last');
  });
});
