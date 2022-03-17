import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { resetWarned } from 'rc-util/lib/warning';
import { spyElementPrototype } from 'rc-util/lib/test/domHook';
import Table from '../src';

describe('Table.Expand', () => {
  const expandedRowRender = () => <p>extra data</p>;

  const sampleColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
  ];

  const sampleData = [
    { key: 0, name: 'Lucy', age: 27 },
    { key: 1, name: 'Jack', age: 28 },
  ];

  const createTable = props => <Table columns={sampleColumns} data={sampleData} {...props} />;

  it('renders expand row correctly', () => {
    resetWarned();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const wrapper = mount(createTable({ expandedRowRender }));
    expect(wrapper.find('tbody tr')).toHaveLength(2);
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: expanded related props have been moved into `expandable`.',
    );
    errorSpy.mockRestore();
  });

  it('pass proper parameters to expandedRowRender', () => {
    const rowRender = jest.fn(() => <div>expanded row</div>);
    const expandableProps = props => ({ expandable: { expandedRowRender: rowRender, ...props } });
    const wrapper = mount(createTable(expandableProps()));
    wrapper.setProps(expandableProps({ expandedRowKeys: [0] }));
    expect(rowRender).toHaveBeenLastCalledWith(sampleData[0], 0, 1, true);
    wrapper.setProps(expandableProps({ expandedRowKeys: [] }));
    expect(rowRender).toHaveBeenLastCalledWith(sampleData[0], 0, 1, false);
  });

  it('renders tree row correctly', () => {
    const data = [
      {
        key: 0,
        name: 'Lucy',
        age: 27,
        children: [{ key: 2, name: 'Jim', age: 1 }],
      },
      { key: 1, name: 'Jack', age: 28 },
    ];
    const wrapper = mount(createTable({ data, expandable: { defaultExpandAllRows: true } }));
    expect(wrapper.find('tbody tr')).toHaveLength(3);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('renders tree row correctly with different children', () => {
    const data = [
      {
        key: 0,
        name: 'Lucy',
        age: 27,
        children: [{ key: 2, name: 'Jim', age: 1 }],
      },
      { key: 1, name: 'Jack', age: 28 },
      { key: 2, name: 'Jack', age: 28, children: null },
      { key: 3, name: 'Jack', age: 28, children: [] },
      { key: 4, name: 'Jack', age: 28, children: undefined },
      { key: 5, name: 'Jack', age: 28, children: false },
    ];
    const wrapper = mount(createTable({ data }));
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('not use nest when children is invalidate', () => {
    const data = [
      { key: 2, name: 'Jack', age: 28, children: null },
      { key: 4, name: 'Jack', age: 28, children: undefined },
      { key: 5, name: 'Jack', age: 28, children: false },
    ];
    const wrapper = mount(createTable({ data }));
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('childrenColumnName', () => {
    const data = [
      {
        key: 0,
        name: 'Lucy',
        age: 27,
        list: [{ key: 2, name: 'Jim', age: 1 }],
      },
      { key: 1, name: 'Jack', age: 28 },
    ];
    const wrapper = mount(
      createTable({ data, expandable: { defaultExpandAllRows: true, childrenColumnName: 'list' } }),
    );
    expect(wrapper.find('tbody tr')).toHaveLength(3);
    expect(wrapper.render()).toMatchSnapshot();
  });

  describe('renders fixed column correctly', () => {
    let domSpy;

    beforeAll(() => {
      domSpy = spyElementPrototype(HTMLDivElement, 'offsetWidth', {
        get: () => 1128,
      });
    });

    afterAll(() => {
      domSpy.mockRestore();
    });

    it('work', () => {
      const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name', fixed: true },
        { title: 'Age', dataIndex: 'age', key: 'age' },
        { title: 'Gender', dataIndex: 'gender', key: 'gender', fixed: 'right' },
      ];
      const data = [
        { key: 0, name: 'Lucy', age: 27, gender: 'F' },
        { key: 1, name: 'Jack', age: 28, gender: 'M' },
      ];
      const wrapper = mount(
        createTable({
          columns,
          data,
          scroll: { x: 903 },
          expandable: { expandedRowRender, defaultExpandAllRows: true },
        }),
      );
      act(() => {
        wrapper.find('ResizeObserver').first().props().onResize({ width: 1128 });
      });
      wrapper.update();
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  it('work in expandable fix', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age' },
      { title: 'Gender', dataIndex: 'gender', key: 'gender' },
    ];
    const data = [
      { key: 0, name: 'Lucy', age: 27, gender: 'F' },
      { key: 1, name: 'Jack', age: 28, gender: 'M' },
    ];
    const wrapper = mount(
      createTable({
        columns,
        data,
        scroll: { x: 903 },
        expandable: { expandedRowRender, fixed: true },
      }),
    );
    const wrapper2 = mount(
      createTable({
        columns,
        data,
        scroll: { x: 903 },
        expandable: { expandedRowRender, fixed: true, expandIconColumnIndex: 3 },
      }),
    );
    expect(wrapper.render()).toMatchSnapshot();
    expect(wrapper2.render()).toMatchSnapshot();
  });

  it('does not crash if scroll is not set', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age' },
      { title: 'Gender', dataIndex: 'gender', key: 'gender' },
    ];
    const data = [
      { key: 0, name: 'Lucy', age: 27, gender: 'F' },
      { key: 1, name: 'Jack', age: 28, gender: 'M' },
    ];
    const wrapper = mount(
      createTable({
        columns,
        data,
        scroll: {},
        expandable: { expandedRowRender, fixed: true },
      }),
    );
    const wrapper2 = mount(
      createTable({
        columns,
        data,
        expandable: { expandedRowRender, fixed: true },
      }),
    );
    expect(wrapper.render()).toMatchSnapshot();
    expect(wrapper2.render()).toMatchSnapshot();
  });

  it('expandable fix not when expandIconColumnIndex', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age' },
      { title: 'Gender', dataIndex: 'gender', key: 'gender' },
    ];
    const data = [
      { key: 0, name: 'Lucy', age: 27, gender: 'F' },
      { key: 1, name: 'Jack', age: 28, gender: 'M' },
    ];
    const wrapper = mount(
      createTable({
        columns,
        data,
        scroll: { x: 903 },
        expandable: { expandedRowRender, fixed: 'left', expandIconColumnIndex: 1 },
      }),
    );
    const wrapper2 = mount(
      createTable({
        columns,
        data,
        scroll: { x: 903 },
        expandable: { expandedRowRender, fixed: 'right', expandIconColumnIndex: 2 },
      }),
    );
    expect(wrapper.find('.rc-table-has-fix-left').length).toBe(0);
    expect(wrapper2.find('.rc-table-has-fix-right').length).toBe(0);
  });

  describe('config expand column index', () => {
    it('not show EXPAND_COLUMN if expandable is false', () => {
      resetWarned();
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const wrapper = mount(
        createTable({
          columns: [...sampleColumns, Table.EXPAND_COLUMN],
        }),
      );

      expect(wrapper.exists('.rc-table-row-expand-icon-cell')).toBeFalsy();

      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: `expandable` is not config but there exist `EXPAND_COLUMN` in `columns`.',
      );
      errorSpy.mockRestore();
    });

    it('renders expand icon to the specify column', () => {
      resetWarned();
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const wrapper = mount(
        createTable({
          expandable: {
            expandedRowRender,
            expandIconColumnIndex: 1,
          },
        }),
      );
      expect(
        wrapper.find('tbody tr td').at(1).hasClass('rc-table-row-expand-icon-cell'),
      ).toBeTruthy();

      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: `expandIconColumnIndex` is deprecated. Please use `Table.EXPAND_COLUMN` in `columns` instead.',
      );
      errorSpy.mockRestore();
    });

    it('order with EXPAND_COLUMN', () => {
      const wrapper = mount(
        createTable({
          columns: [...sampleColumns, Table.EXPAND_COLUMN],
          expandable: {
            expandedRowRender,
          },
        }),
      );

      expect(
        wrapper.find('tbody tr td').at(2).hasClass('rc-table-row-expand-icon-cell'),
      ).toBeTruthy();
    });

    it('de-duplicate of EXPAND_COLUMN', () => {
      resetWarned();
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const wrapper = mount(
        createTable({
          columns: [Table.EXPAND_COLUMN, ...sampleColumns, Table.EXPAND_COLUMN],
          expandable: {
            expandedRowRender,
          },
        }),
      );

      expect(
        wrapper.find('tbody tr td').at(0).hasClass('rc-table-row-expand-icon-cell'),
      ).toBeTruthy();
      expect(wrapper.find('tbody tr').first().find('td')).toHaveLength(3);

      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: There exist more than one `EXPAND_COLUMN` in `columns`.',
      );

      errorSpy.mockRestore();
    });
  });

  describe('hide expandColumn', () => {
    // https://github.com/ant-design/ant-design/issues/24129
    it('should not render expand icon column when expandIconColumnIndex is negative', () => {
      const wrapper = mount(
        createTable({
          expandable: {
            expandedRowRender,
            expandIconColumnIndex: -1,
          },
        }),
      );
      expect(wrapper.find('.rc-table-row-expand-icon-cell').length).toBe(0);
    });

    it('showExpandColumn = false', () => {
      const wrapper = mount(
        createTable({
          expandable: {
            expandedRowRender,
            showExpandColumn: false,
          },
        }),
      );
      expect(wrapper.find('.rc-table-row-expand-icon-cell').length).toBe(0);
    });
  });

  it('renders a custom icon', () => {
    function CustomExpandIcon(props) {
      return (
        <a className="expand-row-icon" onClick={e => props.onExpand(props.record, e)}>
          <i className="some-class" />
        </a>
      );
    }
    const wrapper = mount(
      createTable({
        expandable: {
          expandedRowRender,
          expandIcon: ({ onExpand, record }) => (
            <CustomExpandIcon onExpand={onExpand} record={record} />
          ),
        },
      }),
    );
    expect(wrapper.find('a.expand-row-icon').length).toBeTruthy();
  });

  it('expand all rows by default', () => {
    const wrapper = mount(
      createTable({
        expandedRowRender,
        defaultExpandAllRows: true,
      }),
    );
    expect(wrapper.find('tbody tr')).toHaveLength(4);
  });

  it('expand rows by defaultExpandedRowKeys', () => {
    const wrapper = mount(
      createTable({
        expandable: {
          expandedRowRender,
          defaultExpandedRowKeys: [1],
        },
      }),
    );
    expect(wrapper.find('tbody tr')).toHaveLength(3);
    expect(wrapper.find('tbody tr').at(2).hasClass('rc-table-expanded-row')).toBeTruthy();
  });

  it('controlled by expandedRowKeys', () => {
    const wrapper = mount(
      createTable({
        expandedRowRender,
        expandedRowKeys: [0],
      }),
    );
    expect(wrapper.find('tbody tr')).toHaveLength(3);
    expect(wrapper.find('tbody tr').at(1).hasClass('rc-table-expanded-row')).toBeTruthy();

    wrapper.setProps({ expandedRowKeys: [1] });
    expect(wrapper.find('tbody tr')).toHaveLength(4);
    expect(wrapper.find('tbody tr').at(1).hasClass('rc-table-expanded-row')).toBeTruthy();
    expect(wrapper.find('tbody tr').at(1).props().style.display).toEqual('none');
    expect(wrapper.find('tbody tr').at(3).hasClass('rc-table-expanded-row')).toBeTruthy();
  });

  it('renders expend row class correctly', () => {
    const expandedRowClassName = jest.fn().mockReturnValue('expand-row-test-class-name');
    const wrapper = mount(
      createTable({
        expandable: {
          expandedRowRender,
          expandedRowKeys: [0],
          expandedRowClassName,
        },
      }),
    );

    expect(wrapper.find('tbody tr').at(1).hasClass('expand-row-test-class-name')).toBeTruthy();
  });

  it('fires expand change event', () => {
    const onExpand = jest.fn();
    const wrapper = mount(
      createTable({
        expandable: {
          expandedRowRender,
          onExpand,
        },
      }),
    );
    wrapper.find('.rc-table-row-expand-icon').first().simulate('click');
    expect(onExpand).toHaveBeenCalledWith(true, sampleData[0]);

    wrapper.find('.rc-table-row-expand-icon').first().simulate('click');
    expect(onExpand).toHaveBeenCalledWith(false, sampleData[0]);
  });

  it('fires onExpandedRowsChange event', () => {
    const onExpandedRowsChange = jest.fn();
    const wrapper = mount(
      createTable({
        expandedRowRender,
        onExpandedRowsChange,
      }),
    );
    wrapper.find('.rc-table-row-expand-icon').first().simulate('click');
    expect(onExpandedRowsChange).toHaveBeenCalledWith([0]);
  });

  it('show icon if use `expandIcon` & `expandRowByClick`', () => {
    const wrapper = mount(
      createTable({
        expandedRowRender,
        expandRowByClick: true,
        expandIcon: () => <span className="should-display" />,
        data: [{ key: 0, name: 'Lucy', age: 27, children: [{ key: 1, name: 'Jack', age: 28 }] }],
      }),
    );

    expect(wrapper.find('.should-display').length).toBeTruthy();
  });

  it('expandRowByClick', () => {
    const onExpand = jest.fn();
    const wrapper = mount(
      createTable({
        expandable: {
          expandedRowRender,
          expandRowByClick: true,
          onExpand,
        },
      }),
    );
    wrapper.find('tbody tr').first().simulate('click');
    expect(onExpand).toHaveBeenCalledWith(true, sampleData[0]);

    wrapper.find('tbody tr').first().simulate('click');
    expect(onExpand).toHaveBeenCalledWith(false, sampleData[0]);
  });

  it('some row should not expandable', () => {
    const wrapper = mount(
      createTable({
        expandable: {
          expandedRowRender,
          rowExpandable: ({ key }) => key === 1,
        },
      }),
    );

    expect(
      wrapper
        .find('tbody tr')
        .first()
        .find('.rc-table-row-expand-icon')
        .hasClass('rc-table-row-spaced'),
    ).toBeTruthy();
    expect(
      wrapper
        .find('tbody tr')
        .last()
        .find('.rc-table-row-expand-icon')
        .hasClass('rc-table-row-collapsed'),
    ).toBeTruthy();
  });

  // https://github.com/ant-design/ant-design/issues/21788
  it('`defaultExpandAllRows` with `childrenColumnName`', () => {
    const data = [
      {
        key: 0,
        sub: [{ key: 1, sub: [{ key: 2 }] }],
      },
    ];
    const wrapper = mount(
      createTable({ data, childrenColumnName: 'sub', expandable: { defaultExpandAllRows: true } }),
    );
    expect(wrapper.find('tbody tr')).toHaveLength(3);
  });

  // https://github.com/ant-design/ant-design/issues/23894
  it('should be collapsible when use `expandIcon` & `expandRowByClick`', () => {
    const data = [{ key: 0, name: 'Lucy', age: 27 }];
    const onExpand = jest.fn();
    const wrapper = mount(
      createTable({
        expandable: {
          expandedRowRender,
          expandRowByClick: true,
          onExpand,
          expandIcon: ({ onExpand: onIconExpand, record }) => (
            <span className="custom-expand-icon" onClick={() => onIconExpand(record)} />
          ),
        },
        data,
      }),
    );
    expect(wrapper.find('.rc-table-expanded-row').length).toBe(0);
    wrapper.find('.custom-expand-icon').first().simulate('click');
    expect(onExpand).toHaveBeenCalledWith(true, data[0]);
    expect(onExpand).toHaveBeenCalledTimes(1);
    expect(wrapper.find('.rc-table-expanded-row').first().getDOMNode().style.display).toBe('');
    wrapper.find('.custom-expand-icon').first().simulate('click');
    expect(onExpand).toHaveBeenCalledWith(false, data[0]);
    expect(onExpand).toHaveBeenCalledTimes(2);
    expect(wrapper.find('.rc-table-expanded-row').first().getDOMNode().style.display).toBe('none');
  });

  // https://github.com/ant-design/ant-design/issues/23894
  it('should be collapsible when `expandRowByClick` without custom `expandIcon`', () => {
    const data = [{ key: 0, name: 'Lucy', age: 27 }];
    const onExpand = jest.fn();
    const wrapper = mount(
      createTable({
        expandable: {
          expandedRowRender,
          expandRowByClick: true,
          onExpand,
        },
        data,
      }),
    );
    wrapper.find('.rc-table-row-expand-icon').first().simulate('click');
    expect(onExpand).toHaveBeenCalledWith(true, data[0]);
    expect(onExpand).toHaveBeenCalledTimes(1);
    wrapper.find('.rc-table-row-expand-icon').first().simulate('click');
    expect(onExpand).toHaveBeenCalledWith(false, data[0]);
    expect(onExpand).toHaveBeenCalledTimes(2);
  });

  it('should be collapsible when `expandRowByClick` with custom `expandIcon` and event.stopPropagation', () => {
    const data = [{ key: 0, name: 'Lucy', age: 27 }];
    const onExpand = jest.fn();
    const wrapper = mount(
      createTable({
        expandable: {
          expandedRowRender,
          expandRowByClick: true,
          onExpand,
          expandIcon: ({ onExpand: onIconExpand, record }) => (
            <span
              className="custom-expand-icon"
              onClick={e => {
                e.stopPropagation();
                onIconExpand(record);
              }}
            />
          ),
        },
        data,
      }),
    );
    wrapper.find('.custom-expand-icon').first().simulate('click');
    expect(onExpand).toHaveBeenCalledWith(true, data[0]);
    expect(onExpand).toHaveBeenCalledTimes(1);
    wrapper.find('.custom-expand-icon').first().simulate('click');
    expect(onExpand).toHaveBeenCalledWith(false, data[0]);
    expect(onExpand).toHaveBeenCalledTimes(2);
  });

  it('support invalid expandIcon', () => {
    const data = [{ key: 0, name: 'Lucy', age: 27 }];
    const onExpand = jest.fn();
    const wrapper = mount(
      createTable({
        expandable: {
          expandedRowRender,
          expandRowByClick: true,
          onExpand,
          expandIcon: () => null,
        },
        data,
      }),
    );
    expect(wrapper.find('.rc-table-expanded-row').length).toBe(0);
  });

  it('warning for use `expandedRowRender` and nested table in the same time', () => {
    resetWarned();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount(createTable({ expandedRowRender, data: [{ children: [] }] }));
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `expandedRowRender` should not use with nested Table',
    );
    errorSpy.mockRestore();
  });
});
