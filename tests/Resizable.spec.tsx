import Table from '../src';
import React from 'react';
import { render, fireEvent, act, createEvent } from '@testing-library/react';
import { _rs } from '@rc-component/resize-observer';
import { spyElementPrototype } from '@rc-component/util/lib/test/domHook';

async function triggerResize(ele: Element) {
  await act(async () => {
    _rs([{ target: ele }] as any);
    await Promise.resolve();
  });
}

function doMouseMove(element: Element, start: number, end: number, fireMouseUp = true) {
  const mouseDown = createEvent.mouseDown(element, {
    pageX: start,
  });
  Object.defineProperties(mouseDown, {
    pageX: { get: () => start },
    pageY: { get: () => start },
  });

  fireEvent(element, mouseDown);

  // Drag
  if (start !== end) {
    const mouseMove: any = new Event('mousemove');
    mouseMove.pageX = end;

    fireEvent(document, mouseMove);
  }

  if (fireMouseUp) {
    const mouseUp: any = new Event('mouseup');
    mouseUp.pageX = end;
    fireEvent(document, mouseUp);
  }
}

describe('Table.resizable', () => {
  let domSpy;
  let containerSpy;
  let measureCellSpy;

  beforeAll(() => {
    domSpy = spyElementPrototype(HTMLElement, 'offsetParent', {
      get: () => ({}),
    });
    containerSpy = spyElementPrototype(HTMLDivElement, 'offsetWidth', {
      get: () => 800,
    });
    measureCellSpy = spyElementPrototype(HTMLTableCellElement, 'offsetWidth', {
      get: () => 400,
    });
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    domSpy.mockRestore();
    containerSpy.mockRestore();
    measureCellSpy.mockRestore();
  });

  it('change width in onColumnResizeEnd', async () => {
    const onColumnResizeEnd = vi.fn();

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
          onColumnResizeEnd={info => {
            setWidthMap(prev => {
              const result = new Map(prev);
              info.columnWidths.forEach(i => {
                result.set(i.columnKey, i.width);
              });
              return result;
            });
            onColumnResizeEnd(info);
          }}
        />
      );
    };
    const { container } = render(<App />);

    await triggerResize(container.querySelector('.rc-table'));

    doMouseMove(container.querySelectorAll('.rc-table-cell-resize-handle')[0], 0, 100);

    expect(onColumnResizeEnd).toHaveBeenCalledWith({
      columnKey: 'a',
      width: 500,
      columnWidths: [
        { columnKey: 'a', width: 500 },
        { columnKey: 'b', width: 400 },
      ],
    });

    const measureCells = container.querySelectorAll('.rc-table-measure-row td');

    Object.defineProperty(measureCells[0], 'offsetWidth', {
      value: 500,
    });
    await triggerResize(measureCells[0]);

    doMouseMove(container.querySelectorAll('.rc-table-cell-resize-handle')[1], 0, 100);

    expect(onColumnResizeEnd).toHaveBeenCalledWith({
      columnKey: 'b',
      width: 500,
      columnWidths: [
        { columnKey: 'a', width: 500 },
        { columnKey: 'b', width: 500 },
      ],
    });
  });

  it('columns total width < componentWidth', async () => {
    const onColumnResizeEnd = vi.fn();

    const App = () => {
      const [widthMap, setWidthMap] = React.useState(new Map());

      const columns = [
        { key: 'a', dataIndex: 'a', width: 400, resizable: true },
        { key: 'b', dataIndex: 'b', width: 400, resizable: true },
      ].map(col => ({ ...col, width: widthMap.get(col.key ?? col.dataIndex) || col.width }));

      return (
        <Table
          data={[{ a: '123', b: 'xxxxxxxx', key: '1' }]}
          columns={columns}
          scroll={{ x: columns.reduce((t, c) => t + c.width, 0) }}
          onColumnResizeEnd={info => {
            setWidthMap(prev => {
              const result = new Map(prev);
              info.columnWidths.forEach(i => {
                result.set(i.columnKey, i.width);
              });
              return result;
            });
            onColumnResizeEnd(info);
          }}
        />
      );
    };
    const { container } = render(<App />);

    await triggerResize(container.querySelector('.rc-table'));

    doMouseMove(container.querySelectorAll('.rc-table-cell-resize-handle')[0], 100, 0);

    expect(onColumnResizeEnd).toHaveBeenCalledWith({
      columnKey: 'a',
      width: 300,
      columnWidths: [
        { columnKey: 'a', width: 300 },
        { columnKey: 'b', width: 485 },
        // scrollbar 15px
      ],
    });
  });

  it('minWidth should be worked', async () => {
    const onColumnResizeEnd = vi.fn();

    const App = () => {
      const [widthMap, setWidthMap] = React.useState(new Map());

      const columns = [
        { key: 'a', dataIndex: 'a', width: 400, resizable: true, minWidth: 200 },
        { key: 'b', dataIndex: 'b', width: 400, resizable: true },
      ].map(col => ({ ...col, width: widthMap.get(col.key ?? col.dataIndex) || col.width }));

      return (
        <Table
          data={[{ a: '123', b: '123', key: '1' }]}
          columns={columns}
          scroll={{ x: columns.reduce((t, c) => t + c.width, 0) }}
          onColumnResizeEnd={info => {
            setWidthMap(prev => {
              const result = new Map(prev);
              info.columnWidths.forEach(i => {
                result.set(i.columnKey, i.width);
              });
              return result;
            });
            onColumnResizeEnd(info);
          }}
        />
      );
    };
    const { container } = render(<App />);

    await triggerResize(container.querySelector('.rc-table'));

    doMouseMove(container.querySelectorAll('.rc-table-cell-resize-handle')[0], 300, 0);

    expect(onColumnResizeEnd).toHaveBeenCalledWith({
      columnKey: 'a',
      width: 200,
      columnWidths: [
        { columnKey: 'a', width: 200 },
        { columnKey: 'b', width: 585 },
        // scrollbar 15px
      ],
    });
  });
});
