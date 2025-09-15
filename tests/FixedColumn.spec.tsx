import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { _rs } from '@rc-component/resize-observer';
import Table, { type ColumnsType } from '../src';
import { RowColSpanWithFixed, RowColSpanWithFixed2 } from './__mocks__/shadowTest';
import { spyElementPrototypes } from '@rc-component/util/lib/test/domHook';

async function triggerResize(ele: HTMLElement) {
  await act(async () => {
    _rs([{ target: ele }] as any);
    await Promise.resolve();
  });
}

describe('Table.FixedColumn', () => {
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
          const { container } = render(<Table columns={columns} data={testData} scroll={scroll} />);

          await triggerResize(container.querySelector<HTMLElement>('.rc-table'));

          act(() => {
            const coll = container.querySelector('.rc-table-resize-collection');
            if (coll) {
              triggerResize(coll as HTMLElement);
            }
          });

          await act(async () => {
            vi.runAllTimers();
            await Promise.resolve();
          });

          expect(container.firstChild).toMatchSnapshot();
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

      await act(async () => {
        vi.runAllTimers();
        await Promise.resolve();
      });

      expect(container.querySelector('colgroup')?.outerHTML).toMatchSnapshot();
    });
  });

  it('has correct scroll classNames when table resize', async () => {
    const { container } = render(
      <Table columns={columns} data={data} scroll={{ x: true }} style={{ width: 2000 }} />,
    );

    await act(async () => {
      vi.runAllTimers();
      await Promise.resolve();
    });

    const tableContent = container.querySelector('.rc-table-content');
    act(() => {
      if (tableContent) {
        Object.defineProperty(tableContent, 'scrollLeft', { value: 10, writable: true });
        Object.defineProperty(tableContent, 'scrollWidth', { value: 200, writable: true });
        Object.defineProperty(tableContent, 'clientWidth', { value: 100, writable: true });
        fireEvent.scroll(tableContent);
      }
    });
    expect(container.querySelector('.rc-table')).toHaveClass('rc-table-fix-start-shadow-show');
    expect(container.querySelector('.rc-table')).toHaveClass('rc-table-fix-end-shadow-show');

    act(() => {
      if (tableContent) {
        Object.defineProperty(tableContent, 'scrollLeft', { value: 0, writable: true });
        Object.defineProperty(tableContent, 'scrollWidth', { value: 200, writable: true });
        Object.defineProperty(tableContent, 'clientWidth', { value: 100, writable: true });
        fireEvent.scroll(tableContent);
      }
    });
    expect(container.querySelector('.rc-table')).not.toHaveClass('rc-table-fix-start-shadow-show');
    expect(container.querySelector('.rc-table')).toHaveClass('rc-table-fix-end-shadow-show');

    act(() => {
      if (tableContent) {
        Object.defineProperty(tableContent, 'scrollLeft', { value: 100, writable: true });
        Object.defineProperty(tableContent, 'scrollWidth', { value: 200, writable: true });
        Object.defineProperty(tableContent, 'clientWidth', { value: 100, writable: true });
        fireEvent.scroll(tableContent);
      }
    });
    expect(container.querySelector('.rc-table')).toHaveClass('rc-table-fix-start-shadow-show');
    expect(container.querySelector('.rc-table')).not.toHaveClass('rc-table-fix-end-shadow-show');

    act(() => {
      if (tableContent) {
        Object.defineProperty(tableContent, 'scrollLeft', { value: 0, writable: true });
        Object.defineProperty(tableContent, 'scrollWidth', { value: 100, writable: true });
        Object.defineProperty(tableContent, 'clientWidth', { value: 100, writable: true });
        fireEvent.scroll(tableContent);
      }
    });
    expect(container.querySelector('.rc-table')).not.toHaveClass('rc-table-fix-start-shadow-show');
    expect(container.querySelector('.rc-table')).not.toHaveClass('rc-table-fix-end-shadow-show');
  });

  it('ellipsis will wrap additional dom', () => {
    const myColumns = [{ ...columns[0], ellipsis: true }];
    const { container } = render(<Table columns={myColumns} data={data} />);

    expect(container.querySelectorAll('tr th .rc-table-cell-content')).toHaveLength(1);
    expect(container.querySelectorAll('tr td .rc-table-cell-content')).toHaveLength(data.length);
  });

  it('fixed column renders correctly RTL', async () => {
    const { container } = render(
      <Table columns={columns} data={data} direction="rtl" scroll={{ x: 1 }} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('not break measure count', async () => {
    const { container, rerender } = render(
      <Table columns={columns.slice(0, 5)} data={data} scroll={{ x: 1000 }} />,
    );

    await act(async () => {
      vi.runAllTimers();
      await Promise.resolve();
    });

    expect(container.querySelectorAll('.rc-table-measure-row td')).toHaveLength(5);

    rerender(<Table columns={columns.slice(0, 4)} data={data} scroll={{ x: 1000 }} />);
    expect(container.querySelectorAll('.rc-table-measure-row td')).toHaveLength(4);
  });

  it('when all columns fixed left, should not add fixed className', async () => {
    const { container } = render(
      <Table columns={columns.slice(0, 2)} data={data} scroll={{ x: 1000 }} />,
    );
    await act(async () => {
      vi.runAllTimers();
      await Promise.resolve();
    });
    expect(container.querySelector('.rc-table-cell-fix')).toBeFalsy();
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
        container.querySelectorAll<HTMLElement>('.rc-table-measure-row td').forEach(td => {
          triggerResize(td);
        });
      });

      await act(async () => {
        vi.runAllTimers();
        await Promise.resolve();
      });

      expect(container.querySelectorAll('tbody .rc-table-cell-fix-start')).toHaveLength(2);
      expect(container.querySelectorAll('thead th')[1]).toHaveStyle({
        'inset-inline-start': '0',
      });
      expect(container.querySelectorAll('thead th')[2]).toHaveStyle({
        'inset-inline-start': '1000px',
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
    expect(container.querySelectorAll('.rc-table-cell-fix-start-shadow').length).toBe(104);
    expect(container.querySelectorAll('.rc-table-cell-fix-end-shadow').length).toBe(101);
    rerender(<RowColSpanWithFixed2 />);
    expect(container.querySelectorAll('.rc-table-cell-fix-start-shadow').length).toBe(4);
    expect(container.querySelectorAll('.rc-table-cell-fix-end-shadow').length).toBe(4);
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

    expect(container.querySelectorAll('.rc-table-cell-fix-end-shadow')).toHaveLength(101);
    expect(container.querySelectorAll('.rc-table-cell-fix-start-shadow')).toHaveLength(101);
  });

  it('right shadow should be shown when scrollX is less than the sum of the widths of all columns', async () => {
    const { container } = render(
      <Table
        columns={[
          { title: 'a', width: 200, fixed: 'left' },
          { title: 'b', width: 200 },
          { title: 'c', width: 200 },
          { title: 'd', width: 200, fixed: 'right' },
        ]}
        data={data}
        scroll={{ x: 100 }}
        style={{ width: 400 }}
      />,
    );

    await act(async () => {
      vi.runAllTimers();
      await Promise.resolve();
    });

    const tableContent = container.querySelector('.rc-table-content');
    act(() => {
      if (tableContent) {
        Object.defineProperty(tableContent, 'scrollLeft', { value: 10, writable: true });
        Object.defineProperty(tableContent, 'scrollWidth', { value: 800, writable: true });
        Object.defineProperty(tableContent, 'clientWidth', { value: 400, writable: true });
        fireEvent.scroll(tableContent);
      }
    });
    expect(container.querySelector('.rc-table')).toHaveClass('rc-table-fix-start-shadow-show');
    expect(container.querySelector('.rc-table')).toHaveClass('rc-table-fix-end-shadow-show');
  });
});
