import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { spyElementPrototype } from '@rc-component/util/lib/test/domHook';
import { resetWarned } from '@rc-component/util/lib/warning';
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
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(createTable({ expandedRowRender }));
    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: expanded related props have been moved into `expandable`.',
    );
    errorSpy.mockRestore();
  });

  it('pass proper parameters to expandedRowRender', () => {
    const rowRender = vi.fn(() => <div>expanded row</div>);
    const expandableProps = props => ({ expandable: { expandedRowRender: rowRender, ...props } });
    const { rerender } = render(createTable(expandableProps()));
    rerender(createTable(expandableProps({ expandedRowKeys: [0] })));
    expect(rowRender).toHaveBeenLastCalledWith(sampleData[0], 0, 1, true);
    rerender(createTable(expandableProps({ expandedRowKeys: [] })));
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
    const { container } = render(createTable({ data, expandable: { defaultExpandAllRows: true } }));
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
    expect(container.firstChild).toMatchSnapshot();
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
    const { container } = render(createTable({ data }));
    expect(container.firstChild).toMatchSnapshot();
  });

  it('not use nest when children is invalidate', () => {
    const data = [
      { key: 2, name: 'Jack', age: 28, children: null },
      { key: 4, name: 'Jack', age: 28, children: undefined },
      { key: 5, name: 'Jack', age: 28, children: false },
    ];
    const { container } = render(createTable({ data }));
    expect(container.firstChild).toMatchSnapshot();
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
    const { container } = render(
      createTable({ data, expandable: { defaultExpandAllRows: true, childrenColumnName: 'list' } }),
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
    expect(container.firstChild).toMatchSnapshot();
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
      const { container, rerender } = render(
        createTable({
          columns,
          data,
          scroll: { x: 903 },
          expandable: { expandedRowRender, defaultExpandAllRows: true },
        }),
      );
      act(() => {
        // 模拟 ResizeObserver onResize 回调
        const resizeObserver = container.querySelector('ResizeObserver');
        if (resizeObserver && resizeObserver.onResize) {
          resizeObserver.onResize({ width: 1128 });
        }
      });
      rerender(
        createTable({
          columns,
          data,
          scroll: { x: 903 },
          expandable: { expandedRowRender, defaultExpandAllRows: true },
        }),
      );
      expect(container.firstChild).toMatchSnapshot();
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
    const { container, rerender } = render(
      createTable({
        columns,
        data,
        scroll: { x: 903 },
        expandable: { expandedRowRender, fixed: true },
      }),
    );
    const { container: container2, rerender: rerender2 } = render(
      createTable({
        columns,
        data,
        scroll: { x: 903 },
        expandable: { expandedRowRender, fixed: true, expandIconColumnIndex: 3 },
      }),
    );
    expect(container.firstChild).toMatchSnapshot();
    expect(container2.firstChild).toMatchSnapshot();
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
    const { container, rerender } = render(
      createTable({
        columns,
        data,
        scroll: {},
        expandable: { expandedRowRender, fixed: true },
      }),
    );
    const { container: container2, rerender: rerender2 } = render(
      createTable({
        columns,
        data,
        expandable: { expandedRowRender, fixed: true },
      }),
    );
    expect(container.firstChild).toMatchSnapshot();
    expect(container2.firstChild).toMatchSnapshot();
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
    const { container, rerender } = render(
      createTable({
        columns,
        data,
        scroll: { x: 903 },
        expandable: { expandedRowRender, fixed: 'left', expandIconColumnIndex: 1 },
      }),
    );
    const { container: container2, rerender: rerender2 } = render(
      createTable({
        columns,
        data,
        scroll: { x: 903 },
        expandable: { expandedRowRender, fixed: 'right', expandIconColumnIndex: 2 },
      }),
    );
    expect(container.querySelectorAll('.rc-table-has-fix-left').length).toBe(0);
    expect(container2.querySelectorAll('.rc-table-has-fix-right').length).toBe(0);
  });

  it('fixed in expandable Fixed in expandable', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age' },
      { title: 'Gender', dataIndex: 'gender', key: 'gender' },
    ];
    const data = [
      { key: 0, name: 'Lucy', age: 27, gender: 'F' },
      { key: 1, name: 'Jack', age: 28, gender: 'M' },
    ];
    const { container, rerender } = render(
      createTable({
        columns,
        data,
        scroll: { x: 903 },
        expandable: { expandedRowRender, fixed: 'left' },
      }),
    );
    const { container: container2, rerender: rerender2 } = render(
      createTable({
        columns,
        data,
        scroll: { x: 903 },
        expandable: { expandedRowRender, fixed: 'right' },
      }),
    );
    expect(container.querySelectorAll('.rc-table-has-fix-left').length).toBe(1);
    expect(container2.querySelectorAll('.rc-table-has-fix-right').length).toBe(1);
  });

  describe('config expand column index', () => {
    it('not show EXPAND_COLUMN if expandable is false', () => {
      resetWarned();
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { container } = render(
        createTable({
          columns: [...sampleColumns, Table.EXPAND_COLUMN],
        }),
      );

      expect(container.querySelectorAll('.rc-table-row-expand-icon-cell')).toHaveLength(0);

      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: `expandable` is not config but there exist `EXPAND_COLUMN` in `columns`.',
      );
      errorSpy.mockRestore();
    });

    it('renders expand icon to the specify column', () => {
      resetWarned();
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { container } = render(
        createTable({
          expandable: {
            expandedRowRender,
            expandIconColumnIndex: 1,
          },
        }),
      );
      expect(
        container
          .querySelectorAll('tbody tr td')[1]
          .classList.contains('rc-table-row-expand-icon-cell'),
      ).toBeTruthy();

      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: `expandIconColumnIndex` is deprecated. Please use `Table.EXPAND_COLUMN` in `columns` instead.',
      );
      errorSpy.mockRestore();
    });

    it('order with EXPAND_COLUMN', () => {
      const { container } = render(
        createTable({
          columns: [...sampleColumns, Table.EXPAND_COLUMN],
          expandable: {
            expandedRowRender,
          },
        }),
      );

      expect(
        container
          .querySelectorAll('tbody tr td')[2]
          .classList.contains('rc-table-row-expand-icon-cell'),
      ).toBeTruthy();
    });

    it('de-duplicate of EXPAND_COLUMN', () => {
      resetWarned();
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { container } = render(
        createTable({
          columns: [Table.EXPAND_COLUMN, ...sampleColumns, Table.EXPAND_COLUMN],
          expandable: {
            expandedRowRender,
          },
        }),
      );

      expect(
        container
          .querySelectorAll('tbody tr td')[0]
          .classList.contains('rc-table-row-expand-icon-cell'),
      ).toBeTruthy();
      expect(container.querySelectorAll('tbody tr')[0].querySelectorAll('td')).toHaveLength(3);

      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: There exist more than one `EXPAND_COLUMN` in `columns`.',
      );

      errorSpy.mockRestore();
    });
  });

  describe('hide expandColumn', () => {
    // https://github.com/ant-design/ant-design/issues/24129
    it('should not render expand icon column when expandIconColumnIndex is negative', () => {
      const { container } = render(
        createTable({
          expandable: {
            expandedRowRender,
            expandIconColumnIndex: -1,
          },
        }),
      );
      expect(container.querySelectorAll('.rc-table-row-expand-icon-cell')).toHaveLength(0);
    });

    it('showExpandColumn = false', () => {
      const { container } = render(
        createTable({
          expandable: {
            expandedRowRender,
            showExpandColumn: false,
          },
        }),
      );
      expect(container.querySelectorAll('.rc-table-row-expand-icon-cell')).toHaveLength(0);
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
    const { container } = render(
      createTable({
        expandable: {
          expandedRowRender,
          expandIcon: ({ onExpand, record }) => (
            <CustomExpandIcon onExpand={onExpand} record={record} />
          ),
        },
      }),
    );
    expect(container.querySelector('a.expand-row-icon')).toBeTruthy();
  });

  it('expand all rows by default', () => {
    const { container } = render(
      createTable({
        expandedRowRender,
        defaultExpandAllRows: true,
      }),
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(4);
  });

  it('expand rows by defaultExpandedRowKeys', () => {
    const { container } = render(
      createTable({
        expandable: {
          expandedRowRender,
          defaultExpandedRowKeys: [1],
        },
      }),
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
    expect(
      container.querySelectorAll('tbody tr')[2].classList.contains('rc-table-expanded-row'),
    ).toBeTruthy();
  });

  it('controlled by expandedRowKeys', () => {
    const { container, rerender } = render(
      createTable({
        expandedRowRender,
        expandedRowKeys: [0],
      }),
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
    expect(
      container.querySelectorAll('tbody tr')[1].classList.contains('rc-table-expanded-row'),
    ).toBeTruthy();

    rerender(createTable({ expandedRowRender, expandedRowKeys: [1] }));
    expect(container.querySelectorAll('tbody tr')).toHaveLength(4);
    expect(
      container.querySelectorAll('tbody tr')[1].classList.contains('rc-table-expanded-row'),
    ).toBeTruthy();
    expect(container.querySelectorAll('tbody tr')[1].style.display).toEqual('none');
    expect(
      container.querySelectorAll('tbody tr')[3].classList.contains('rc-table-expanded-row'),
    ).toBeTruthy();
  });

  it('renders expend row class correctly', () => {
    const expandedRowClassName = vi.fn().mockReturnValue('expand-row-test-class-name');
    const { container } = render(
      createTable({
        expandable: {
          expandedRowRender,
          expandedRowKeys: [0],
          expandedRowClassName,
        },
      }),
    );

    expect(
      container.querySelectorAll('tbody tr')[1].classList.contains('expand-row-test-class-name'),
    ).toBeTruthy();
  });

  it("renders expend row class correctly when it's string", () => {
    const expandedRowClassName = 'expand-row-test-str-class-name';
    const { container } = render(
      createTable({
        expandable: {
          expandedRowRender,
          expandedRowKeys: [0],
          expandedRowClassName,
        },
      }),
    );

    expect(
      container.querySelectorAll('tbody tr')[1].classList.contains(expandedRowClassName),
    ).toBeTruthy();
  });

  it('renders expend row class correctly using children without expandedRowRender', () => {
    const expandedRowClassName = vi.fn().mockReturnValue('expand-row-test-class-name');

    const _data = [{ ...sampleData[0], children: [sampleData[1]] }];

    const { container } = render(
      createTable({
        data: _data,
        expandable: {
          expandedRowKeys: [0],
          expandedRowClassName,
        },
      }),
    );

    expect(
      container.querySelectorAll('tbody tr')[1].classList.contains('expand-row-test-class-name'),
    ).toBeTruthy();
  });

  it('renders expend column title', () => {
    const { container } = render(
      createTable({
        expandable: {
          expandedRowRender,
          columnTitle: 'column title',
        },
      }),
    );

    expect(
      container
        .querySelectorAll('thead tr th')[0]
        .classList.contains('rc-table-row-expand-icon-cell'),
    ).toBeTruthy();
    expect(container.querySelectorAll('thead tr th')[0].innerHTML).toContain('column title');
  });

  it('fires expand change event', () => {
    const onExpand = vi.fn();
    const { container } = render(createTable({ expandable: { expandedRowRender, onExpand } }));
    const expandIcon = container.querySelector('.rc-table-row-expand-icon');
    if (expandIcon) {
      fireEvent.click(expandIcon);
      expect(onExpand).toHaveBeenCalledWith(true, sampleData[0]);
      fireEvent.click(expandIcon);
      expect(onExpand).toHaveBeenCalledWith(false, sampleData[0]);
    }
  });

  it('fires onExpandedRowsChange event', () => {
    const onExpandedRowsChange = vi.fn();
    const { container } = render(
      createTable({
        expandedRowRender,
        onExpandedRowsChange,
      }),
    );
    const expandIcon = container.querySelector('.rc-table-row-expand-icon');
    if (expandIcon) {
      fireEvent.click(expandIcon);
      expect(onExpandedRowsChange).toHaveBeenCalledWith([0]);
    }
  });

  it('show icon if use `expandIcon` & `expandRowByClick`', () => {
    const { container } = render(
      createTable({
        expandedRowRender,
        expandRowByClick: true,
        expandIcon: () => <span className="should-display" />,
        data: [{ key: 0, name: 'Lucy', age: 27, children: [{ key: 1, name: 'Jack', age: 28 }] }],
      }),
    );

    expect(container.querySelectorAll('.should-display')).toHaveLength(1);
  });

  it('expandRowByClick', () => {
    const onExpand = vi.fn();
    const { container } = render(
      createTable({
        expandable: {
          expandedRowRender,
          expandRowByClick: true,
          onExpand,
        },
      }),
    );
    const firstRow = container.querySelectorAll('tbody tr')[0];
    if (firstRow) {
      fireEvent.click(firstRow);
      expect(onExpand).toHaveBeenCalledWith(true, sampleData[0]);

      fireEvent.click(firstRow);
      expect(onExpand).toHaveBeenCalledWith(false, sampleData[0]);
    }
  });

  it('some row should not expandable', () => {
    const { container } = render(
      createTable({
        expandable: {
          expandedRowRender,
          rowExpandable: ({ key }) => key === 1,
        },
      }),
    );

    expect(
      container
        .querySelectorAll('tbody tr')[0]
        .querySelector('.rc-table-row-expand-icon')
        .classList.contains('rc-table-row-spaced'),
    ).toBeTruthy();
    expect(
      container
        .querySelectorAll('tbody tr')[1]
        .querySelector('.rc-table-row-expand-icon')
        .classList.contains('rc-table-row-collapsed'),
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
    const { container } = render(
      createTable({ data, childrenColumnName: 'sub', expandable: { defaultExpandAllRows: true } }),
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
  });

  // https://github.com/ant-design/ant-design/issues/23894
  it('should be collapsible when use `expandIcon` & `expandRowByClick`', () => {
    const data = [{ key: 0, name: 'Lucy', age: 27 }];
    const onExpand = vi.fn();
    const { container } = render(
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
    expect(container.querySelectorAll('.rc-table-expanded-row')).toHaveLength(0);
    const expandIcon = container.querySelector('.custom-expand-icon');
    if (expandIcon) {
      fireEvent.click(expandIcon);
      expect(onExpand).toHaveBeenCalledWith(true, data[0]);
      expect(onExpand).toHaveBeenCalledTimes(1);
      expect(container.querySelector('.rc-table-expanded-row').style.display).toBe('');
      fireEvent.click(expandIcon);
      expect(onExpand).toHaveBeenCalledWith(false, data[0]);
      expect(onExpand).toHaveBeenCalledTimes(2);
      expect(container.querySelector('.rc-table-expanded-row').style.display).toBe('none');
    }
  });

  // https://github.com/ant-design/ant-design/issues/23894
  it('should be collapsible when `expandRowByClick` without custom `expandIcon`', () => {
    const data = [{ key: 0, name: 'Lucy', age: 27 }];
    const onExpand = vi.fn();
    const { container } = render(
      createTable({
        expandable: {
          expandedRowRender,
          expandRowByClick: true,
          onExpand,
        },
        data,
      }),
    );
    const expandIcon = container.querySelector('.rc-table-row-expand-icon');
    if (expandIcon) {
      fireEvent.click(expandIcon);
      expect(onExpand).toHaveBeenCalledWith(true, data[0]);
      expect(onExpand).toHaveBeenCalledTimes(1);
      fireEvent.click(expandIcon);
      expect(onExpand).toHaveBeenCalledWith(false, data[0]);
      expect(onExpand).toHaveBeenCalledTimes(2);
    }
  });

  it('should be collapsible when `expandRowByClick` with custom `expandIcon` and event.stopPropagation', () => {
    const data = [{ key: 0, name: 'Lucy', age: 27 }];
    const onExpand = vi.fn();
    const { container } = render(
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
    const expandIcon = container.querySelector('.custom-expand-icon');
    if (expandIcon) {
      fireEvent.click(expandIcon);
      expect(onExpand).toHaveBeenCalledWith(true, data[0]);
      expect(onExpand).toHaveBeenCalledTimes(1);
      fireEvent.click(expandIcon);
      expect(onExpand).toHaveBeenCalledWith(false, data[0]);
      expect(onExpand).toHaveBeenCalledTimes(2);
    }
  });

  it('support invalid expandIcon', () => {
    const data = [{ key: 0, name: 'Lucy', age: 27 }];
    const onExpand = vi.fn();
    const { container } = render(
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
    expect(container.querySelectorAll('.rc-table-expanded-row')).toHaveLength(0);
  });

  it('warning for use `expandedRowRender` and nested table in the same time', () => {
    resetWarned();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(createTable({ expandedRowRender, data: [{ children: [] }] }));
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: `expandedRowRender` should not use with nested Table',
    );
    errorSpy.mockRestore();
  });

  it('should only trigger once', () => {
    const expandedRowRender = vi.fn(() => <p>extra data</p>);
    render(
      createTable({
        expandable: {
          expandedRowRender,
          expandedRowKeys: [0],
        },
      }),
    );

    expect(expandedRowRender).toHaveBeenCalledTimes(1);
  });
});
