import { render, screen, fireEvent } from '@testing-library/react';
import { spyElementPrototype } from 'rc-util/lib/test/domHook';
import { resetWarned } from 'rc-util/lib/warning';
import React from 'react';
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
    const { container, rerender } = render(createTable(expandableProps()));
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
    expect(container).toMatchSnapshot();
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
    expect(container).toMatchSnapshot();
  });

  it('not use nest when children is invalidate', () => {
    const data = [
      { key: 2, name: 'Jack', age: 28, children: null },
      { key: 4, name: 'Jack', age: 28, children: undefined },
      { key: 5, name: 'Jack', age: 28, children: false },
    ];
    const { container } = render(createTable({ data }));
    expect(container).toMatchSnapshot();
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
    expect(container).toMatchSnapshot();
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
      const { container } = render(
        createTable({
          columns,
          data,
          scroll: { x: 903 },
          expandable: { expandedRowRender, defaultExpandAllRows: true },
        }),
      );
      act(() => {
        fireEvent(container.querySelector('ResizeObserver'), new Event('resize', { bubbles: true }));
      });
      expect(container).toMatchSnapshot();
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
    const { container } = render(
      createTable({
        columns,
        data,
        scroll: { x: 903 },
        expandable: { expandedRowRender, fixed: true },
      }),
    );
    const { container: container2 } = render(
      createTable({
        columns,
        data,
        scroll: { x: 903 },
        expandable: { expandedRowRender, fixed: true, expandIconColumnIndex: 3 },
      }),
    );
    expect(container).toMatchSnapshot();
    expect(container2).toMatchSnapshot();
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
    const { container } = render(
      createTable({
        columns,
        data,
        scroll: {},
        expandable: { expandedRowRender, fixed: true },
      }),
    );
    const { container: container2 } = render(
      createTable({
        columns,
        data,
        expandable: { expandedRowRender, fixed: true },
      }),
    );
    expect(container).toMatchSnapshot();
    expect(container2).toMatchSnapshot();
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
    const { container } = render(
      createTable({
        columns,
        data,
        scroll: { x: 903 },
        expandable: { expandedRowRender, fixed: 'left', expandIconColumnIndex: 1 },
      }),
    );
    const { container: container2 } = render(
      createTable({
        columns,
        data,
        scroll: { x: 903 },
        expandable: { expandedRowRender, fixed: 'right', expandIconColumnIndex: 2 },
      }),
    );
    expect(container.querySelectorAll('.rc-table-has-fix-left')).toHaveLength(0);
    expect(container2.querySelectorAll('.rc-table-has-fix-right')).toHaveLength(0);
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
        container.querySelectorAll('tbody tr td')[1].classList.contains('rc-table-row-expand-icon-cell'),
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
        container.querySelectorAll('tbody tr td')[2].classList.contains('rc-table-row-expand-icon-cell'),
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
        container.querySelectorAll('tbody tr td')[0].classList.contains('rc-table-row-expand-icon-cell'),
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
    expect(container.querySelectorAll('a.expand-row-icon')).toHaveLength(1);
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
    const { container, rerender } = render(
      createTable({
        expandable: {
          expandedRowRender,
          defaultExpandedRowKeys: [1],
        },
      }),
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
    expect(container.querySelectorAll('tbody tr')[2].classList.contains('rc-table-expanded-row')).toBeTruthy();
  });

  it('controlled by expandedRowKeys', () => {
    const { container, rerender } = render(
      createTable({
        expandedRowRender,
        expandedRowKeys: [0],
      }),
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
    expect(container.querySelectorAll('tbody tr')[1].classList.contains('rc-table-expanded-row')).toBeTruthy();

    rerender(createTable({ expandedRowRender, expandedRowKeys: [1] }));
    expect(container.querySelectorAll('tbody tr')).toHaveLength(4);
    expect(container.querySelectorAll('tbody tr')[1].classList.contains('rc-table-expanded-row')).toBeTruthy();
    expect(container.querySelectorAll('tbody tr')[1].style.display).toEqual('none');
    expect(container.querySelectorAll('tbody tr')[3].classList.contains('rc-table-expanded-row')).toBeTruthy();
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

    expect(container.querySelectorAll('tbody tr')[1].classList.contains('expand-row-test-class-name')).toBeTruthy();
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

    expect(container.querySelectorAll('tbody tr')[1].classList.contains('expand-row-test-class-name')).toBeTruthy();
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
      container.querySelectorAll('thead tr th')[0].classList.contains('rc-table-row-expand-icon-cell'),
    ).toBeTruthy();
    expect(container.querySelectorAll('thead tr th')[0].innerHTML).toContain('column title');
  });

  it('fires expand change event', () => {
    const onExpand = vi.fn();
    const { container } = render(
      createTable({
        expandable: {
          expandedRowRender,
          onExpand,
        },
      }),
    );
    fireEvent.click(container.querySelectorAll('.rc-table-row-expand-icon')[0]);
    expect(onExpand).toHaveBeenCalledWith(true, sampleData[0]);

    fireEvent.click(container.querySelectorAll('.rc-table-row-expand-icon')[0]);
    expect(onExpand).toHaveBeenCalledWith(false, sampleData[0]);
  });

  it('fires onExpandedRowsChange event', () => {
    const onExpandedRowsChange = vi.fn();
    const { container } = render(
      createTable({
        expandedRowRender,
        onExpandedRowsChange,
      }),
    );
    fireEvent.click(container.querySelectorAll('.rc-table-row-expand-icon')[0]);
    expect(onExpandedRowsChange).toHaveBeenCalledWith([0]);
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
