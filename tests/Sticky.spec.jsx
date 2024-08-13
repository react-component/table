import { render, screen, fireEvent } from '@testing-library/react';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import React from 'react';
import { act } from 'react-dom/test-utils';
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

    expect(container.querySelector('.rc-table-header').style).toEqual({
      overflow: 'hidden',
      top: '0px',
    });

    expect(container.querySelector('.rc-table-header').className).toBe(
      'rc-table-header rc-table-sticky-holder',
    );

    await safeAct(() => {
      rerender(
        <TableDemo
          sticky={{
            offsetHeader: 10,
          }}
        />,
      );
    });

    expect(container.querySelector('.rc-table-header').style).toEqual({
      overflow: 'hidden',
      top: '10px',
    });

    vi.useRealTimers();
  });

  it('Sticky scroll', async () => {
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

    expect(container.querySelector('.rc-table-sticky-scroll')).not.toBeUndefined();

    const oldInnerHeight = global.innerHeight;
    const resizeEvent = new Event('resize');

    global.innerHeight = 10000;

    await act(async () => {
      global.dispatchEvent(resizeEvent);
      vi.runAllTimers();
      await Promise.resolve();
    });

    expect(container.querySelector('.rc-table-sticky-scroll')).toBeFalsy();

    await act(async () => {
      global.innerHeight = oldInnerHeight;
      global.dispatchEvent(resizeEvent);
      vi.runAllTimers();
      await Promise.resolve();
    });

    const mockFn = vi.fn();

    fireEvent.mouseDown(container.querySelector('.rc-table-sticky-scroll-bar'), {
      persist: mockFn,
      preventDefault: mockFn,
      pageX: 0,
    });

    expect(mockFn).toHaveBeenCalledTimes(2);

    expect(container.querySelector('.rc-table-sticky-scroll-bar-active')).toBeTruthy();

    const mousemoveEvent = new Event('mousemove');

    mousemoveEvent.buttons = 1;
    mousemoveEvent.pageX = 50;

    await act(async () => {
      document.body.dispatchEvent(mousemoveEvent);
      vi.runAllTimers();
      await Promise.resolve();
    });

    expect(container.querySelector('.rc-table-sticky-scroll-bar').style).toEqual({
      width: '50px',
      transform: 'translate3d(50.5px, 0, 0)',
    });

    await act(async () => {
      mousemoveEvent.pageX = -50;
      document.body.dispatchEvent(mousemoveEvent);

      vi.runAllTimers();
      await Promise.resolve();
    });

    expect(container.querySelector('.rc-table-sticky-scroll-bar').style).toEqual({
      width: '50px',
      transform: 'translate3d(0px, 0, 0)',
    });

    await act(async () => {
      mousemoveEvent.buttons = 0;
      document.body.dispatchEvent(mousemoveEvent);

      vi.runAllTimers();
      await Promise.resolve();
    });

    expect(container.querySelector('.rc-table-sticky-scroll-bar-active')).toBeFalsy();

    const mouseupEvent = new Event('mouseup');

    document.body.dispatchEvent(mouseupEvent);

    window.pageYOffset = 0;
    mockFn.mockRestore();
    domSpy.mockRestore();
    vi.useRealTimers();
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
              { a: '123', b: 'xxxxxxxx', d: 3, key: '1' },
              { a: 'cdd', b: 'edd12221', d: 3, key: '2' },
              { a: '133', c: 'edd12221', d: 2, key: '3' },
              { a: '133', c: 'edd12221', d: 2, key: '4' },
              { a: '133', c: 'edd12221', d: 2, key: '5' },
              { a: '133', c: 'edd12221', d: 2, key: '6' },
              { a: '133', c: 'edd12221', d: 2, key: '7' },
              { a: '133', c: 'edd12221', d: 2, key: '8' },
              { a: '133', c: 'edd12221', d: 2, key: '9' },
            ]}
            scroll={{
              x: 1000,
            }}
            sticky
            {...props}
          />
        </div>
      );
    };
    const { container, rerender } = render(<TableDemo />);

    expect(container.querySelector('.rc-table-header').style).toEqual({
      overflow: 'hidden',
      top: '0px',
    });

    expect(container.querySelector('.rc-table-header').className).toBe(
      'rc-table-header rc-table-sticky-holder',
    );

    await safeAct(() => {
      rerender(
        <TableDemo
          sticky={{
            offsetHeader: 10,
          }}
        />,
      );
    });

    expect(container.querySelector('.rc-table-header').style).toEqual({
      overflow: 'hidden',
      top: '10px',
    });

    vi.useRealTimers();
  });
});
