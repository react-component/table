import React from 'react';
import { render, act } from '@testing-library/react';
import Table, { type ColumnsType } from '../src';

describe('Table.Expanded', () => {
  it('expanded + sticky', async () => {
    const columns: ColumnsType = [
      {
        title: '手机号',
        dataIndex: 'a',
        width: 100,
        fixed: 'left',
        onCell: (_, index) => {
          const props: React.TdHTMLAttributes<HTMLTableCellElement> = {};
          if (index === 0) props.rowSpan = 2;
          return props;
        },
      },
      Table.EXPAND_COLUMN,
      { title: 'b', dataIndex: 'b' },
      { title: 'c', dataIndex: 'c' },
    ];
    const data = [{ a: 'a' }];
    const { container } = render(
      <Table<Record<string, any>>
        columns={columns}
        data={data}
        sticky
        expandable={{
          defaultExpandAllRows: true,
          expandedRowRender: record => <div>{record.key}</div>,
        }}
      />,
    );
    console.log('container', container);
    await act(async () => {
      vi.runAllTimers();
      await Promise.resolve();
    });

    const expandDom = container.querySelector('.rc-table-expanded-row-fixed');
    const trDom = expandDom.parentElement;
    expect(trDom.getAttribute('colspan')).toBe('2');
  });
});
