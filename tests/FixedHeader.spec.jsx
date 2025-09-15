import { render, act } from '@testing-library/react';
import { _rs } from '@rc-component/resize-observer';
import { spyElementPrototypes } from '@rc-component/util/lib/test/domHook';
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
    const { container } = render(
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

  it('do not mask as fixed in nested table parent cell', async () => {
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
    await act(async () => {
      vi.runAllTimers();
      await Promise.resolve();
    });
    expect(container.querySelectorAll('th.rc-table-cell-fix-start')).toHaveLength(2);
    expect(container.querySelectorAll('th.rc-table-cell-fix-end')).toHaveLength(1);
  });

  it('should support measureRowRender to wrap MeasureRow with custom provider', async () => {
    const FilterDropdown = ({ visible, onVisibleChange }) => (
      <div className="test-filter-dropdown" style={{ display: visible ? 'block' : 'none' }}>
        Filter Content
        <button onClick={() => onVisibleChange && onVisibleChange(!visible)}>Toggle</button>
      </div>
    );

    const columns = [
      {
        title: (
          <div>
            Name
            <FilterDropdown visible={true} onVisibleChange={() => {}} />
          </div>
        ),
        dataIndex: 'name',
        key: 'name',
        width: 100,
      },
    ];

    const data = [
      {
        key: 1,
        name: 'Jack',
      },
    ];

    // Mock ConfigProvider-like wrapper
    const measureRowRender = measureRow => (
      <div data-testid="measure-row-wrapper" style={{ display: 'none' }}>
        {measureRow}
      </div>
    );

    const { container } = render(
      <Table
        columns={columns}
        data={data}
        sticky
        scroll={{ x: true }}
        measureRowRender={measureRowRender}
      />,
    );

    await safeAct(container);

    // Check that measureRowRender wrapper is applied
    const measureRowWrapper = container.querySelectorAll('[data-testid="measure-row-wrapper"]');
    expect(measureRowWrapper).toHaveLength(1);
    expect(measureRowWrapper[0].style.display).toBe('none');

    // Check that MeasureRow is inside the wrapper
    const measureRowInWrapper = measureRowWrapper[0].querySelectorAll('.rc-table-measure-row');
    expect(measureRowInWrapper).toHaveLength(1);
  });
});
