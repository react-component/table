import { render, act } from '@testing-library/react';
import { _rs } from '@rc-component/resize-observer';
import { spyElementPrototypes } from '@rc-component/util';
import React from 'react';
import Table, { INTERNAL_COL_DEFINE } from '../src';
import { safeAct } from './utils';

async function triggerResize(ele) {
  await act(async () => {
    _rs([{ target: ele }]);
    await Promise.resolve();
  });
}

async function measureColumns(container) {
  const measureCells = container.querySelectorAll('.rc-table-measure-row td');
  for (const measureCell of measureCells) {
    await triggerResize(measureCell);
  }
  await safeAct();
}

function getHeaderColumns(container) {
  return Array.from(container.querySelectorAll('.rc-table-header colgroup col'));
}

function getHeaderLeafCells(container) {
  return Array.from(container.querySelectorAll('.rc-table-header thead tr:last-child th'));
}

function getColumnWidths(columns) {
  return columns.map(column => column.style.width);
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

  describe('scrollbar column model', () => {
    it('keeps the initial empty header ColGroup aligned with the scrollbar header cell', async () => {
      visible = false;
      const columns = [
        {
          title: 'Selection',
          dataIndex: 'selection',
          width: 48,
          [INTERNAL_COL_DEFINE]: {
            className: 'selection-column',
            columnType: 'SELECTION_COLUMN',
          },
        },
        { title: 'Name', dataIndex: 'name' },
        { title: 'Age', dataIndex: 'age', width: 80 },
      ];
      const { container } = render(<Table columns={columns} data={[]} scroll={{ y: 100 }} />);

      await safeAct();

      const headerColumns = getHeaderColumns(container);
      const headerLeafCells = getHeaderLeafCells(container);

      expect(headerColumns).toHaveLength(headerLeafCells.length);
      expect(headerColumns).toHaveLength(columns.length + 1);
      expect(headerColumns[0]).toHaveClass('selection-column');
      expect(headerColumns[0]).toHaveStyle({ width: '48px' });
      expect(headerColumns[1].style.width).toBeFalsy();
      expect(headerColumns[2]).toHaveStyle({ width: '80px' });
      expect(headerColumns.at(-1)).toHaveStyle({ width: '15px' });
      expect(headerLeafCells.at(-1)).toHaveClass('rc-table-cell-scrollbar');
      expect(container.querySelector('.rc-table-header table')).toHaveStyle({
        minWidth: 'calc(100% - 15px)',
        width: 'calc(100% - 15px)',
      });
      expect(container.querySelector('.rc-table-body table')).toHaveStyle({
        width: 'calc(100% - 15px)',
      });
    });

    it('keeps the scrollbar column structure when empty data becomes populated', async () => {
      visible = false;
      const columns = [
        { title: 'Name', dataIndex: 'name', width: 120 },
        { title: 'Age', dataIndex: 'age' },
        { title: 'Address', dataIndex: 'address', width: 160 },
      ];
      const data = [{ key: 1, name: 'Light', age: 18, address: 'Bamboo' }];
      const { container, rerender } = render(
        <Table columns={columns} data={[]} scroll={{ y: 100 }} />,
      );

      await safeAct();
      const emptyColumnCount = getHeaderColumns(container).length;

      visible = true;
      rerender(<Table columns={columns} data={data} scroll={{ y: 100 }} />);
      await measureColumns(container);

      const populatedHeaderColumns = getHeaderColumns(container);
      expect(emptyColumnCount).toBe(columns.length + 1);
      expect(populatedHeaderColumns).toHaveLength(emptyColumnCount);
      expect(populatedHeaderColumns.at(-1)).toHaveStyle({ width: '15px' });
      expect(getHeaderLeafCells(container)).toHaveLength(emptyColumnCount);
    });

    it('retains measured business column widths when populated data becomes empty', async () => {
      measureWidth = 137;
      const columns = [
        { title: 'Name', dataIndex: 'name', width: 120 },
        { title: 'Age', dataIndex: 'age' },
        { title: 'Address', dataIndex: 'address', width: 160 },
      ];
      const data = [{ key: 1, name: 'Light', age: 18, address: 'Bamboo' }];
      const { container, rerender } = render(
        <Table columns={columns} data={data} scroll={{ y: 100 }} />,
      );

      await measureColumns(container);
      const populatedWidths = getColumnWidths(getHeaderColumns(container));

      rerender(<Table columns={columns} data={[]} scroll={{ y: 100 }} />);
      await safeAct();
      const emptyWidths = getColumnWidths(getHeaderColumns(container));

      expect(populatedWidths).toEqual(['137px', '137px', '137px', '15px']);
      expect(emptyWidths).toEqual(populatedWidths);
      expect(getHeaderLeafCells(container)).toHaveLength(emptyWidths.length);
    });

    it('does not append a scrollbar column when the combined scrollbar size is zero', async () => {
      visible = false;
      const columns = [
        { title: 'Name', dataIndex: 'name', width: 120 },
        { title: 'Age', dataIndex: 'age', width: 80 },
      ];
      const { container } = render(
        <Table columns={columns} data={[]} sticky scroll={{ x: 300 }} />,
      );

      await safeAct();

      expect(getHeaderColumns(container)).toHaveLength(columns.length);
      expect(getHeaderLeafCells(container)).toHaveLength(columns.length);
      expect(container.querySelector('.rc-table-header .rc-table-cell-scrollbar')).toBeFalsy();
      expect(container.querySelector('.rc-table-header table')).toHaveStyle({ minWidth: '100%' });
    });

    it('uses the same scrollbar ColGroup structure for fixed header and fixed summary', async () => {
      visible = false;
      const columns = [
        { title: 'Name', dataIndex: 'name', width: 120 },
        { title: 'Age', dataIndex: 'age', width: 80 },
      ];
      const { container } = render(
        <Table
          columns={columns}
          data={[]}
          scroll={{ y: 100 }}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>0</Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />,
      );

      await safeAct();

      const headerColumns = getHeaderColumns(container);
      const summaryColumns = Array.from(
        container.querySelectorAll('div.rc-table-summary colgroup col'),
      );
      const bodyColumns = container.querySelectorAll('.rc-table-body colgroup col');
      const summaryCells = container.querySelectorAll('div.rc-table-summary tfoot td');

      expect(headerColumns).toHaveLength(columns.length + 1);
      expect(summaryColumns).toHaveLength(headerColumns.length);
      expect(getColumnWidths(summaryColumns)).toEqual(getColumnWidths(headerColumns));
      expect(bodyColumns).toHaveLength(columns.length);
      expect(summaryCells).toHaveLength(columns.length);
      expect(summaryCells[summaryCells.length - 1]).toHaveAttribute('colspan', '2');
    });

    it('preserves the empty-data fallback for many columns without declared widths', async () => {
      visible = false;
      const columns = Array.from({ length: 12 }, (_, index) => ({
        title: `Column ${index + 1}`,
        dataIndex: `field${index + 1}`,
        key: `field${index + 1}`,
        ...(index < 2 || index === 11 ? { width: 100 } : {}),
      }));
      const { container } = render(
        <Table columns={columns} data={[]} scroll={{ x: 1200, y: 100 }} />,
      );

      await safeAct();

      const headerColumns = getHeaderColumns(container);
      const businessColumns = headerColumns.slice(0, -1);

      expect(headerColumns).toHaveLength(columns.length + 1);
      expect(getHeaderLeafCells(container)).toHaveLength(columns.length + 1);
      expect(businessColumns).toHaveLength(columns.length);
      expect(businessColumns[0]).toHaveStyle({ width: '100px' });
      expect(businessColumns[1]).toHaveStyle({ width: '100px' });
      expect(businessColumns[2].style.width).toBeFalsy();
      expect(businessColumns.at(-1)).toHaveStyle({ width: '100px' });
      expect(headerColumns.at(-1)).toHaveStyle({ width: '15px' });
    });
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
