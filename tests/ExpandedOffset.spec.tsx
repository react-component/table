import React from 'react';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import { render, act } from '@testing-library/react';
import { _rs } from '@rc-component/resize-observer';
import Table, { type ColumnsType } from '../src';

async function triggerResize(ele: HTMLElement) {
  await act(async () => {
    _rs([{ target: ele }] as any);
    await Promise.resolve();
  });
}

describe('Table.ExpandedOffset', () => {
  let domSpy: ReturnType<typeof spyElementPrototypes>;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  beforeAll(() => {
    domSpy = spyElementPrototypes(HTMLElement, {
      offsetParent: {
        get: () => ({}),
      },
      offsetWidth: {
        get: () => 50,
      },
    });
  });

  afterAll(() => {
    domSpy.mockRestore();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('expanded + sticky', async () => {
    const columns: ColumnsType = [
      {
        title: 'a',
        // `fixed` will auto patch to fill the space
        // fixed: 'left',
      },
      Table.EXPAND_COLUMN,
      { title: 'b' },
      { title: 'c' },
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

    await triggerResize(container.querySelector<HTMLElement>('.rc-table'));

    act(() => {
      const coll = container.querySelector('.rc-table-resize-collection');
      if (coll) {
        triggerResize(coll as HTMLElement);
      }
    });

    await act(async () => {
      vi.runAllTimers();
      await Promise.resolve();
    });

    expect(container.querySelector('.rc-table-expanded-row .rc-table-cell')).toHaveAttribute(
      'colspan',
      '3',
    );
    expect(container.querySelector('.rc-table-expanded-row .rc-table-cell div')).toHaveStyle({
      position: 'sticky',
      left: '50px',
    });
  });
});
