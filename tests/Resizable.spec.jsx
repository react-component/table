import { mount } from 'enzyme';
import Table from '../src';
import React from 'react';
import { act } from 'react-dom/test-utils';
import RcResizeObserver, { _rs } from 'rc-resize-observer';
import { safeAct } from './utils';
import { spyElementPrototype } from 'rc-util/lib/test/domHook';

describe('Table.resizable', () => {
  let domSpy;
  let containerSpy;

  beforeAll(() => {
    domSpy = spyElementPrototype(HTMLElement, 'offsetParent', {
      get: () => ({}),
    });
    containerSpy = spyElementPrototype(HTMLDivElement, 'offsetWidth', {
      get: () => 800,
    });
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    domSpy.mockRestore();
    containerSpy.mockRestore();
  });

  it('change width in onColumnResizeComplete', async () => {
    const onColumnResizeComplete = vi.fn();

    const App = () => {
      const [widthMap, setWidthMap] = React.useState(new Map());

      const columns = [
        { key: 'a', dataIndex: 'a', width: 400, resizable: true },
        { key: 'b', dataIndex: 'b', width: 400, resizable: true },
      ].map(col => ({ ...col, width: widthMap.get(col.key ?? col.dataIndex) || col.width }));

      return (
        <Table
          data={[{ a: '123', b: '123', key: '1' }]}
          columns={columns}
          scroll={{ x: columns.reduce((t, c) => t + c.width, 0) }}
          onColumnResizeComplete={info => {
            setWidthMap(prev => {
              const result = new Map(prev);
              info.columnWidths.forEach(i => {
                result.set(i.columnKey, i.width);
              });
              return result;
            });
            onColumnResizeComplete(info);
          }}
        />
      );
    };
    const wrapper = mount(<App />);

    async function triggerResize(resizeList) {
      wrapper.find(RcResizeObserver.Collection).first().props().onBatchResize(resizeList);
      await safeAct(wrapper);
      wrapper.update();
    }

    await triggerResize([
      {
        data: wrapper.find('ResizeObserver').at(1).props().data,
        size: { width: 400, offsetWidth: 400 },
      },
      {
        data: wrapper.find('ResizeObserver').at(2).props().data,
        size: { width: 400, offsetWidth: 400 },
      },
    ]);

    wrapper.find('.rc-table-cell-resize-handle').first().simulate('mousedown', { pageX: 0 });

    const mousemoveEvent = new Event('mousemove');
    mousemoveEvent.pageX = 100;

    await act(async () => {
      document.body.dispatchEvent(mousemoveEvent);
      await Promise.resolve();
      wrapper.update();
    });

    const mouseupEvent = new Event('mouseup');
    mouseupEvent.pageX = 100;

    await act(async () => {
      document.body.dispatchEvent(mouseupEvent);
      await Promise.resolve();
      wrapper.update();
    });

    expect(onColumnResizeComplete).toHaveBeenCalledWith({
      columnKey: 'a',
      width: 500,
      columnWidths: [
        { columnKey: 'a', width: 500 },
        { columnKey: 'b', width: 400 },
      ],
    });

    expect(wrapper.find('colgroup col').at(0).props().style.width).toBe(500);
    expect(wrapper.find('colgroup col').at(1).props().style.width).toBe(400);
  });

  it('columns total width < componentWidth', async () => {
    const onColumnResizeComplete = vi.fn();

    const App = () => {
      const [widthMap, setWidthMap] = React.useState(new Map());

      const columns = [
        { key: 'a', dataIndex: 'a', width: 100, resizable: true },
        { key: 'b', dataIndex: 'b', width: 100, resizable: true },
      ].map(col => ({ ...col, width: widthMap.get(col.key ?? col.dataIndex) || col.width || 100 }));

      return (
        <Table
          style={{ width: 800 }}
          data={[{ a: '123', b: 'xxxxxxxx', key: '1' }]}
          columns={columns}
          scroll={{ x: columns.reduce((t, c) => t + c.width, 0) }}
          onColumnResizeComplete={info => {
            setWidthMap(prev => {
              const result = new Map(prev);
              info.columnWidths.forEach(i => {
                result.set(i.columnKey, i.width);
              });
              return result;
            });
            onColumnResizeComplete(info);
          }}
        />
      );
    };
    const wrapper = mount(<App />);

    async function triggerResize(resizeList) {
      wrapper.find(RcResizeObserver.Collection).first().props().onBatchResize(resizeList);
      await safeAct(wrapper);
      wrapper.update();
    }

    wrapper.find(RcResizeObserver).first().props().onResize({ width: 800 });

    await triggerResize([
      {
        data: wrapper.find('ResizeObserver').at(1).props().data,
        size: { width: 400, offsetWidth: 400 },
      },
      {
        data: wrapper.find('ResizeObserver').at(2).props().data,
        size: { width: 400, offsetWidth: 400 },
      },
    ]);

    wrapper.find('.rc-table-cell-resize-handle').first().simulate('mousedown', { pageX: 0 });

    const mousemoveEvent = new Event('mousemove');
    mousemoveEvent.pageX = -100;

    await act(async () => {
      document.body.dispatchEvent(mousemoveEvent);
      await Promise.resolve();
      wrapper.update();
    });

    const mouseupEvent = new Event('mouseup');
    mouseupEvent.pageX = -100;

    await act(async () => {
      document.body.dispatchEvent(mouseupEvent);
      await Promise.resolve();
      wrapper.update();
    });

    expect(onColumnResizeComplete).toHaveBeenCalledWith({
      columnKey: 'a',
      width: 300,
      columnWidths: [
        { columnKey: 'a', width: 300 },
        // scrollBarSize = 15px
        { columnKey: 'b', width: 485 },
      ],
    });

    expect(wrapper.find('colgroup col').at(0).props().style.width).toBe(300);
    expect(wrapper.find('colgroup col').at(1).props().style.width).toBe(485);
  });

  it('minWidth should be worked', async () => {
    const onColumnResizeComplete = vi.fn();

    const App = () => {
      const [widthMap, setWidthMap] = React.useState(new Map());

      const columns = [
        { key: 'a', dataIndex: 'a', width: 800, resizable: true, minWidth: 400 },
        { key: 'b', dataIndex: 'b', width: 800, resizable: true },
      ].map(col => ({ ...col, width: widthMap.get(col.key ?? col.dataIndex) || col.width }));

      return (
        <Table
          data={[{ a: '123', b: '123', key: '1' }]}
          columns={columns}
          scroll={{ x: columns.reduce((t, c) => t + c.width, 0) }}
          onColumnResizeComplete={info => {
            setWidthMap(prev => {
              const result = new Map(prev);
              info.columnWidths.forEach(i => {
                result.set(i.columnKey, i.width);
              });
              return result;
            });
            onColumnResizeComplete(info);
          }}
        />
      );
    };
    const wrapper = mount(<App />);

    async function triggerResize(resizeList) {
      wrapper.find(RcResizeObserver.Collection).first().props().onBatchResize(resizeList);
      await safeAct(wrapper);
      wrapper.update();
    }

    await triggerResize([
      {
        data: wrapper.find('ResizeObserver').at(1).props().data,
        size: { width: 800, offsetWidth: 800 },
      },
      {
        data: wrapper.find('ResizeObserver').at(2).props().data,
        size: { width: 800, offsetWidth: 800 },
      },
    ]);

    wrapper.find('.rc-table-cell-resize-handle').first().simulate('mousedown', { pageX: 0 });

    const mousemoveEvent = new Event('mousemove');
    mousemoveEvent.pageX = -1000;

    await act(async () => {
      document.body.dispatchEvent(mousemoveEvent);
      await Promise.resolve();
      wrapper.update();
    });

    const mouseupEvent = new Event('mouseup');
    mouseupEvent.pageX = -1000;

    await act(async () => {
      document.body.dispatchEvent(mouseupEvent);
      await Promise.resolve();
      wrapper.update();
    });

    expect(onColumnResizeComplete).toHaveBeenCalledWith({
      columnKey: 'a',
      width: 400,
      columnWidths: [
        { columnKey: 'a', width: 400 },
        { columnKey: 'b', width: 800 },
      ],
    });

    expect(wrapper.find('colgroup col').at(0).props().style.width).toBe(400);
    expect(wrapper.find('colgroup col').at(1).props().style.width).toBe(800);
  });

  it('resize handle should in header right scrollbar when last column is not fixed', async () => {
    const App = () => {
      const columns = [
        { key: 'a', dataIndex: 'a', width: 800, resizable: true },
        { key: 'b', dataIndex: 'b', width: 800, resizable: true },
      ];

      return (
        <Table
          data={[{ a: '123', b: '123', key: '1' }]}
          columns={columns}
          scroll={{ x: 1600, y: 100 }}
        />
      );
    };
    const wrapper = mount(<App />);

    expect(
      wrapper.find('.rc-table-cell-scrollbar .rc-table-cell-resize-handle').exists(),
    ).toBeTruthy();
    expect(
      wrapper
        .find('.rc-table-thead .rc-table-cell')
        .at(1)
        .find('.rc-table-cell-resize-handle')
        .exists(),
    ).toBeFalsy();
  });

  it('resize handle should not in header right scrollbar when last column is fixed right', async () => {
    const App = () => {
      const columns = [
        { key: 'a', dataIndex: 'a', width: 800, resizable: true },
        { key: 'b', dataIndex: 'b', width: 800, resizable: true, fixed: 'right' },
      ];

      return (
        <Table
          data={[{ a: '123', b: '123', key: '1' }]}
          columns={columns}
          scroll={{ x: 1600, y: 100 }}
        />
      );
    };
    const wrapper = mount(<App />);

    expect(
      wrapper.find('.rc-table-cell-scrollbar .rc-table-cell-resize-handle').exists(),
    ).toBeFalsy();
    expect(
      wrapper
        .find('.rc-table-thead .rc-table-cell')
        .at(1)
        .find('.rc-table-cell-resize-handle')
        .exists(),
    ).toBeTruthy();
  });
});
