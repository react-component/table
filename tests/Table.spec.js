/* eslint-disable no-undef, no-console */
import React from 'react';
import { render, mount } from 'enzyme';
import Table from '../src';

describe('Table', () => {
  const data = [{ key: 'key0', name: 'Lucy' }, { key: 'key1', name: 'Jack' }];
  const createTable = props => {
    const columns = [{ title: 'Name', dataIndex: 'name', key: 'name' }];

    return <Table columns={columns} data={data} {...props} />;
  };

  it('renders correctly', () => {
    const wrapper = render(
      createTable({
        prefixCls: 'test-prefix',
        className: 'test-class-name',
      }),
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders empty text correctly', () => {
    const wrapper1 = render(createTable({ data: [], emptyText: 'No data' }));
    const wrapper2 = render(createTable({ data: [], emptyText: () => 'No data' }));
    expect(wrapper1).toMatchSnapshot();
    expect(wrapper2).toMatchSnapshot();
  });

  it('renders without header', () => {
    const wrapper = render(createTable({ showHeader: false }));
    expect(wrapper).toMatchSnapshot();
  });

  it('renders fixed header correctly', () => {
    const wrapper = render(createTable({ useFixedHeader: true }));
    expect(wrapper).toMatchSnapshot();
  });

  it('renders title correctly', () => {
    const wrapper = render(createTable({ title: () => <p>title</p> }));
    expect(wrapper).toMatchSnapshot();
  });

  it('renders footer correctly', () => {
    const wrapper = render(createTable({ footer: () => <p>footer</p> }));
    expect(wrapper).toMatchSnapshot();
  });

  it('renders table body to the wrapper', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const getBodyWrapper = body => <tbody className="custom-wapper">{body.props.children}</tbody>;
    const wrapper = render(createTable({ getBodyWrapper }));
    expect(wrapper).toMatchSnapshot();
    expect(spy.mock.calls[0][0]).toMatch(
      'Warning: getBodyWrapper is deprecated, please use custom components instead.',
    );
    spy.mockRestore();
  });

  it('renders with id correctly', () => {
    const testId = 'test-identifier';
    const wrapper = mount(createTable({ id: testId }));
    expect(wrapper.find(`div#${testId}`)).toHaveLength(1);
  });

  it('renders with data attributes correctly', () => {
    const testId = 'test-id';
    const otherId = '12345';
    const wrapper = mount(
      createTable({
        'data-test': testId,
        'data-id': otherId,
      }),
    );
    const table = wrapper.find('table').getDOMNode();
    expect(table.getAttribute('data-test')).toBe(testId);
    expect(table.getAttribute('data-id')).toBe(otherId);
  });

  it('renders with aria attributes correctly', () => {
    const label = 'some-label';
    const labelledby = 'label-id';
    const wrapper = mount(
      createTable({
        'aria-label': label,
        'aria-labelledby': labelledby,
      }),
    );
    const table = wrapper.find('table').getDOMNode();
    expect(table.getAttribute('aria-label')).toBe(label);
    expect(table.getAttribute('aria-labelledby')).toBe(labelledby);
  });

  xit('sets row refs', () => {
    const wrapper = mount(createTable({ rowRef: record => record.key }));
    expect(wrapper.instance().refs.key0).toBe(
      wrapper
        .find('TableRow')
        .at(0)
        .instance(),
    );
    expect(wrapper.instance().refs.key1).toBe(
      wrapper
        .find('TableRow')
        .at(1)
        .instance(),
    );
  });

  describe('rowKey', () => {
    it('uses record.key', () => {
      const wrapper = mount(createTable());
      expect(
        wrapper
          .find('TableRow')
          .at(0)
          .prop('rowKey'),
      ).toBe('key0');
      expect(
        wrapper
          .find('TableRow')
          .at(1)
          .prop('rowKey'),
      ).toBe('key1');
    });

    it('sets by rowKey', () => {
      const wrapper = mount(createTable({ rowKey: 'name' }));
      expect(
        wrapper
          .find('TableRow')
          .at(0)
          .prop('rowKey'),
      ).toBe('Lucy');
      expect(
        wrapper
          .find('TableRow')
          .at(1)
          .prop('rowKey'),
      ).toBe('Jack');
    });

    it('sets by rowKey function', () => {
      const wrapper = mount(createTable({ rowKey: record => `${record.key}1` }));
      expect(
        wrapper
          .find('TableRow')
          .at(0)
          .prop('rowKey'),
      ).toBe('key01');
      expect(
        wrapper
          .find('TableRow')
          .at(1)
          .prop('rowKey'),
      ).toBe('key11');
    });
  });

  describe('scroll', () => {
    it('renders scroll.x is true', () => {
      const wrapper = render(createTable({ scroll: { x: true } }));
      expect(wrapper).toMatchSnapshot();
    });

    it('renders scroll.x is a number', () => {
      const wrapper = render(createTable({ scroll: { x: 200 } }));
      expect(wrapper).toMatchSnapshot();
    });

    it('renders scroll.y is a number', () => {
      const wrapper = render(createTable({ scroll: { y: 200 } }));
      expect(wrapper).toMatchSnapshot();
    });

    it('fire scroll event', () => {
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
      const inst = wrapper.instance();
      const headTable = wrapper.find('.rc-table-header').at(0);
      const bodyTable = wrapper.find('.rc-table-body').at(0);
      const fixedColumnsBodyLeft = wrapper.find('.rc-table-body-inner').at(0);
      const fixedColumnsBodyRight = wrapper.find('.rc-table-body-inner').at(1);

      expect(inst.lastScrollLeft).toBe(undefined);

      // fire headTable scroll.
      headTable.getDOMNode().scrollTop = 0;
      headTable.getDOMNode().scrollLeft = 20;
      headTable.simulate('mouseover');
      headTable.simulate('scroll');
      expect(bodyTable.getDOMNode().scrollLeft).toBe(20);
      expect(fixedColumnsBodyLeft.getDOMNode().scrollTop).toBe(0);
      expect(fixedColumnsBodyRight.getDOMNode().scrollTop).toBe(0);
      expect(inst.lastScrollLeft).toBe(20);

      // fire bodyTable scroll.
      bodyTable.getDOMNode().scrollTop = 10;
      bodyTable.getDOMNode().scrollLeft = 40;
      bodyTable.simulate('mouseover');
      bodyTable.simulate('scroll');
      expect(headTable.getDOMNode().scrollLeft).toBe(40);
      expect(fixedColumnsBodyLeft.getDOMNode().scrollTop).toBe(10);
      expect(fixedColumnsBodyRight.getDOMNode().scrollTop).toBe(10);

      expect(inst.lastScrollLeft).toBe(40);

      // fire fixedColumnsBodyLeft scroll.
      fixedColumnsBodyLeft.getDOMNode().scrollTop = 30;
      fixedColumnsBodyLeft.simulate('mouseover');
      fixedColumnsBodyLeft.simulate('scroll');
      expect(headTable.getDOMNode().scrollLeft).toBe(40);
      expect(bodyTable.getDOMNode().scrollLeft).toBe(40);
      expect(bodyTable.getDOMNode().scrollTop).toBe(30);
      expect(fixedColumnsBodyRight.getDOMNode().scrollTop).toBe(30);

      expect(inst.lastScrollLeft).toBe(0);

      // fire fixedColumnsBodyRight scroll.
      fixedColumnsBodyRight.getDOMNode().scrollTop = 15;
      fixedColumnsBodyRight.simulate('mouseover');
      fixedColumnsBodyRight.simulate('scroll');
      expect(headTable.getDOMNode().scrollLeft).toBe(40);
      expect(bodyTable.getDOMNode().scrollLeft).toBe(40);
      expect(bodyTable.getDOMNode().scrollTop).toBe(15);
      expect(fixedColumnsBodyLeft.getDOMNode().scrollTop).toBe(15);

      expect(inst.lastScrollLeft).toBe(0);
    });
  });

  it('renders column correctly', () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        className: 'name-class',
        width: 100,
      },
    ];
    const wrapper = render(createTable({ columns }));
    expect(wrapper).toMatchSnapshot();
  });

  it('renders custom cell correctly', () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <p>{text}</p>,
      },
    ];
    const wrapper = render(createTable({ columns }));
    expect(wrapper).toMatchSnapshot();
  });

  it('fires cell click event', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const onCellClick = jest.fn();
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        onCellClick,
      },
    ];
    const wrapper = mount(createTable({ columns }));
    wrapper
      .find('tbody td')
      .first()
      .simulate('click');
    expect(onCellClick.mock.calls[0][0]).toBe(data[0]);
    expect(onCellClick.mock.calls[0][1].type).toBe('click');
    expect(spy.mock.calls[0][0]).toMatch(
      'Warning: column[onCellClick] is deprecated, please use column[onCell] instead.',
    );
    spy.mockReset();
    spy.mockRestore();
  });

  describe('dataIndex', () => {
    it("pass record to render when it's falsy", () => {
      [null, undefined, '', []].forEach(dataIndex => {
        const cellRender = jest.fn();
        const columns = [
          {
            title: 'Name',
            dataIndex,
            key: 'name',
            render: cellRender,
          },
        ];
        mount(createTable({ columns }));
        expect(cellRender).toBeCalledWith(data[0], data[0], 0);
      });
    });

    it('render text by path', () => {
      const columns = [
        { title: 'First Name', dataIndex: 'name.first', key: 'a' },
        { title: 'Last Name', dataIndex: 'name.last', key: 'b' },
      ];
      const localData = [
        { key: 'key0', name: { first: 'John', last: 'Doe' } },
        { key: 'key1', name: { first: 'Terry', last: 'Garner' } },
      ];
      const wrapper = render(createTable({ columns, data: localData }));
      expect(wrapper).toMatchSnapshot();
    });
  });

  it('render empty cell if text is empty object', () => {
    const localData = [{ key: 'key0', name: {} }, { key: 'key1', name: 'Jack' }];
    const wrapper = render(createTable({ data: localData }));
    expect(
      wrapper
        .find('table td')
        .first()
        .text(),
    ).toBe('');
  });

  it('renders colSpan correctly', () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'firstName',
        key: 'firstName',
        colSpan: 2,
        render: (text, record, index) => {
          const obj = {
            children: text,
            props: {},
          };
          if (index === 0) {
            obj.props.colSpan = 2;
          }
          return obj;
        },
      },
      {
        title: '',
        dataIndex: 'lastName',
        key: 'lastName',
        colSpan: 0,
        render: (text, record, index) => {
          const obj = {
            children: text,
            props: {},
          };
          if (index === 0) {
            obj.props.colSpan = 0;
          }
          return obj;
        },
      },
    ];
    const localData = [
      { key: 'key0', firstName: 'John', lastName: 'Doe' },
      { key: 'key1', firstName: 'Terry', lastName: 'Garner' },
    ];
    const wrapper = render(createTable({ columns, data: localData }));
    expect(wrapper).toMatchSnapshot();
  });

  it('renders rowSpan correctly', () => {
    const columns = [
      {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        render: (text, record, index) => {
          const obj = {
            children: text,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 2;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
    ];
    const localData = [
      { key: 'key0', firstName: 'John', lastName: 'Doe' },
      { key: 'key1', firstName: 'Terry', lastName: 'Garner' },
    ];
    const wrapper = render(createTable({ columns, data: localData }));
    expect(wrapper).toMatchSnapshot();
  });

  it('shows error if no rowKey specify', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const localData = [{ name: 'Lucy' }, { name: 'Jack' }];
    mount(createTable({ data: localData }));
    expect(spy.mock.calls[0][0]).toMatch(
      'Warning: Each record in table should have a unique `key` prop,' +
        'or set `rowKey` to an unique primary key.',
    );
    spy.mockReset();
    spy.mockRestore();
  });

  describe('data change to empty', () => {
    beforeAll(() => {
      spyOn(Table.prototype, 'resetScrollX');
    });

    beforeEach(() => {
      Table.prototype.resetScrollX.calls.reset();
    });

    it('reset scrollLeft when scroll.x is present', () => {
      const wrapper = mount(createTable({ scroll: { x: 100 } }));
      wrapper.setProps({ data: [] });
      expect(Table.prototype.resetScrollX.calls.count()).toBe(1);
    });

    it('resetScrollX is not called when scroll.x is absent', () => {
      const wrapper = mount(createTable());
      wrapper.setProps({ data: [] });
      expect(Table.prototype.resetScrollX.calls.count()).toBe(0);
    });
  });

  it('renders correctly RowClassName as string', () => {
    const wrapper = render(
      createTable({
        rowClassName: 'test-row-class-name-asStr',
      }),
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly RowClassName as function', () => {
    const wrapper = render(
      createTable({
        rowClassName: () => 'test-row-class-name-asFn',
      }),
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders onRow correctly', () => {
    const onRow = (record, index) => ({
      id: `row-${record.key}`,
      index,
    });
    const wrapper = render(createTable({ onRow }));

    expect(wrapper.find('tbody tr')).toMatchSnapshot();
  });

  it('renders column.onCell correctly', () => {
    const onCell = record => ({
      id: `cell-${record.name}`,
    });
    const columns = [{ title: 'Name', dataIndex: 'name', key: 'name', onCell }];
    const wrapper = render(createTable({ columns }));

    expect(wrapper.find('tbody td')).toMatchSnapshot();
  });

  it('renders onHeaderRow correctly', () => {
    const onHeaderRow = jest.fn((columns, index) => ({
      id: `header-row-${index}`,
    }));
    const wrapper = render(createTable({ onHeaderRow }));

    expect(wrapper.find('thead tr')).toMatchSnapshot();
    expect(onHeaderRow).toBeCalledWith([{ title: 'Name', dataIndex: 'name', key: 'name' }], 0);
  });

  it('renders column.onHeaderCell', () => {
    const onHeaderCell = column => ({
      id: `header-cell-${column.key}`,
    });
    const columns = [{ title: 'Name', dataIndex: 'name', key: 'name', onHeaderCell }];
    const wrapper = render(createTable({ columns }));

    expect(wrapper.find('thead th')).toMatchSnapshot();
  });

  describe('custom components', () => {
    const MyTable = props => <table name="my-table" {...props} />;
    const HeaderWrapper = props => <thead name="my-header-wrapper" {...props} />;
    const HeaderRow = props => <tr name="my-header-row" {...props} />;
    const HeaderCell = props => <th name="my-header-cell" {...props} />;
    const BodyWrapper = props => <tbody name="my-body-wrapper" {...props} />;
    const BodyRow = props => <tr name="my-body-row" {...props} />;
    const BodyCell = props => <td name="my-body-cell" {...props} />;

    const components = {
      table: MyTable,
      header: {
        wrapper: HeaderWrapper,
        row: HeaderRow,
        cell: HeaderCell,
      },
      body: {
        wrapper: BodyWrapper,
        row: BodyRow,
        cell: BodyCell,
      },
    };

    it('renders correctly', () => {
      const wrapper = render(createTable({ components }));

      expect(wrapper).toMatchSnapshot();
    });

    it('renders fixed column and header correctly', () => {
      const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name', fixed: 'left' },
        { title: 'Age', dataIndex: 'age', key: 'age' },
        { title: 'Gender', dataIndex: 'gender', key: 'gender', fixed: 'right' },
      ];
      const sampleData = [{ key: 0, name: 'Lucy', age: 27, gender: 'F' }];
      const wrapper = render(
        createTable({
          columns,
          data: sampleData,
          components,
          scroll: { y: 100 },
        }),
      );

      expect(wrapper).toMatchSnapshot();
    });
  });

  it('align column', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age', align: 'center' },
    ];
    const wrapper = render(createTable({ columns }));
    expect(wrapper).toMatchSnapshot();
  });

  it('align column should not override cell style', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        align: 'center',
        onCell: () => ({ style: { color: 'red' } }),
        onHeaderCell: () => ({ style: { color: 'red' } }),
      },
    ];
    const wrapper = render(createTable({ columns }));
    expect(wrapper).toMatchSnapshot();
  });

  describe('row events', () => {
    let spy;
    beforeAll(() => {
      spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      spy.mockReset();
    });

    afterAll(() => {
      spy.mockRestore();
    });

    it('fires row click event', () => {
      const onRowClick = jest.fn();
      const wrapper = mount(createTable({ onRowClick }));
      wrapper
        .find('tbody tr')
        .first()
        .simulate('click');
      const call = onRowClick.mock.calls[0];
      expect(call[0]).toBe(data[0]);
      expect(call[1]).toBe(0);
      expect(call[2].type).toBe('click');
      expect(spy.mock.calls[0][0]).toMatch(
        'Warning: onRowClick is deprecated, please use onRow instead.',
      );
    });

    it('fires double row click event', () => {
      const onRowDoubleClick = jest.fn();
      const wrapper = mount(createTable({ onRowDoubleClick }));
      wrapper
        .find('tbody tr')
        .first()
        .simulate('doubleClick');
      const call = onRowDoubleClick.mock.calls[0];
      expect(call[0]).toBe(data[0]);
      expect(call[1]).toBe(0);
      expect(call[2].type).toBe('doubleclick');
      expect(spy.mock.calls[0][0]).toMatch(
        'Warning: onRowDoubleClick is deprecated, please use onRow instead.',
      );
    });

    it('fires row contextmenu event', () => {
      const onRowContextMenu = jest.fn();
      const wrapper = mount(createTable({ onRowContextMenu }));
      wrapper
        .find('tbody tr')
        .first()
        .simulate('contextMenu');
      const call = onRowContextMenu.mock.calls[0];
      expect(call[0]).toBe(data[0]);
      expect(call[1]).toBe(0);
      expect(call[2].type).toBe('contextmenu');
      expect(spy.mock.calls[0][0]).toMatch(
        'Warning: onRowContextMenu is deprecated, please use onRow instead.',
      );
    });

    it('fires onRowMouseEnter', () => {
      const handleRowMouseEnter = jest.fn();
      const wrapper = mount(
        createTable({
          onRowMouseEnter: handleRowMouseEnter,
        }),
      );
      wrapper
        .find('.rc-table-row')
        .first()
        .simulate('mouseEnter');
      expect(handleRowMouseEnter).toBeCalledWith(data[0], 0, expect.anything());
      expect(spy.mock.calls[0][0]).toMatch(
        'Warning: onRowMouseEnter is deprecated, please use onRow instead.',
      );
    });

    it('fires onRowMouseLeave', () => {
      const handleRowMouseLeave = jest.fn();
      const wrapper = mount(
        createTable({
          onRowMouseLeave: handleRowMouseLeave,
        }),
      );
      wrapper
        .find('.rc-table-row')
        .first()
        .simulate('mouseLeave');
      expect(handleRowMouseLeave).toBeCalledWith(data[0], 0, expect.anything());
      expect(spy.mock.calls[0][0]).toMatch(
        'Warning: onRowMouseLeave is deprecated, please use onRow instead.',
      );
    });
  });
});
