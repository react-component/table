import React from 'react';
import { mount } from 'enzyme';
import { resetWarned } from 'rc-util/lib/warning';
import Table from '../src';
import type { TableProps } from '../src/Table';

describe('Table.Hover', () => {
  const data = [
    { key: 'key0', name: 'Lucy' },
    { key: 'key1', name: 'Jack' },
  ];
  const createTable = (props?: TableProps) => {
    const columns = [{ title: 'Name', dataIndex: 'name', key: 'name' }];

    return <Table columns={columns} data={data} {...props} />;
  };

  it('basic', () => {
    const wrapper = mount(createTable());
    wrapper.find('tbody td').first().simulate('mouseEnter');
    expect(wrapper.exists('.rc-table-cell-row-hover')).toBeTruthy();

    wrapper.find('tbody td').first().simulate('mouseLeave');
    expect(wrapper.exists('.rc-table-cell-row-hover')).toBeFalsy();
  });

  it('works on shouldCellUpdate', () => {
    const wrapper = mount(
      createTable({
        columns: [{ title: 'Name', dataIndex: 'name', key: 'name', shouldCellUpdate: () => false }],
      }),
    );

    wrapper.find('tbody td').first().simulate('mouseEnter');
    expect(wrapper.exists('.rc-table-cell-row-hover')).toBeTruthy();

    wrapper.find('tbody td').first().simulate('mouseLeave');
    expect(wrapper.exists('.rc-table-cell-row-hover')).toBeFalsy();
  });

  it('warning if use `render` for rowSpan', () => {
    resetWarned();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const wrapper = mount(
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
    expect(wrapper.find('tbody td')).toHaveLength(3);

    // Hover 0-0
    wrapper.find('tbody td').at(0).simulate('mouseEnter');
    expect(wrapper.find('td.rc-table-cell-row-hover')).toHaveLength(2);

    // Hover 0-1
    wrapper.find('tbody td').at(1).simulate('mouseEnter');
    expect(wrapper.find('td.rc-table-cell-row-hover')).toHaveLength(1);

    // Mouse leave
    wrapper.find('tbody td').at(1).simulate('mouseLeave');
    expect(wrapper.exists('.rc-table-cell-row-hover')).toBeFalsy();

    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `columns.render` return cell props is deprecated with perf issue, please use `onCell` instead.',
    );
    errorSpy.mockRestore();
  });

  it('onCell should work', () => {
    const wrapper = mount(
      createTable({
        columns: [
          {
            dataIndex: 'name',
            onCell: (_, index) => {
              if (index === 0) {
                return {
                  rowSpan: 2,
                };
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
    expect(wrapper.find('tbody td')).toHaveLength(3);

    // Hover 0-0
    wrapper.find('tbody td').at(0).simulate('mouseEnter');
    expect(wrapper.find('td.rc-table-cell-row-hover')).toHaveLength(3);

    // Hover 0-1
    wrapper.find('tbody td').at(1).simulate('mouseEnter');
    expect(wrapper.find('td.rc-table-cell-row-hover')).toHaveLength(2);

    // Mouse leave
    wrapper.find('tbody td').at(1).simulate('mouseLeave');
    expect(wrapper.exists('.rc-table-cell-row-hover')).toBeFalsy();
  });

  describe('perf', () => {
    it('legacy mode should render every time', () => {
      let renderTimes = 0;

      const wrapper = mount(
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

      expect(wrapper.exists('.rc-table-cell-row-hover')).toBeFalsy();

      // Hover 0-0
      renderTimes = 0;
      wrapper.find('tbody td').at(0).simulate('mouseEnter');
      expect(wrapper.find('td.rc-table-cell-row-hover')).toHaveLength(1);
      expect(renderTimes).toBe(1);

      // Hover 0-1
      renderTimes = 0;
      wrapper.find('tbody td').at(1).simulate('mouseEnter');
      expect(wrapper.find('td.rc-table-cell-row-hover')).toHaveLength(1);
      expect(renderTimes).toBe(2);

      // Mouse leave
      renderTimes = 0;
      wrapper.find('tbody td').at(1).simulate('mouseLeave');
      expect(wrapper.exists('.rc-table-cell-row-hover')).toBeFalsy();
      expect(renderTimes).toBe(1);
    });

    it('perf mode to save render times', () => {
      let renderTimes = 0;

      const wrapper = mount(
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

      expect(wrapper.exists('.rc-table-cell-row-hover')).toBeFalsy();

      // Hover 0-0
      renderTimes = 0;
      wrapper.find('tbody td').at(0).simulate('mouseEnter');
      expect(wrapper.find('td.rc-table-cell-row-hover')).toHaveLength(1);
      expect(renderTimes).toBe(0);

      // Hover 0-1
      renderTimes = 0;
      wrapper.find('tbody td').at(1).simulate('mouseEnter');
      expect(wrapper.find('td.rc-table-cell-row-hover')).toHaveLength(1);
      expect(renderTimes).toBe(0);

      // Mouse leave
      renderTimes = 0;
      wrapper.find('tbody td').at(1).simulate('mouseLeave');
      expect(wrapper.exists('.rc-table-cell-row-hover')).toBeFalsy();
      expect(renderTimes).toBe(0);
    });
  });
});
