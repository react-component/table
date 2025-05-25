import React from 'react';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import { render } from '@testing-library/react';
import { safeAct } from './utils';
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

  afterAll(() => {
    domSpy.mockRestore();
  });
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
    const wrapper = render(
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
    await safeAct(wrapper);

    const expandDom = wrapper.container.querySelector('.rc-table-expanded-row-fixed');
    console.log('expandDom', expandDom);
    const trDom = expandDom.parentElement;
    expect(trDom.getAttribute('colspan')).toBe('2');
  });
});
