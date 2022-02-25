import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { resetWarned } from 'rc-util/lib/warning';
import { spyElementPrototype } from 'rc-util/lib/test/domHook';
import Table from '../src';
import RcResizeObserver from 'rc-resize-observer';

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
          jest.useFakeTimers();
          const wrapper = mount(<Table columns={columns} data={testData} scroll={scroll} />);

          act(() => {
            wrapper
              .find(RcResizeObserver.Collection)
              .first()
              .props()
              .onBatchResize([
                {
                  data: wrapper.find('table ResizeObserver').first().props().data,
                  size: { width: 93, offsetWidth: 93 },
                },
              ]);
          });
          await act(async () => {
            jest.runAllTimers();
            await Promise.resolve();
            wrapper.update();
          });
          expect(wrapper.render()).toMatchSnapshot();
          jest.useRealTimers();
        });
      });
    });

    it('all column has width should use it', () => {
      const wrapper = mount(
        <Table
          columns={[
            { title: 'title1', dataIndex: 'a', key: 'a', width: 100 },
            { title: 'title2', dataIndex: 'b', key: 'b', width: 100 },
          ]}
          data={[]}
          scroll={{ x: 'max-content' }}
        />,
      );

      expect(wrapper.find('colgroup').render()).toMatchSnapshot();
    });
  });

  it('has correct scroll classNames when table resize', () => {
    const wrapper = mount(
      <Table columns={columns} data={data} scroll={{ x: true }} style={{ width: 2000 }} />,
    );

    // Use `onScroll` directly since simulate not support `currentTarget`
    act(() => {
      wrapper
        .find('.rc-table-content')
        .props()
        .onScroll({
          currentTarget: {
            scrollLeft: 10,
            scrollWidth: 200,
            clientWidth: 100,
          },
        });
    });
    wrapper.update();
    expect(wrapper.find('.rc-table').hasClass('rc-table-ping-left')).toBeTruthy();
    expect(wrapper.find('.rc-table').hasClass('rc-table-ping-right')).toBeTruthy();

    // Left
    act(() => {
      wrapper
        .find('.rc-table-content')
        .props()
        .onScroll({
          currentTarget: {
            scrollLeft: 0,
            scrollWidth: 200,
            clientWidth: 100,
          },
        });
    });
    wrapper.update();
    expect(wrapper.find('.rc-table').hasClass('rc-table-ping-left')).toBeFalsy();
    expect(wrapper.find('.rc-table').hasClass('rc-table-ping-right')).toBeTruthy();

    // Right
    act(() => {
      wrapper
        .find('.rc-table-content')
        .props()
        .onScroll({
          currentTarget: {
            scrollLeft: 100,
            scrollWidth: 200,
            clientWidth: 100,
          },
        });
    });
    wrapper.update();
    expect(wrapper.find('.rc-table').hasClass('rc-table-ping-left')).toBeTruthy();
    expect(wrapper.find('.rc-table').hasClass('rc-table-ping-right')).toBeFalsy();
  });

  describe('warning if fixed not continue', () => {
    let errorSpy;

    beforeAll(() => {
      errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    beforeEach(() => {
      resetWarned();
      errorSpy.mockReset();
    });

    afterAll(() => {
      errorSpy.mockRestore();
    });

    it('left', () => {
      mount(<Table columns={[{}, { fixed: 'left' }, {}]} />);
      expect(errorSpy).toHaveBeenCalledWith(
        "Warning: Index 0 of `columns` missing `fixed='left'` prop.",
      );
    });

    it('right', () => {
      mount(<Table columns={[{}, { fixed: 'right' }, {}]} />);
      expect(errorSpy).toHaveBeenCalledWith(
        "Warning: Index 2 of `columns` missing `fixed='right'` prop.",
      );
    });
  });

  it('ellipsis will wrap additional dom', () => {
    const myColumns = [{ ...columns[0], ellipsis: true }];
    const wrapper = mount(<Table columns={myColumns} data={data} />);

    expect(wrapper.find('tr th').find('.rc-table-cell-content')).toHaveLength(1);
    expect(wrapper.find('tr td').find('.rc-table-cell-content')).toHaveLength(data.length);
  });

  it('fixed column renders correctly RTL', () => {
    const wrapper = mount(
      <Table columns={columns} data={data} direction="rtl" scroll={{ x: 1 }} />,
    );
    expect(wrapper.render()).toMatchSnapshot();
  });
  it('has correct scroll classNames when table direction is RTL', () => {
    const wrapper = mount(<Table columns={columns} data={data} direction="rtl" />);

    expect(wrapper.find('.rc-table').hasClass('rc-table-rtl')).toBeTruthy();

    // Left should be right in RTL
    expect(
      wrapper
        .find('.rc-table-row')
        .first()
        .find('.rc-table-cell')
        .first()
        .hasClass('rc-table-cell-fix-right'),
    ).toBeTruthy();

    // Right should be left in RTL
    expect(
      wrapper
        .find('.rc-table-row')
        .first()
        .find('.rc-table-cell')
        .last()
        .hasClass('rc-table-cell-fix-left'),
    ).toBeTruthy();
  });

  it('not break measure count', () => {
    const wrapper = mount(<Table columns={columns.slice(0, 5)} data={data} scroll={{ x: 1000 }} />);
    expect(wrapper.find('.rc-table-measure-row td')).toHaveLength(5);

    wrapper.setProps({ columns: columns.slice(0, 4) });
    wrapper.update();
    expect(wrapper.find('.rc-table-measure-row td')).toHaveLength(4);
  });
});
