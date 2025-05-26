import React from 'react';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import { render, act } from '@testing-library/react';
import Table, { type ColumnsType } from '../src';

describe('Table.Expanded', () => {
  // let domSpy;
  // beforeEach(() => {
  //   vi.useFakeTimers();
  // });
  // beforeAll(() => {
  //   domSpy = spyElementPrototypes(HTMLElement, {
  //     offsetParent: {
  //       get: () => ({}),
  //     },
  //     offsetWidth: {
  //       get: () => 1000,
  //     },
  //   });
  // });

  // afterAll(() => {
  //   domSpy.mockRestore();
  // });

  const setScrollLeft = vi.fn();

  beforeAll(() => {
    spyElementPrototypes(HTMLElement, {
      getBoundingClientRect: () => ({
        width: 50,
      }),
      scrollLeft: {
        get: () => {
          return 100;
        },
        set: setScrollLeft as any,
      },
      clientWidth: {
        get: () => 80,
      },
      scrollWidth: {
        get: () => 100,
      },
    });
  });

  beforeEach(() => {
    setScrollLeft.mockReset();
    global.scrollToConfig = null;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('expanded + sticky', async () => {
    const columns: ColumnsType = [
      {
        title: 'key',
        dataIndex: 'key',
        width: 100,
        fixed: 'left',
        onCell: (_, index) => {
          const props: React.TdHTMLAttributes<HTMLTableCellElement> = {};
          if (index === 0) props.rowSpan = 2;
          return props;
        },
      },
      Table.EXPAND_COLUMN,
      { title: 'a', dataIndex: 'a' },
      { title: 'b', dataIndex: 'b' },
    ];
    const data = [{ key: 'a' }];
    const { container } = render(
      <Table<Record<string, any>>
        columns={columns}
        data={data}
        sticky
        scroll={{ x: 1200 }}
        expandable={{
          expandedRowOffset: 1,
          defaultExpandAllRows: true,
          expandedRowRender: record => <div>{record.key}</div>,
        }}
      />,
    );
    await act(async () => {
      vi.runAllTimers();
      await Promise.resolve();
    });

    const expandDom = container.querySelector('.rc-table-expanded-row-fixed') as HTMLDivElement;

    expect(expandDom.parentElement.getAttribute('colspan')).toBe('3');
    expect(expandDom.style.width).toBe('-100px');
  });
});
