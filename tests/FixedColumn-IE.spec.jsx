import React from 'react';
import { render, act } from '@testing-library/react';
import Table from '../src';
// 保留 spyElementPrototype 的相关逻辑
import { spyElementPrototype } from '@rc-component/util/lib/test/domHook';
import RcResizeObserver from '@rc-component/resize-observer';

vi.mock('@rc-component/util/lib/Dom/styleChecker', () => {
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
    // 使用 render 替代 enzyme 的 mount
    const { container } = render(<Table columns={columns} data={data} scroll={{ x: 1200 }} />);

    // 模拟时间流逝，触发 Table 内部的更新逻辑
    await act(async () => {
      vi.runAllTimers();
      await Promise.resolve();
    });

    expect(container.querySelector('.rc-table-cell-fix-left')).toBeNull();
    expect(container.querySelector('.rc-table-cell-fix-right')).toBeNull();
  });
});
