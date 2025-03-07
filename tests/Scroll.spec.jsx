import { render, fireEvent } from '@testing-library/react';
import { spyElementPrototypes } from '@rc-component/util/lib/test/domHook';
import React from 'react';
import { act } from '@testing-library/react';
import Table from '../src';

describe('Table.Scroll', () => {
  const data = [
    { key: 'key0', name: 'Lucy' },
    { key: 'key1', name: 'Jack' },
  ];
  const createTable = props => {
    const columns = [{ title: 'Name', dataIndex: 'name', key: 'name' }];

    return <Table columns={columns} data={data} {...props} />;
  };

  it('should always has content when scroll.x is enabled', () => {
    const data = [];
    const createTable = props => {
      return <Table data={data} {...props} />;
    };

    const { container } = render(createTable({ scroll: { x: true } }));

    expect(container.querySelector('.rc-table-tbody').textContent).toContain('No Data');
  });

  it('renders scroll.x is true', () => {
    const { container } = render(createTable({ scroll: { x: true } }));
    const table = container.querySelector('table');
    const content = container.querySelector('.rc-table-content');
    expect(table.style.width).toEqual('auto');
    expect(content.style.overflowX).toEqual('auto');
    expect(content.style.overflowY).toEqual('hidden');
  });

  it('renders scroll.x is a number', () => {
    const { container } = render(createTable({ scroll: { x: 200 } }));
    const table = container.querySelector('table');
    expect(table.style.width).toEqual('200px');
  });

  it('renders scroll.y is a number', () => {
    const { container } = render(createTable({ scroll: { y: 200 } }));
    const body = container.querySelector('.rc-table-body');
    expect(body.style.maxHeight).toEqual('200px');
  });

  it('renders scroll.x and scroll.y are both true', () => {
    const { container } = render(createTable({ scroll: { x: true, y: 200 } }));
    const body = container.querySelector('.rc-table-body');
    expect(body.style.overflowX).toEqual('auto');
    expect(body.style.overflowY).toEqual('scroll');
  });

  it('fire scroll event', () => {
    vi.useFakeTimers();
    let scrollLeft = 0;
    let scrollTop = 0;

    const setScrollLeft = vi.fn((_, val) => {
      scrollLeft = val;
    });
    const setScrollTop = vi.fn((_, val) => {
      scrollTop = val;
    });

    const domSpy = spyElementPrototypes(HTMLDivElement, {
      scrollLeft: {
        get: () => scrollLeft,
        set: setScrollLeft,
      },
      scrollTop: {
        get: () => scrollTop,
        set: setScrollTop,
      },
      scrollWidth: {
        get: () => 200,
      },
      clientWidth: {
        get: () => 100,
      },
    });

    const newColumns = [
      { title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
      { title: 'title2', dataIndex: 'b', key: 'b' },
      { title: 'title3', dataIndex: 'c', key: 'c' },
      { title: 'title4', dataIndex: 'd', key: 'd', width: 100, fixed: 'right' },
    ];
    const newData = [
      { a: '123', b: 'xxxxxxxx', c: 3, d: 'hehe', key: '1' },
      { a: 'cdd', b: 'edd12221', c: 3, d: 'haha', key: '2' },
    ];
    const { container } = render(
      <Table
        columns={newColumns}
        data={newData}
        scroll={{
          x: 200,
          y: 200,
        }}
      />,
    );

    act(() => {
      vi.runAllTimers();
    });

    // Use `onScroll` directly since simulate not support `currentTarget`
    act(() => {
      const headerDiv = container.querySelector('div.rc-table-header');

      const wheelEvent = new WheelEvent('wheel');
      Object.defineProperty(wheelEvent, 'deltaX', {
        get: () => 10,
      });

      headerDiv.dispatchEvent(wheelEvent);
      vi.runAllTimers();
    });

    expect(setScrollLeft).toHaveBeenCalledWith(undefined, 10);
    setScrollLeft.mockReset();

    act(() => {
      const body = container.querySelector('.rc-table-body');

      Object.defineProperty(body, 'scrollLeft', {
        get: () => 33,
      });
      Object.defineProperty(body, 'scrollWidth', {
        get: () => 200,
      });
      Object.defineProperty(body, 'clientWidth', {
        get: () => 100,
      });

      fireEvent.scroll(body);
    });

    act(() => {
      vi.runAllTimers();
    });

    expect(setScrollLeft).toHaveBeenCalledWith(undefined, 33);
    setScrollLeft.mockReset();

    domSpy.mockRestore();
    vi.useRealTimers();
  });

  it('trigger inner scrollTo when set `top` 0 after render', () => {
    let isTriggerScroll = false;
    spyElementPrototypes(HTMLElement, {
      scrollTo: _ => {
        isTriggerScroll = true;
      },
    });

    const tRef = React.createRef();

    const { container } = render(createTable({ ref: tRef }));

    tRef.current.scrollTo({
      top: 0,
    });
    expect(isTriggerScroll).toEqual(true);
  });
});
