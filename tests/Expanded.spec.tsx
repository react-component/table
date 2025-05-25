import React from 'react';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import { render, act } from '@testing-library/react';
import Table, { type ColumnsType } from '../src';

describe('Table.Expanded', () => {
  let domSpy;
  beforeEach(() => {
    vi.useFakeTimers();
  });
  beforeAll(() => {
    domSpy = spyElementPrototypes(HTMLElement, {
      offsetParent: {
        get: () => ({}),
      },
      offsetWidth: {
        get: () => 1000,
      },
    });
  });

  async function waitFakeTimer() {
    for (let i = 0; i < 10; i += 1) {
      // eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-loop-func
      await act(async () => {
        vi.advanceTimersByTime(100);
        await Promise.resolve();
      });
    }
  }

  afterAll(() => {
    domSpy.mockRestore();
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
        scroll={{ x: 600 }}
        expandable={{
          expandedRowOffset: 1,
          defaultExpandAllRows: true,
          expandedRowRender: record => <div className="expand-dom">11122233{record.key}</div>,
        }}
      />,
    );
    console.log('container', container);
    await act(async () => {
      vi.runAllTimers();
      await Promise.resolve();
    });

    await waitFakeTimer();
    await waitFakeTimer();
    await waitFakeTimer();

    const expandDom = container.querySelector('.expand-dom');
    console.log('expandDom', expandDom);
    const trDom = expandDom.parentElement;
    expect(trDom.getAttribute('colspan')).toBe('3');
  });
});
