import { render, fireEvent, createEvent } from '@testing-library/react';
import { spyElementPrototypes } from '@rc-component/util/lib/test/domHook';
import React from 'react';
import { act } from '@testing-library/react';
import Table from '../src';
import { safeAct } from './utils';

describe('Table.Sticky', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  it('Sticky Header', async () => {
    const col1 = { dataIndex: 'light', width: 100 };
    const col2 = { dataIndex: 'bamboo', width: 200 };

    const TableDemo = props => {
      return (
        <div
          style={{
            height: 10000,
          }}
        >
          <Table
            columns={[col1, col2]}
            data={[{ light: 'bamboo', bamboo: 'light', key: 1 }]}
            sticky
            {...props}
          />
        </div>
      );
    };
    const { container, rerender } = render(<TableDemo />);

    let headers = container.querySelectorAll('.rc-table-header');
    const lastHeader = headers[headers.length - 1];
    expect(lastHeader.style).toEqual(
      expect.objectContaining({
        overflow: 'hidden',
        top: '0px',
      }),
    );
    expect(lastHeader.className).toBe('rc-table-header rc-table-sticky-holder');

    await act(async () => {
      rerender(<TableDemo sticky={{ offsetHeader: 10 }} />);
      vi.runAllTimers();
    });
    headers = container.querySelectorAll('.rc-table-header');
    const updatedHeader = headers[headers.length - 1];
    expect(updatedHeader.style).toEqual(
      expect.objectContaining({
        overflow: 'hidden',
        top: '10px',
      }),
    );

    vi.useRealTimers();
  });

  it('Sticky scroll basic', async () => {
    window.pageYOffset = 900;
    document.documentElement.scrollTop = 200;
    let scrollLeft = 100;
    const domSpy = spyElementPrototypes(HTMLDivElement, {
      scrollLeft: {
        get: () => scrollLeft,
        set: left => {
          scrollLeft = left;
        },
      },
      scrollTop: {
        get: () => 100,
      },
      scrollWidth: {
        get: () => 200,
      },
      clientWidth: {
        get: () => 100,
      },
      offsetHeight: {
        get: () => 100,
      },
    });

    const col1 = { dataIndex: 'light', width: 1000 };
    const col2 = { dataIndex: 'bamboo', width: 2000 };
    const { container } = render(
      <Table
        columns={[col1, col2]}
        data={[
          { light: 'bamboo', bamboo: 'light', key: 1 },
          { light: 'bamboo', bamboo: 'light', key: 2 },
          { light: 'bamboo', bamboo: 'light', key: 3 },
          { light: 'bamboo', bamboo: 'light', key: 4 },
          { light: 'bamboo', bamboo: 'light', key: 6 },
          { light: 'bamboo', bamboo: 'light', key: 7 },
          { light: 'bamboo', bamboo: 'light', key: 8 },
          { light: 'bamboo', bamboo: 'light', key: 9 },
          { light: 'bamboo', bamboo: 'light', key: 10 },
          { light: 'bamboo', bamboo: 'light', key: 11 },
          { light: 'bamboo', bamboo: 'light', key: 12 },
          { light: 'bamboo', bamboo: 'light', key: 13 },
          { light: 'bamboo', bamboo: 'light', key: 15 },
          { light: 'bamboo', bamboo: 'light', key: 16 },
          { light: 'bamboo', bamboo: 'light', key: 17 },
          { light: 'bamboo', bamboo: 'light', key: 18 },
          { light: 'bamboo', bamboo: 'light', key: 19 },
          { light: 'bamboo', bamboo: 'light', key: 20 },
          { light: 'bamboo', bamboo: 'light', key: 21 },
          { light: 'bamboo', bamboo: 'light', key: 22 },
          { light: 'bamboo', bamboo: 'light', key: 23 },
          { light: 'bamboo', bamboo: 'light', key: 24 },
          { light: 'bamboo', bamboo: 'light', key: 25 },
          { light: 'bamboo', bamboo: 'light', key: 26 },
        ]}
        scroll={{
          x: 10000,
        }}
        sticky
      />,
    );

    await act(async () => {
      vi.runAllTimers();
      await Promise.resolve();
    });

    expect(container.querySelector('.rc-table-sticky-scroll')).not.toBeNull();

    const oldInnerHeight = global.innerHeight;
    const resizeEvent = new Event('resize');

    global.innerHeight = 10000;

    await act(async () => {
      global.dispatchEvent(resizeEvent);
      vi.runAllTimers();
      await Promise.resolve();
    });

    expect(container.querySelector('.rc-table-sticky-scroll')).toBeNull();

    await act(async () => {
      global.innerHeight = oldInnerHeight;
      global.dispatchEvent(resizeEvent);
      vi.runAllTimers();
      await Promise.resolve();
    });

    const mockFn = vi.fn();
    const scrollBar = container.querySelector('.rc-table-sticky-scroll-bar');
    const mouseDownEvent = createEvent.mouseDown(scrollBar, { pageX: 0 });
    mouseDownEvent.preventDefault = mockFn;
    fireEvent(scrollBar, mouseDownEvent);

    expect(mockFn).toHaveBeenCalled();

    expect(container.querySelector('.rc-table-sticky-scroll-bar-active')).not.toBeNull();

    const mousemoveEvent = new MouseEvent('mousemove', { bubbles: true });
    Object.defineProperty(mousemoveEvent, 'buttons', { get: () => 1, configurable: true });
    Object.defineProperty(mousemoveEvent, 'pageX', { get: () => 50, configurable: true });

    await act(async () => {
      document.body.dispatchEvent(mousemoveEvent);
      vi.runAllTimers();
      await Promise.resolve();
    });

    expect(scrollBar.style).toEqual(
      expect.objectContaining({
        width: '50px',
        transform: expect.stringContaining('translate3d(50.5px'),
      }),
    );

    await act(async () => {
      Object.defineProperty(mousemoveEvent, 'pageX', { get: () => -50, configurable: true });
      document.body.dispatchEvent(mousemoveEvent);
      vi.runAllTimers();
      await Promise.resolve();
    });

    expect(scrollBar.style).toEqual(
      expect.objectContaining({
        width: '50px',
        transform: expect.stringContaining('translate3d(0px'),
      }),
    );

    await act(async () => {
      Object.defineProperty(mousemoveEvent, 'buttons', { get: () => 0 });
      document.body.dispatchEvent(mousemoveEvent);
      vi.runAllTimers();
      await Promise.resolve();
    });

    expect(container.querySelector('.rc-table-sticky-scroll-bar-active')).toBeNull();

    const mouseupEvent = new MouseEvent('mouseup', { bubbles: true });

    document.body.dispatchEvent(mouseupEvent);

    vi.useRealTimers();
    domSpy.mockRestore();
  });

  it('Sticky Header with border classname', async () => {
    const TableDemo = props => {
      return (
        <div
          style={{
            height: 10000,
          }}
        >
          <Table
            columns={[
              { title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
              { title: 'title2', dataIndex: 'b', key: 'b' },
              { title: 'title3', dataIndex: 'c', key: 'c' },
              { title: 'title4', dataIndex: 'd', key: 'd', width: 100, fixed: 'right' },
            ]}
            data={[
              { a: '123', b: 'xxxxxxxx', c: 3, d: 'hehe', key: '1' },
              { a: 'cdd', b: 'edd12221', c: 3, d: 'haha', key: '2' },
            ]}
            sticky
            scroll={{
              x: 10000,
            }}
            {...props}
          />
        </div>
      );
    };
    const { container } = render(<TableDemo />);
    await act(async () => {
      vi.runAllTimers();
    });
    const fixedCell = container.querySelector('.rc-table-cell-fix-end.rc-table-cell-fix-sticky');
    expect(fixedCell).toHaveStyle({
      'inset-inline-end': '0',
    });
    expect(container.querySelector('.rc-table-cell-fix-sticky')).not.toBeNull();

    vi.useRealTimers();
  });

  it('Sticky Header with scroll-y', async () => {
    const TableDemo = props => {
      return (
        <div
          style={{
            height: 10000,
          }}
        >
          <Table
            columns={[
              { title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
              { title: 'title2', dataIndex: 'b', key: 'b' },
              { title: 'title3', dataIndex: 'c', key: 'c' },
              { title: 'title4', dataIndex: 'd', key: 'd', width: 100, fixed: 'right' },
            ]}
            data={[
              { a: '123', b: 'xxxxxxxx', c: 3, d: 'hehe', key: '1' },
              { a: 'cdd', b: 'edd12221', c: 3, d: 'haha', key: '2' },
            ]}
            sticky
            scroll={{
              x: 10000,
              y: 10,
            }}
            {...props}
          />
        </div>
      );
    };
    const { container } = render(<TableDemo />);
    await act(async () => {
      vi.runAllTimers();
    });
    const fixedCell = container.querySelector('.rc-table-cell-fix-end.rc-table-cell-fix-sticky');
    expect(fixedCell).toHaveStyle({
      'inset-inline-end': '15px',
    });

    vi.useRealTimers();
  });

  it('Sticky scroll with getContainer', async () => {
    window.pageYOffset = 900;
    document.documentElement.scrollTop = 200;
    const containerEl = document.createElement('ol');
    containerEl.style = 'height: 500px;overflow: scroll';
    document.body.appendChild(containerEl);
    let scrollLeft = 100;
    const domSpy = spyElementPrototypes(HTMLDivElement, {
      scrollLeft: {
        get: () => scrollLeft,
        set: left => {
          scrollLeft = left;
        },
      },
      scrollTop: {
        get: () => 100,
      },
      scrollWidth: {
        get: () => 200,
      },
      clientWidth: {
        get: () => 100,
      },
      offsetHeight: {
        get: () => 1000,
      },
    });

    const sectionSpy = spyElementPrototypes(HTMLOListElement, {
      scrollLeft: {
        get: () => scrollLeft,
        set: left => {
          scrollLeft = left;
        },
      },
      scrollTop: {
        get: () => 100,
      },
      scrollWidth: {
        get: () => 200,
      },
      clientWidth: {
        get: () => 100,
      },
      clientHeight: {
        get: () => 500,
      },
      offsetHeight: {
        get: () => 100,
      },
    });

    const col1 = { dataIndex: 'light', width: 1000 };
    const col2 = { dataIndex: 'bamboo', width: 2000 };
    const renderResult = render(
      <Table
        columns={[col1, col2]}
        data={[
          { light: 'bamboo', bamboo: 'light', key: 1 },
          { light: 'bamboo', bamboo: 'light', key: 2 },
          { light: 'bamboo', bamboo: 'light', key: 3 },
          { light: 'bamboo', bamboo: 'light', key: 4 },
          { light: 'bamboo', bamboo: 'light', key: 6 },
          { light: 'bamboo', bamboo: 'light', key: 7 },
          { light: 'bamboo', bamboo: 'light', key: 8 },
          { light: 'bamboo', bamboo: 'light', key: 9 },
          { light: 'bamboo', bamboo: 'light', key: 10 },
          { light: 'bamboo', bamboo: 'light', key: 11 },
          { light: 'bamboo', bamboo: 'light', key: 12 },
          { light: 'bamboo', bamboo: 'light', key: 13 },
          { light: 'bamboo', bamboo: 'light', key: 15 },
          { light: 'bamboo', bamboo: 'light', key: 16 },
          { light: 'bamboo', bamboo: 'light', key: 17 },
          { light: 'bamboo', bamboo: 'light', key: 18 },
          { light: 'bamboo', bamboo: 'light', key: 19 },
          { light: 'bamboo', bamboo: 'light', key: 20 },
          { light: 'bamboo', bamboo: 'light', key: 21 },
          { light: 'bamboo', bamboo: 'light', key: 22 },
          { light: 'bamboo', bamboo: 'light', key: 23 },
          { light: 'bamboo', bamboo: 'light', key: 24 },
          { light: 'bamboo', bamboo: 'light', key: 25 },
          { light: 'bamboo', bamboo: 'light', key: 26 },
        ]}
        scroll={{
          x: 10000,
        }}
        sticky={{
          getContainer: () => containerEl,
        }}
      />,
      {
        container: containerEl,
      },
    );

    await act(async () => {
      vi.runAllTimers();
    });

    expect(containerEl.querySelector('.rc-table-sticky-scroll')).toBeTruthy();
    expect(containerEl.querySelector('.rc-table-sticky-scroll-bar')).toBeTruthy();
    const scrollBar = containerEl.querySelector('.rc-table-sticky-scroll-bar');
    expect(scrollBar).toHaveStyle({
      width: '50px',
      // Safe to be any value, just check if it contains `translate3d`
      transform: 'translate3d(50px, 0, 0)',
    });

    const preventDefaultFn = vi.fn();
    const mouseDownEvent = createEvent.mouseDown(scrollBar, { pageX: 0 });
    mouseDownEvent.preventDefault = preventDefaultFn;
    fireEvent(scrollBar, mouseDownEvent);
    expect(preventDefaultFn).toHaveBeenCalled();

    const mousemoveEvent = new MouseEvent('mousemove', { bubbles: true });
    Object.defineProperty(mousemoveEvent, 'buttons', { get: () => 1 });
    Object.defineProperty(mousemoveEvent, 'pageX', { get: () => 50 });
    await act(async () => {
      document.body.dispatchEvent(mousemoveEvent);
      vi.runAllTimers();
    });
    expect(scrollBar.style).toEqual(
      expect.objectContaining({
        width: '50px',
        transform: expect.stringContaining('translate3d(50.5px'),
      }),
    );

    renderResult.unmount();
    window.pageYOffset = 0;
    domSpy.mockRestore();
    sectionSpy.mockRestore();
    vi.useRealTimers();
  });
});
