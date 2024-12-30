import { mount } from 'enzyme';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import React from 'react';
import { act } from 'react-dom/test-utils';
import Table from '../src';
import { safeAct } from './utils';

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

    const wrapper = mount(createTable({ scroll: { x: true } }));

    expect(wrapper.find('.rc-table-tbody').hostNodes().text()).toContain('No Data');
  });

  it('renders scroll.x is true', () => {
    const wrapper = mount(createTable({ scroll: { x: true } }));
    expect(wrapper.find('table').props().style.width).toEqual('auto');
    expect(wrapper.find('.rc-table-content').props().style.overflowX).toEqual('auto');
    expect(wrapper.find('.rc-table-content').props().style.overflowY).toEqual('hidden');
  });

  it('renders scroll.x is a number', () => {
    const wrapper = mount(createTable({ scroll: { x: 200 } }));
    expect(wrapper.find('table').props().style.width).toEqual(200);
  });

  it('renders scroll.y is a number', () => {
    const wrapper = mount(createTable({ scroll: { y: 200 } }));
    expect(wrapper.find('.rc-table-body').props().style.maxHeight).toEqual(200);
  });

  it('renders scroll.x and scroll.y are both true', () => {
    const wrapper = mount(createTable({ scroll: { x: true, y: 200 } }));
    expect(wrapper.find('.rc-table-body').props().style.overflowX).toEqual('auto');
    expect(wrapper.find('.rc-table-body').props().style.overflowY).toEqual('scroll');
  });

  describe('scroll', () => {
    let scrollLeft = 0;
    let scrollTop = 0;
    let domSpy;

    const setScrollLeft = vi.fn((_, val) => {
      scrollLeft = val;
    });
    const setScrollTop = vi.fn((_, val) => {
      scrollTop = val;
    });
    beforeEach(() => {
      vi.useFakeTimers();
      domSpy = spyElementPrototypes(HTMLElement, {
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
        offsetWidth: {
          get: () => 200,
        },
        getBoundingClientRect() {
          if (this.tagName === 'TR') {
            return {
              x: 0,
              y: 0,
              width: 1000,
              height: 105,
            };
          }
          if (this.textContent === 'title3') {
            return {
              x: 400,
              y: 0,
              width: 100,
              height: 105,
            };
          }

          return {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
          };
        },
      });
    });

    afterEach(() => {
      setScrollLeft.mockReset();

      domSpy.mockRestore();
      vi.useRealTimers();
    });

    it('scroll event', () => {
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
      const wrapper = mount(
        <Table
          columns={newColumns}
          data={newData}
          scroll={{
            x: 200,
            y: 200,
          }}
        />,
      );

      vi.runAllTimers();
      // Use `onScroll` directly since simulate not support `currentTarget`
      act(() => {
        const headerDiv = wrapper.find('div.rc-table-header').instance();

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
        wrapper
          .find('.rc-table-body')
          .props()
          .onScroll({
            currentTarget: {
              scrollLeft: 33,
              scrollWidth: 200,
              clientWidth: 100,
            },
          });
      });
      vi.runAllTimers();
      expect(setScrollLeft).toHaveBeenCalledWith(undefined, 33);
    });

    it('cell should have not have classname `rc-table-cell-fix-left-last` before being sticky', async () => {
      // const cellSpy = spyElementPrototypes(HTMLElement, {
      //   offsetParent: {
      //     get: () => ({}),
      //   },

      // });

      const newColumns = [
        { title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
        {
          title: 'title2',
          dataIndex: 'b',
          key: 'b',
          width: 100,
          render: () => <span>1111</span>,
        },
        { title: 'title3', dataIndex: 'c', key: 'c', width: 100, fixed: 'left' },
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
      const wrapper = mount(
        <Table columns={newColumns} data={data} scroll={{ x: 1000, y: 800 }} />,
      );

      vi.runAllTimers();
      await safeAct(wrapper);
      console.log(wrapper.find('th').first(), wrapper.find('th').at(2));

      expect(wrapper.find('th').first().props().className).toContain('rc-table-cell-fix-left-last');
      expect(wrapper.find('th').at(2).props().className).not.toContain(
        'rc-table-cell-fix-left-last',
      );

      act(() => {
        wrapper
          .find('.rc-table-body')
          .props()
          .onScroll({
            currentTarget: {
              scrollLeft: 200,
              scrollWidth: 200,
              clientWidth: 100,
            },
          });
      });
      vi.runAllTimers();
      setScrollLeft.mockReset();
      await safeAct(wrapper);

      expect(wrapper.find('th').at(2).props().className).toContain('rc-table-cell-fix-left-last');
    });
  });

  it('trigger inner scrollTo when set `top` 0 after render', () => {
    let isTriggerScroll = false;
    spyElementPrototypes(HTMLElement, {
      scrollTo: _ => {
        isTriggerScroll = true;
      },
    });

    const tRef = React.createRef();

    const wrapper = mount(createTable({ ref: tRef }));

    tRef.current.scrollTo({
      top: 0,
    });
    expect(isTriggerScroll).toEqual(true);
  });
});
