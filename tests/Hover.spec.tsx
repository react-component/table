import { render, fireEvent } from '@testing-library/react';
import toArray from '@rc-component/util/lib/Children/toArray';
import { resetWarned } from '@rc-component/util/lib/warning';
import React from 'react';
import Table from '../src';
import type { TableProps } from '../src/Table';

describe('Table.Hover', () => {
  const hoverClassName = 'rc-table-cell-row-hover';
  const data = [
    { key: 'key0', name: 'Lucy' },
    { key: 'key1', name: 'Jack' },
  ];
  const createTable = (props?: TableProps) => {
    const columns = [{ title: 'Name', dataIndex: 'name', key: 'name' }];

    return <Table columns={columns} data={data} {...props} />;
  };

  it('basic', () => {
    const { container } = render(createTable());
    const tds = container.querySelectorAll('tbody td');
    fireEvent.mouseEnter(tds[0]);
    expect(container.querySelector('.rc-table-cell-row-hover')).toBeTruthy();

    fireEvent.mouseLeave(tds[0]);
    expect(container.querySelector('.rc-table-cell-row-hover')).toBeFalsy();
  });

  it('works on shouldCellUpdate', () => {
    const { container } = render(
      createTable({
        columns: [{ title: 'Name', dataIndex: 'name', key: 'name', shouldCellUpdate: () => false }],
      }),
    );

    const tds = container.querySelectorAll('tbody td');
    fireEvent.mouseEnter(tds[0]);
    expect(container.querySelector('.rc-table-cell-row-hover')).toBeTruthy();

    fireEvent.mouseLeave(tds[0]);
    expect(container.querySelector('.rc-table-cell-row-hover')).toBeFalsy();
  });

  it('warning if use `render` for rowSpan', () => {
    resetWarned();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(
      createTable({
        columns: [
          {
            dataIndex: 'name',
            render: (name, _, index) => {
              if (index === 0) {
                return {
                  children: name,
                  props: { rowSpan: 2 },
                };
              }
              return {
                props: { rowSpan: 0 },
              };
            },
          },
          {
            dataIndex: 'key',
          },
        ],
      }),
    );

    // Merge row check
    expect(container.querySelectorAll('tbody td').length).toBe(3);

    const tds = container.querySelectorAll('tbody td');
    // Hover 0-0
    fireEvent.mouseEnter(tds[0]);
    expect(container.querySelectorAll('td.rc-table-cell-row-hover').length).toBe(2);

    // Hover 0-1
    fireEvent.mouseEnter(tds[1]);
    expect(container.querySelectorAll('td.rc-table-cell-row-hover').length).toBe(1);

    // Mouse leave
    fireEvent.mouseLeave(tds[1]);
    expect(container.querySelector('.rc-table-cell-row-hover')).toBeFalsy();

    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `columns.render` return cell props is deprecated with perf issue, please use `onCell` instead.',
    );
    errorSpy.mockRestore();
  });

  it('onCell should work', () => {
    const { container } = render(
      createTable({
        columns: [
          {
            dataIndex: 'name',
            onCell: (_, index) => {
              if (index === 0) {
                return { rowSpan: 2 };
              }
              return { rowSpan: 0 };
            },
          },
          {
            dataIndex: 'key',
          },
        ],
      }),
    );

    // Merge row check
    expect(container.querySelectorAll('tbody td').length).toBe(3);

    const tds = container.querySelectorAll('tbody td');
    // Hover 0-0
    fireEvent.mouseEnter(tds[0]);
    expect(container.querySelectorAll('td.rc-table-cell-row-hover').length).toBe(3);

    // Hover 0-1
    fireEvent.mouseEnter(tds[1]);
    expect(container.querySelectorAll('td.rc-table-cell-row-hover').length).toBe(2);

    // Mouse leave
    fireEvent.mouseLeave(tds[1]);
    expect(container.querySelector('.rc-table-cell-row-hover')).toBeFalsy();
  });

  it('does not let expanded row offset rowSpan affect hover range', () => {
    const { container } = render(
      <Table
        rowKey="key"
        columns={[
          {
            dataIndex: 'group',
            onCell: (_, index) => {
              if (index === 0) {
                return { rowSpan: 2 };
              }
              if (index === 1) {
                return { rowSpan: 0 };
              }
              return {};
            },
          },
          Table.EXPAND_COLUMN,
          {
            dataIndex: 'name',
          },
        ]}
        data={[
          { key: 'a', group: 'Group 1', name: 'Alpha' },
          { key: 'b', group: 'Group 1', name: 'Beta' },
          { key: 'c', group: 'Group 2', name: 'Gamma' },
        ]}
        expandable={{
          expandedRowOffset: 1,
          expandedRowKeys: ['a'],
          expandedRowRender: record => <span>expanded {record.key}</span>,
        }}
      />,
    );

    const getCell = (text: string) => {
      const cell = Array.from(container.querySelectorAll<HTMLTableCellElement>('tbody td')).find(
        cell => cell.textContent === text,
      );
      expect(cell).toBeTruthy();
      return cell!;
    };

    const groupCell = getCell('Group 1');
    const betaCell = getCell('Beta');
    const gammaCell = getCell('Gamma');

    expect(groupCell.getAttribute('rowspan')).toBe('3');

    fireEvent.mouseEnter(groupCell);
    expect(groupCell.classList.contains(hoverClassName)).toBe(true);
    expect(betaCell.classList.contains(hoverClassName)).toBe(true);
    expect(gammaCell.classList.contains(hoverClassName)).toBe(false);

    fireEvent.mouseEnter(gammaCell);
    expect(groupCell.classList.contains(hoverClassName)).toBe(false);
    expect(gammaCell.classList.contains(hoverClassName)).toBe(true);
  });

  describe('perf', () => {
    it('legacy mode should render every time', () => {
      let renderTimes = 0;

      const { container } = render(
        createTable({
          columns: [
            {
              render: () => {
                renderTimes += 1;
                return {
                  children: null,
                };
              },
            },
          ],
        }),
      );

      expect(container.querySelector('.rc-table-cell-row-hover')).toBeFalsy();

      const tds = container.querySelectorAll('tbody td');
      // Hover 0-0
      renderTimes = 0;
      fireEvent.mouseEnter(tds[0]);
      expect(container.querySelectorAll('td.rc-table-cell-row-hover').length).toBe(1);
      expect(renderTimes).toBe(1);

      // Hover 0-1
      renderTimes = 0;
      fireEvent.mouseEnter(tds[1]);
      expect(container.querySelectorAll('td.rc-table-cell-row-hover').length).toBe(1);
      expect(renderTimes).toBe(2);

      // Mouse leave
      renderTimes = 0;
      fireEvent.mouseLeave(tds[1]);
      expect(container.querySelector('.rc-table-cell-row-hover')).toBeFalsy();
      expect(renderTimes).toBe(1);
    });

    it('perf mode to save render times', () => {
      let renderTimes = 0;

      const { container } = render(
        createTable({
          columns: [
            {
              render: () => {
                renderTimes += 1;
                return null;
              },
            },
          ],
        }),
      );

      expect(container.querySelector('.rc-table-cell-row-hover')).toBeFalsy();

      const tds = container.querySelectorAll('tbody td');
      // Hover 0-0
      renderTimes = 0;
      fireEvent.mouseEnter(tds[0]);
      expect(container.querySelectorAll('td.rc-table-cell-row-hover').length).toBe(1);
      expect(renderTimes).toBe(0);

      // Hover 0-1
      renderTimes = 0;
      fireEvent.mouseEnter(tds[1]);
      expect(container.querySelectorAll('td.rc-table-cell-row-hover').length).toBe(1);
      expect(renderTimes).toBe(0);

      // Mouse leave
      renderTimes = 0;
      fireEvent.mouseLeave(tds[1]);
      expect(container.querySelector('.rc-table-cell-row-hover')).toBeFalsy();
      expect(renderTimes).toBe(0);
    });
  });

  it('perf', () => {
    const renderTimes: Record<string, any> = {};

    const TD = (props: any) => {
      const children = toArray(props.children);
      const first = children[0] as unknown as string;

      renderTimes[first] = (renderTimes[first] || 0) + 1;
      return <td {...props} />;
    };

    const { container } = render(
      createTable({
        components: {
          body: {
            cell: TD,
          },
        },
      }),
    );

    const firstMountTimes = renderTimes.Jack;
    const tds = container.querySelectorAll('tbody td');

    fireEvent.mouseEnter(tds[0]);
    expect(container.querySelector('.rc-table-cell-row-hover')).toBeTruthy();

    fireEvent.mouseLeave(tds[0]);
    expect(container.querySelector('.rc-table-cell-row-hover')).toBeFalsy();

    expect(firstMountTimes).toEqual(renderTimes.Jack);
    expect(renderTimes.Lucy).toBeGreaterThan(renderTimes.Jack);
  });
});
