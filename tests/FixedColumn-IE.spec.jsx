import { render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import RcResizeObserver from 'rc-resize-observer';
import Table from '../src';

vi.mock('rc-util/lib/Dom/styleChecker', () => {
  return {
    isStyleSupport: (name, val) => val !== 'sticky',
  };
});

describe('Table.FixedColumn', () => {
  let domSpy;

  beforeAll(() => {
    domSpy = spyElementPrototype(HTMLElement, 'offsetParent', {
      get: () => ({}),
    });
  });

  afterAll(() => {
    domSpy.mockRestore();
  });

  const columns = [
    { title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
    { title: 'title2', dataIndex: 'b', key: 'b', width: 100, fixed: 'left' },
    { title: 'title3', dataIndex: 'c', key: 'c' },
    { title: 'title4', dataIndex: 'b', key: 'd' },
    { title: 'title5', dataIndex: 'b', key: 'e' },
    { title: 'title6', dataIndex: 'b', key: 'f' },
    { title: 'title7', dataIndex: 'b', key: 'g' },
    { title: 'title8', dataIndex: 'b', key: 'h' },
    { title: 'title9', dataIndex: 'b', key: 'i' },
    { title: 'title10', dataIndex: 'b', key: 'j' },
    { title: 'title11', dataIndex: 'b', key: 'k' },
    { title: 'title12', dataIndex: 'b', key: 'l', width: 100, fixed: 'right' },
  ];
  const data = [{ a: '123', b: 'xxxxxxxx', d: 3, key: '1' }];

  it('not sticky', async () => {
    vi.useFakeTimers();
    const { container } = render(<Table columns={columns} data={data} scroll={{ x: 1200 }} />);

    act(() => {
      container
        .querySelector(RcResizeObserver.Collection)
        .first()
        .props()
        .onBatchResize([
          {
            data: container.querySelector('table ResizeObserver').first().props().data,
            size: { width: 93, offsetWidth: 93 },
          },
        ]);
    });

    await act(async () => {
      vi.runAllTimers();
      await Promise.resolve();
    });

    expect(container.querySelector('.rc-table-cell-fix-left')).toBeFalsy();
    expect(container.querySelector('.rc-table-cell-fix-right')).toBeFalsy();
  });
});
