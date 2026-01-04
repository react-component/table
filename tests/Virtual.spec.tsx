import { act, fireEvent, render } from '@testing-library/react';
import { _rs as onEsResize } from '@rc-component/resize-observer/es/utils/observerUtil';
import { _rs as onLibResize } from '@rc-component/resize-observer/lib/utils/observerUtil';
import { spyElementPrototypes } from '@rc-component/util/lib/test/domHook';
import { resetWarned } from '@rc-component/util/lib/warning';
import React from 'react';
import { VirtualTable, type Reference, type VirtualTableProps } from '../src';

const identity = (value: any) => value;

global.scrollToConfig = null;
global.collectGetScrollInfoReturn = identity;

vi.mock('@rc-component/virtual-list', async () => {
  const RealVirtualList = ((await vi.importActual('@rc-component/virtual-list')) as any).default;

  const WrapperVirtualList = React.forwardRef((props: any, ref) => {
    const myRef = React.useRef(null);

    React.useImperativeHandle(ref, () => ({
      ...myRef.current,
      scrollTo: (config: any) => {
        global.scrollToConfig = config;
        return myRef.current.scrollTo(config);
      },
      getScrollInfo: () => {
        const originResult = myRef.current.getScrollInfo();
        return global.collectGetScrollInfoReturn(originResult);
      },
    }));

    return <RealVirtualList ref={myRef} {...props} data-scroll-width={props.scrollWidth} />;
  });

  return {
    default: WrapperVirtualList,
  };
});

describe('Table.Virtual', () => {
  let scrollLeftCalled = false;

  const setScrollLeft = vi.fn();

  beforeAll(() => {
    spyElementPrototypes(HTMLElement, {
      getBoundingClientRect: () => ({
        width: 50,
      }),
      scrollLeft: {
        get: () => {
          scrollLeftCalled = true;
          return 100;
        },
        set: setScrollLeft as any,
      },
      clientWidth: {
        get: () => 80,
      },
      scrollWidth: {
        get: () => 100,
      },
    });
  });

  beforeEach(() => {
    scrollLeftCalled = false;
    setScrollLeft.mockReset();
    global.scrollToConfig = vi.fn(identity);
    // global.collectGetScrollInfoReturn.mockReset();
    vi.useFakeTimers();
    resetWarned();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  async function waitFakeTimer() {
    for (let i = 0; i < 10; i += 1) {
      // eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-loop-func
      await act(async () => {
        vi.advanceTimersByTime(100);
        await Promise.resolve();
      });
    }
  }

  function resize(target: HTMLElement) {
    act(() => {
      onLibResize([{ target } as any]);
      onEsResize([{ target } as any]);
    });
  }

  function getTable(props?: Partial<VirtualTableProps<any>> & React.RefAttributes<Reference>) {
    return render(
      <VirtualTable
        columns={[
          {
            dataIndex: 'name',
          },
          {
            dataIndex: 'age',
          },
          {
            dataIndex: 'address',
          },
        ]}
        rowKey="name"
        scroll={{ x: 100, y: 100 }}
        listItemHeight={20}
        data={new Array(100).fill(null).map((_, index) => ({
          name: `name${index}`,
          age: index,
          address: `address${index}`,
        }))}
        {...props}
      />,
    );
  }

  it('should work', async () => {
    const { container } = getTable();

    await waitFakeTimer();

    expect(container.querySelector('.rc-table-tbody-virtual')).toBeTruthy();
  });

  it('warning for scroll props is not a number', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    getTable({
      scroll: {
        x: true,
      } as any,
    });

    expect(errSpy).toHaveBeenCalledWith('Warning: `scroll.x` in virtual table must be number.');
    expect(errSpy).toHaveBeenCalledWith('Warning: `scroll.y` in virtual table must be number.');
  });

  it('rowSpan', () => {
    const { container } = getTable({
      columns: [
        {
          dataIndex: 'name',
          onCell: (_, index) => ({
            rowSpan: index % 2 ? 0 : 2,
          }),
        },
      ],
    });

    expect(container.querySelector('.rc-table-row-extra').textContent).toBe('name0');
  });

  it('empty', () => {
    const { container } = getTable({
      data: [],
    });

    expect(container.querySelector('.rc-table-placeholder').textContent).toBe('No Data');
  });

  describe('expandable', () => {
    it('basic', () => {
      (['bamboo', () => 'bamboo'] as const).forEach(cls => {
        const { container } = getTable({
          expandable: {
            expandedRowKeys: ['name0', 'name3'],
            expandedRowRender: record => record.name,
            expandedRowClassName: cls,
          },
        });
        const expandedCells = container.querySelectorAll('.rc-table-expanded-row-cell');
        expect(expandedCells).toHaveLength(2);
        expect(expandedCells[0].textContent).toBe('name0');
        expect(expandedCells[1].textContent).toBe('name3');
        expect(container.querySelector('.rc-table-expanded-row')).toHaveClass('bamboo');
      });
    });

    it('fixed', () => {
      const { container } = getTable({
        columns: [
          {
            dataIndex: 'name',
            fixed: 'left',
          },
          {
            dataIndex: 'age',
          },
          {
            dataIndex: 'address',
          },
        ],
        expandable: {
          expandedRowKeys: ['name0', 'name3'],
          expandedRowRender: record => record.name,
        },
      });

      const expandedCells = container.querySelectorAll('.rc-table-expanded-row-cell-fixed');
      expect(expandedCells).toHaveLength(2);
      expect(expandedCells[0].textContent).toBe('name0');
      expect(expandedCells[1].textContent).toBe('name3');
    });
  });

  it('scroll sync', () => {
    const { container } = getTable();

    resize(container.querySelector('.rc-table')!);

    scrollLeftCalled = false;
    expect(scrollLeftCalled).toBeFalsy();

    fireEvent.wheel(container.querySelector('.rc-table-tbody-virtual-holder')!, {
      deltaX: 10,
    });
    expect(scrollLeftCalled).toBeTruthy();
  });

  it('should not reset scroll when data changed', async () => {
    const { container, rerender } = getTable();

    resize(container.querySelector('.rc-table')!);

    rerender(
      <VirtualTable
        columns={[
          {
            dataIndex: 'name',
          },
          {
            dataIndex: 'age',
          },
          {
            dataIndex: 'address',
          },
        ]}
        rowKey="name"
        scroll={{ x: 100, y: 100 }}
        data={[{}]}
      />,
    );
    vi.runAllTimers();

    // mock scrollLeft is 100, but virtual offsetX is 0
    expect(setScrollLeft).toHaveBeenCalledWith(undefined, 0);
  });

  it('should follow correct width', () => {
    const { container } = getTable({
      columns: [
        {
          width: 93,
        },
        {
          width: 510,
        },
      ],
      scroll: {
        x: 100,
        y: 10,
      },
      data: [{}],
    });

    expect(container.querySelector('.rc-table-tbody-virtual')).toHaveAttribute(
      'data-scroll-width',
      '603',
    );
  });

  it('render params should correct', () => {
    const { container } = getTable({
      columns: [
        {
          width: 93,
          render: (_, __, index) => <div className="bamboo">{index}</div>,
        },
      ],
      scroll: {
        x: 1128,
        y: 10,
      },
      data: [{}],
    });

    expect(container.querySelector('.bamboo').textContent).toEqual('0');
  });

  it('columns less than width', async () => {
    const { container } = getTable({
      columns: [{}, {}],
      scroll: {
        y: 10,
      },
      getContainerWidth: () => 200,
      data: [{}],
    });

    resize(container.querySelector('.rc-table'));

    await waitFakeTimer();

    expect(container.querySelectorAll('col')).toHaveLength(2);
    expect(container.querySelectorAll('col')[0]).toHaveStyle({ width: '100px' });
    expect(container.querySelectorAll('col')[1]).toHaveStyle({ width: '100px' });
  });

  it('should fill width as scrollX if scrollX is larger', async () => {
    const { container } = getTable({
      columns: [
        {
          width: 100,
        },
      ],
      scroll: {
        x: 1128,
        y: 10,
      },
      getContainerWidth: () => 200,
      data: [{}],
    });

    expect(container.querySelector('.rc-table-tbody-virtual')).toHaveAttribute(
      'data-scroll-width',
      '1128',
    );
  });

  it('sticky header with virtual should work', async () => {
    const { container } = getTable({ sticky: { offsetHeader: 10 } });

    await waitFakeTimer();

    expect(container.querySelector('.rc-table-header')).toHaveStyle({
      overflow: 'hidden',
      top: '10px',
    });

    expect(container.querySelector('.rc-table-header')).toHaveClass(
      'rc-table-header',
      'rc-table-sticky-holder',
    );
  });

  it('sticky scrollbar with virtual should work', async () => {
    const { container } = getTable({ sticky: { offsetScroll: 10 } });

    await waitFakeTimer();

    expect(container.querySelector('.rc-table-tbody-virtual-scrollbar-horizontal')).toHaveStyle({
      position: 'sticky',
      bottom: '10px',
    });
  });

  it('scrollTo should pass', async () => {
    const tblRef = React.createRef<Reference>();
    getTable({ ref: tblRef });

    tblRef.current.scrollTo({
      index: 99,
    });

    await waitFakeTimer();

    expect(global.scrollToConfig).toEqual({
      index: 99,
    });
  });

  it('scrollTo with offset should pass', async () => {
    const tblRef = React.createRef<Reference>();
    getTable({ ref: tblRef });

    // Test index with offset
    tblRef.current.scrollTo({
      index: 50,
      offset: 20,
    });

    await waitFakeTimer();

    expect(global.scrollToConfig).toEqual({
      index: 50,
      offset: 20,
      align: 'top',
    });

    // Test key with offset
    tblRef.current.scrollTo({
      key: '25',
      offset: -10,
    });

    await waitFakeTimer();

    expect(global.scrollToConfig).toEqual({
      key: '25',
      offset: -10,
      align: 'top',
    });

    // Test top with offset (offset should be passed to virtual list)
    tblRef.current.scrollTo({
      top: 100,
      offset: 30,
    });

    await waitFakeTimer();

    expect(global.scrollToConfig).toEqual({
      top: 100,
      offset: 30,
      align: 'top',
    });
  });

  describe('auto width', () => {
    async function prepareTable(columns: any[]) {
      const { container } = getTable({
        getContainerWidth: () => 300,
        columns: columns,
      });

      resize(container.querySelector('.rc-table')!);
      await waitFakeTimer();

      return container;
    }

    it('fill rest', async () => {
      const container = await prepareTable([
        {
          dataIndex: 'name',
          width: 100,
        },
        {
          dataIndex: 'age',
        },
      ]);

      expect(container.querySelectorAll('col')[0]).toHaveStyle({
        width: '100px',
      });
      expect(container.querySelectorAll('col')[1]).toHaveStyle({
        width: '200px',
      });
    });

    it('stretch', async () => {
      const container = await prepareTable([
        {
          dataIndex: 'name',
          width: 100,
        },
        {
          dataIndex: 'age',
          width: 100,
        },
      ]);

      expect(container.querySelectorAll('col')[0]).toHaveStyle({
        width: '150px',
      });
      expect(container.querySelectorAll('col')[1]).toHaveStyle({
        width: '150px',
      });
    });

    it('exceed', async () => {
      const container = await prepareTable([
        {
          dataIndex: 'name',
          width: 500,
        },
        {
          dataIndex: 'age',
          width: 600,
        },
      ]);

      expect(container.querySelectorAll('col')[0]).toHaveStyle({
        width: '500px',
      });
      expect(container.querySelectorAll('col')[1]).toHaveStyle({
        width: '600px',
      });
    });
  });

  it('components', async () => {
    const Wrapper = React.forwardRef((props, ref: React.Ref<HTMLDivElement>) => (
      <div {...props} ref={ref} data-mark="my-wrapper" />
    ));

    const { container } = getTable({
      components: {
        header: {
          cell: function MyTh(props: any) {
            return <th {...props} data-mark="my-th" />;
          },
        },
        body: {
          wrapper: Wrapper,
          row: (props: any) => <div {...props} data-mark="my-row" />,
          cell: (props: any) => <div {...props} data-mark="my-cell" />,
        },
      },
    });

    await waitFakeTimer();

    expect(container.querySelector('thead th')).toHaveAttribute('data-mark', 'my-th');
    expect(container.querySelector('.rc-table-tbody-virtual-holder')).toHaveAttribute(
      'data-mark',
      'my-wrapper',
    );
    expect(container.querySelector('.rc-table-row')).toHaveAttribute('data-mark', 'my-row');
    expect(container.querySelector('.rc-table-row .rc-table-cell')).toHaveAttribute(
      'data-mark',
      'my-cell',
    );
  });

  it('onScroll event should work', async () => {
    const onScroll = vi.fn();
    const { container } = getTable({ onScroll });

    await waitFakeTimer();

    fireEvent.scroll(container.querySelector('.rc-table-tbody-virtual-holder')!);
    expect(onScroll).toHaveBeenCalled();
  });

  it('scrollable when empty', async () => {
    const onScroll = vi.fn();
    const { container } = getTable({ data: [], onScroll });

    await waitFakeTimer();

    fireEvent.scroll(container.querySelector('.rc-table-body'));
    expect(onScroll).toHaveBeenCalled();
  });

  describe('shadow', () => {
    beforeAll(() => {
      spyElementPrototypes(HTMLElement, {
        scrollLeft: {
          get: () => 0,
        },
      });
    });

    it('right shadow should display correctly when mount', async () => {
      const { container } = getTable({
        columns: [
          {
            dataIndex: 'name',
            width: 30,
          },
          {
            dataIndex: 'age',
            width: 30,
          },
          {
            dataIndex: 'address',
            width: 40,
            fixed: 'right',
          },
        ],
        getContainerWidth: () => 80,
      });

      resize(container.querySelector('.rc-table'));

      await waitFakeTimer();

      expect(container.querySelector('.rc-table')).toHaveClass('rc-table-fix-end-shadow-show');
    });

    it('right shadow should display correctly when showHeader is false', async () => {
      const { container } = getTable({
        showHeader: false,
        columns: [
          {
            dataIndex: 'name',
            width: 30,
          },
          {
            dataIndex: 'age',
            width: 30,
          },
          {
            dataIndex: 'address',
            width: 40,
            fixed: 'right',
          },
        ],
        getContainerWidth: () => 80,
      });

      resize(container.querySelector('.rc-table'));

      await waitFakeTimer();

      expect(container.querySelector('.rc-table')).toHaveClass('rc-table-fix-end-shadow-show');
    });
  });

  /**
   * In antd, we need to call the scrollTop method through ref to achieve scrolling.
   * see: https://github.com/ant-design/ant-design/issues/54734
   */
  it('should get and set scrollTop correctly', async () => {
    const ref = React.createRef<any>();

    global.collectGetScrollInfoReturn = (origin: any) => ({
      ...origin,
      y: 50,
    });

    getTable({ internalRefs: { body: ref } });

    expect(ref.current.scrollTop).toBe(50);

    ref.current.scrollTop = 200;
    expect(global.scrollToConfig).toEqual({
      top: 200,
    });
  });

  it('should not crash when pageSize shrinks after scrolled to bottom (rowSpan)', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const tblRef = React.createRef<Reference>();

    const makeData = (len: number) =>
      Array.from({ length: len }).map((_, id) => ({
        id,
        firstName: `First_${id.toString(16)}`,
        lastName: `Last_${id.toString(16)}`,
        age: 20 + (id % 30),
        address: `Address_${id}`,
      }));

    const data = makeData(10000);

    const columns = [
      { dataIndex: 'id', width: 100, fixed: 'left' },
      { dataIndex: 'firstName', width: 140, fixed: 'left' },
      { dataIndex: 'lastName', width: 140 },
      {
        dataIndex: 'group',
        width: 160,
        render: (_: any, record: any) => `Group ${Math.floor(record.id / 4)}`,
        onCell: (record: any) => ({
          rowSpan: record.id % 4 === 0 ? 4 : 0,
        }),
      },
      {
        dataIndex: 'age',
        width: 120,
        onCell: (record: any) => ({
          colSpan: record.id % 4 === 0 ? 2 : 1,
        }),
      },
      {
        dataIndex: 'address',
        width: 220,
        onCell: (record: any) => ({
          colSpan: record.id % 4 === 0 ? 0 : 1,
        }),
      },
    ];

    const renderTable = (pageSize: number) => (
      <VirtualTable
        ref={tblRef}
        columns={columns as any}
        rowKey="id"
        scroll={{ x: 900, y: 200 }}
        data={data.slice(0, pageSize)}
      />
    );

    const { rerender } = render(renderTable(200));

    await waitFakeTimer();

    // 模拟滚到底
    act(() => {
      tblRef.current?.scrollTo?.({ top: 10 ** 10 });
    });

    await waitFakeTimer();

    // 切到 pageSize=10（slice 模拟分页）
    expect(() => {
      rerender(renderTable(10));
    }).not.toThrow();

    // flush timers to cover transient render
    vi.runAllTimers();
    await waitFakeTimer();

    // 不应出现 record undefined 相关错误
    const errorText = errSpy.mock.calls.map(args => String(args[0] ?? '')).join('\n');
    expect(errorText).not.toContain('Cannot read properties of undefined');
    expect(errorText).not.toContain("reading 'record'");

    errSpy.mockRestore();
  });
});
