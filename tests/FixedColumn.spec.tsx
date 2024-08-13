import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import RcResizeObserver, { _rs } from 'rc-resize-observer';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import Table, { type ColumnsType } from '../src';
import { safeAct } from './utils';
import { RowColSpanWithFixed, RowColSpanWithFixed2 } from './__mocks__/shadowTest';

function triggerResize(ele: HTMLElement) {
  _rs([{ target: ele }] as any);
}

describe('Table.FixedColumn', () => {
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

  const columns: ColumnsType = [
    { title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
    {
      title: 'title2',
      dataIndex: 'b',
      key: 'b',
      width: 100,
      fixed: 'left',
      ellipsis: true,
      render: () => <span>1111</span>,
    },
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
  const data = [
    { a: '123', b: 'xxxxxxxx', d: 3, key: '1' },
    { a: 'cdd', b: 'edd12221', d: 3, key: '2' },
    { a: '133', c: 'edd12221', d: 2, key: '3' },
    { a: '133', c: 'edd12221', d: 2, key: '4' },
    { a: '133', c: 'edd12221', d: 2, key: '5' },
    { a: '133', c: 'edd12221', d: 2, key: '6' },
    { a: '133', c: 'edd12221', d: 2, key: '7' },
    { a: '133', c: 'edd12221', d: 2, key: '8' },
    { a: '133', c: 'edd12221', d: 2, key: '9' },
  ];

  describe('renders correctly', () => {
    [
      { scrollName: 'scrollX', scroll: { x: 1200 } },
      { scrollName: 'scrollXY', scroll: { x: 1200, y: 100 } },
    ].forEach(({ scrollName, scroll }) => {
      [
        { name: 'with data', data },
        { name: 'without data', data: [] },
      ].forEach(({ name, data: testData }) => {
        it(`${scrollName} - ${name}`, async () => {
          vi.useFakeTimers();
          const { container } = render(<Table columns={columns} data={testData} scroll={scroll} />);

          act(() => {
            // fireEvent.resize(container.querySelector(RcResizeObserver)!, { width: 100 });
            triggerResize(container.querySelector('table')!);
          });

          act(() => {
            // fireEvent.resize(container.querySelector(RcResizeObserver.Collection)!, {
            //   data: container.querySelector('table ResizeObserver')!.data,
            //   size: { width: 93, offsetWidth: 93 },
            // } as any);
            triggerResize(container.querySelector('table')!);
          });
          await safeAct(container);
          expect(container).toMatchSnapshot();
          vi.useRealTimers();
        });
      });
    });

    it('all column has width should use it', async () => {
      const { container } = render(
        <Table
          columns={[
            { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
            { title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
          ]}
          data={[]}
          scroll={{ x: 'max-content' }}
        />,
      );

      await safeAct(container);

      expect(container.querySelector('colgroup')).toMatchSnapshot();
    });
  });

  it('has correct scroll classNames when table resize', async () => {
    const { container } = render(
      <Table columns={columns} data={data} scroll={{ x: true }} style={{ width: 2000 }} />,
    );

    await safeAct(container);
    // Use `onScroll` directly since simulate not support `currentTarget`
    act(() => {
      fireEvent.scroll(container.querySelector('.rc-table-content')!, {
        currentTarget: {
          scrollLeft: 10,
          scrollWidth: 200,
          clientWidth: 100,
        },
      } as any);
    });
    expect(
      container.querySelector('.rc-table').classList.contains('rc-table-ping-left'),
    ).toBeTruthy();
    expect(
      container.querySelector('.rc-table').classList.contains('rc-table-ping-right'),
    ).toBeTruthy();

    // Left
    act(() => {
      fireEvent.scroll(container.querySelector('.rc-table-content')!, {
        currentTarget: {
          scrollLeft: 0,
          scrollWidth: 200,
          clientWidth: 100,
        },
      } as any);
    });
    expect(
      container.querySelector('.rc-table').classList.contains('rc-table-ping-left'),
    ).toBeFalsy();
    expect(
      container.querySelector('.rc-table').classList.contains('rc-table-ping-right'),
    ).toBeTruthy();

    // Right
    act(() => {
      fireEvent.scroll(container.querySelector('.rc-table-content')!, {
        currentTarget: {
          scrollLeft: 100,
          scrollWidth: 200,
          clientWidth: 100,
        },
      } as any);
    });
    expect(
      container.querySelector('.rc-table').classList.contains('rc-table-ping-left'),
    ).toBeTruthy();
    expect(
      container.querySelector('.rc-table').classList.contains('rc-table-ping-right'),
    ).toBeFalsy();

    // Fullscreen
    act(() => {
      fireEvent.scroll(container.querySelector('.rc-table-content')!, {
        currentTarget: {
          scrollLeft: 0,
          scrollWidth: 100,
          clientWidth: 100,
        },
      } as any);
    });
    expect(
      container.querySelector('.rc-table').classList.contains('rc-table-ping-left'),
    ).toBeFalsy();
    expect(
      container.querySelector('.rc-table').classList.contains('rc-table-ping-right'),
    ).toBeFalsy();
  });

  it('ellipsis will wrap additional dom', () => {
    const myColumns = [{ ...columns[0], ellipsis: true }];
    const { container } = render(<Table columns={myColumns} data={data} />);

    expect(container.querySelector('tr th').querySelector('.rc-table-cell-content')).toBeTruthy();
    expect(container.querySelectorAll('tr td .rc-table-cell-content')).toHaveLength(data.length);
  });

  it('fixed column renders correctly RTL', async () => {
    const { container } = render(
      <Table columns={columns} data={data} direction="rtl" scroll={{ x: 1 }} />,
    );
    expect(container).toMatchSnapshot();
    await safeAct(container);
  });

  it('has correct scroll classNames when table direction is RTL', () => {
    const { container } = render(<Table columns={columns} data={data} direction="rtl" />);

    expect(container.querySelector('.rc-table').classList.contains('rc-table-rtl')).toBeTruthy();

    // Left should be right in RTL
    expect(
      container
        .querySelector('.rc-table-row')
        .querySelector('.rc-table-cell')
        .classList.contains('rc-table-cell-fix-right'),
    ).toBeTruthy();

    // Right should be left in RTL
    expect(
      container
        .querySelector('.rc-table-row')
        .querySelectorAll('.rc-table-cell')
        .item(-1)
        .classList.contains('rc-table-cell-fix-left'),
    ).toBeTruthy();
  });

  it('not break measure count', async () => {
    const { container, rerender } = render(
      <Table columns={columns.slice(0, 5)} data={data} scroll={{ x: 1000 }} />,
    );
    await safeAct(container);
    expect(container.querySelectorAll('.rc-table-measure-row td')).toHaveLength(5);

    rerender(<Table columns={columns.slice(0, 4)} data={data} />);
    expect(container.querySelectorAll('.rc-table-measure-row td')).toHaveLength(4);
  });

  it('when all columns fixed left,cell should has classname rc-table-cell-fix-left-all', async () => {
    const { container } = render(
      <Table columns={columns.slice(0, 2)} data={data} scroll={{ x: 1000 }} />,
    );
    await safeAct(container);
    expect(container.querySelectorAll('.rc-table-cell-fix-left-all')).toHaveLength(10);
  });

  describe('cross fixed support', () => {
    it('left', async () => {
      const { container } = render(
        <Table
          columns={[{}, { fixed: 'left' }, { fixed: 'left' }]}
          data={[{}]}
          scroll={{ x: 200 }}
        />,
      );

      act(() => {
        Array.from(container.querySelectorAll<HTMLElement>('.rc-table-measure-row td')).forEach(
          td => {
            triggerResize(td);
          },
        );
      });

      await act(async () => {
        vi.runAllTimers();
        await Promise.resolve();
      });

      expect(container.querySelectorAll('tbody .rc-table-cell-fix-left')).toHaveLength(2);
      expect(container.querySelectorAll('thead th')[1]).toHaveStyle({
        left: '0px',
      });
      expect(container.querySelectorAll('thead th')[2]).toHaveStyle({
        left: '1000px',
      });
    });
  });
  describe('components.table by sticky', () => {
    it('render', async () => {
      const table = props => {
        return (
          <>
            <div className="healer-table">header table</div>
            <table className={props.className}>{props.children}</table>
          </>
        );
      };
      const { container } = render(<Table sticky components={{ header: { table } }} />);
      expect(container.querySelector('.healer-table')).toBeTruthy();
    });
  });
  it('shadow should display correctly', async () => {
    const { container, rerender } = render(<RowColSpanWithFixed />);
    expect(container.querySelectorAll('.rc-table-cell-fix-left-last').length).toBe(104);
    expect(container.querySelectorAll('.rc-table-cell-fix-right-first').length).toBe(101);
    expect(container).toMatchSnapshot();
    rerender(<RowColSpanWithFixed2 />);
    expect(container.querySelectorAll('.rc-table-cell-fix-left-last').length).toBe(4);
    expect(container.querySelectorAll('.rc-table-cell-fix-right-first').length).toBe(4);
    expect(container).toMatchSnapshot();
  });

  it('shadow should be shown when there are columns where fixed is false', async () => {
    const { container } = render(
      <RowColSpanWithFixed
        columns={[
          {
            title: 'Other',
            fixed: 'left',
          },
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            fixed: false,
          },
          {
            title: 'Company',
            fixed: false,
          },
          {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            fixed: 'right',
          },
        ]}
      />,
    );
    expect(container.querySelectorAll('.rc-table-cell-fix-left-last').length).toBe(101);
    expect(container.querySelectorAll('.rc-table-cell-fix-right-first').length).toBe(101);
    expect(container).toMatchSnapshot();
  });
});
