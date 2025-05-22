import React from 'react';
import { render, act } from '@testing-library/react';
import Table, { type ColumnsType } from '../src';
import { spyElementPrototypes } from '@rc-component/util/lib/test/domHook';

describe('Table.Expanded', () => {
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
        get: () => 1000,
      },
    });
  });

  afterAll(() => {
    domSpy.mockRestore();
  });

  const columns: ColumnsType = [
    {
      title: 'key',
      dataIndex: 'key',
      width: 100,
      onCell: (_, index) => {
        const props: React.TdHTMLAttributes<HTMLTableCellElement> = {};
        if (index === 0) props.rowSpan = 1;
        if (index === 1) props.rowSpan = 2;
        if (index === 2) props.rowSpan = 0;
        if (index === 3) props.rowSpan = undefined;
        return props;
      },
    },
    Table.EXPAND_COLUMN,
    { title: 'key2', dataIndex: 'key2', width: 100 },
  ];
  const data = [{ key: 'a' }, { key: 'b' }, { key: 'c' }, { key: 'd' }];

  it('expanded + rowSpan', async () => {
    const { container } = render(
      <Table<Record<string, any>>
        columns={columns}
        data={data}
        expandable={{
          defaultExpandAllRows: true,
          expandedRowRender: record => <div>{record.key}</div>,
        }}
      />,
    );

    await act(async () => {
      vi.runAllTimers();
      await Promise.resolve();
    });
    const trList = container.querySelector('tbody').querySelectorAll('tr');
    // row 1
    expect(trList[0].querySelectorAll('td').length).toBe(3);
    expect(trList[0].querySelectorAll('td')[0].getAttribute('rowspan')).toBe('2');
    // expand 1
    expect(trList[1].querySelectorAll('td').length).toBe(1);
    expect(trList[1].querySelectorAll('td')[0].getAttribute('colspan')).toBe('2');
    // row 2
    expect(trList[2].querySelectorAll('td').length).toBe(3);
    expect(trList[2].querySelectorAll('td')[0].getAttribute('rowspan')).toBe('4');
    // expand 2
    expect(trList[3].querySelectorAll('td').length).toBe(1);
    expect(trList[3].querySelectorAll('td')[0].getAttribute('colspan')).toBe('2');
    // row 3
    expect(trList[4].querySelectorAll('td').length).toBe(2);
    // expand 3
    expect(trList[5].querySelectorAll('td').length).toBe(1);
    expect(trList[5].querySelectorAll('td')[0].getAttribute('colspan')).toBe('2');
    // row 4
    expect(trList[6].querySelectorAll('td').length).toBe(3);
    // expand 4
    expect(trList[7].querySelectorAll('td').length).toBe(1);
    expect(trList[7].querySelectorAll('td')[0].getAttribute('colspan')).toBe('3');
  });
});
