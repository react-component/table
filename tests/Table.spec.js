import React from 'react';
import { mount } from 'enzyme';
import { resetWarned } from 'rc-util/lib/warning';
import Table from '../src';
import { INTERNAL_HOOKS } from '../src/Table';

describe('Table.Basic', () => {
  const data = [{ key: 'key0', name: 'Lucy' }, { key: 'key1', name: 'Jack' }];
  const createTable = props => {
    const columns = [{ title: 'Name', dataIndex: 'name', key: 'name' }];

    return <Table columns={columns} data={data} {...props} />;
  };

  describe('renders correctly', () => {
    it('basic', () => {
      const wrapper = mount(
        createTable({
          prefixCls: 'test-prefix',
          className: 'test-class-name',
        }),
      );
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('no columns', () => {
      const wrapper = mount(createTable({ columns: [] }));
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  it('renders empty text correctly', () => {
    const wrapper1 = mount(createTable({ data: [], emptyText: 'No data' }));
    const wrapper2 = mount(createTable({ data: [], emptyText: () => 'No data' }));
    expect(
      wrapper1
        .find('.rc-table-placeholder')
        .hostNodes()
        .text(),
    ).toEqual('No data');
    expect(
      wrapper2
        .find('.rc-table-placeholder')
        .hostNodes()
        .text(),
    ).toEqual('No data');
  });

  it('renders without header', () => {
    const wrapper = mount(createTable({ showHeader: false }));
    expect(wrapper.find('thead').length).toBeFalsy();
  });

  it('renders fixed header correctly', () => {
    const wrapper = mount(createTable({ scroll: { y: 100 } }));
    expect(wrapper.find('.rc-table-header').length).toBeTruthy();
  });

  it('renders title correctly', () => {
    const wrapper = mount(createTable({ title: () => <p>title</p> }));
    expect(
      wrapper
        .find('.rc-table-title')
        .hostNodes()
        .text(),
    ).toEqual('title');
  });

  it('renders footer correctly', () => {
    const wrapper = mount(createTable({ footer: () => <p>footer</p> }));
    expect(
      wrapper
        .find('.rc-table-footer')
        .hostNodes()
        .text(),
    ).toEqual('footer');
  });

  it('render summary correctly', () => {
    const wrapper = mount(
      createTable({
        summary: () => (
          <tr className="summary">
            <td>Good</td>
          </tr>
        ),
      }),
    );

    expect(wrapper.find('tfoot').text()).toEqual('Good');
  });

  it('renders with id correctly', () => {
    const testId = 'test-identifier';
    const wrapper = mount(createTable({ id: testId }));
    expect(wrapper.find(`div#${testId}`).length).toBeTruthy();
  });

  it('renders data- &  aria- attributes', () => {
    const miscProps = { 'data-test': 'names-table', 'aria-label': 'names-table-aria' };
    const wrapper = mount(createTable(miscProps));
    const props = wrapper.find('div.rc-table').props();
    expect(props).toEqual(expect.objectContaining(miscProps));
  });

  describe('rowKey', () => {
    it('uses record.key', () => {
      const wrapper = mount(createTable());
      expect(
        wrapper
          .find('BodyRow')
          .at(0)
          .key(),
      ).toBe('key0');
      expect(
        wrapper
          .find('BodyRow')
          .at(1)
          .key(),
      ).toBe('key1');
    });

    it('sets by rowKey', () => {
      const wrapper = mount(createTable({ rowKey: 'name' }));
      expect(
        wrapper
          .find('BodyRow')
          .at(0)
          .key(),
      ).toBe('Lucy');
      expect(
        wrapper
          .find('BodyRow')
          .at(1)
          .key(),
      ).toBe('Jack');
    });

    it('sets by rowKey function', () => {
      const wrapper = mount(createTable({ rowKey: record => `${record.key}1` }));
      expect(
        wrapper
          .find('BodyRow')
          .at(0)
          .key(),
      ).toBe('key01');
      expect(
        wrapper
          .find('BodyRow')
          .at(1)
          .key(),
      ).toBe('key11');
    });
  });

  it('renders tableLayout', () => {
    const wrapper = mount(createTable({ tableLayout: 'fixed' }));
    expect(wrapper.find('table').props().style.tableLayout).toEqual('fixed');
    expect(wrapper.find('div.rc-table').hasClass('rc-table-layout-fixed')).toBeTruthy();
  });

  it('renders ellipsis', () => {
    const wrapper = mount(
      createTable({
        columns: [
          { title: 'title', ellipsis: true },
          { title: 'node title', ellipsis: true, render: () => <h1>233</h1> },
        ],
      }),
    );

    wrapper.find('td').forEach(td => {
      expect(td.hasClass('rc-table-cell-ellipsis')).toBeTruthy();
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
    const wrapper = mount(createTable({ columns }));
    wrapper.find('td').forEach((td, index) => {
      expect(td.hasClass('name-class')).toBeTruthy();
      expect(td.text()).toEqual(['Lucy', 'Jack'][index]);
    });

    expect(wrapper.find('col').props().style).toEqual(expect.objectContaining({ width: 100 }));
  });

  it('renders custom cell correctly', () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        render: text => <p>!!!{text}!!!</p>,
      },
    ];
    const wrapper = mount(createTable({ columns }));
    wrapper.find('td').forEach((td, index) => {
      expect(td.text()).toEqual(['!!!Lucy!!!', '!!!Jack!!!'][index]);
    });
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
        expect(cellRender).toHaveBeenCalledWith(data[0], data[0], 0);
      });
    });

    it('render text by path', () => {
      const columns = [
        { title: 'First Name', dataIndex: ['name', 'first'], key: 'a' },
        { title: 'Last Name', dataIndex: ['name', 'last'], key: 'b' },
      ];
      const localData = [
        { key: 'key0', name: { first: 'John', last: 'Doe' } },
        { key: 'key1', name: { first: 'Terry', last: 'Garner' } },
      ];
      const wrapper = mount(createTable({ columns, data: localData }));

      const targetData = [['John', 'Doe'], ['Terry', 'Garner']];

      wrapper.find('tbody tr').forEach((tr, ri) => {
        tr.find('td').forEach((td, di) => {
          expect(td.text()).toEqual(targetData[ri][di]);
        });
      });
    });
  });

  it('render empty cell if text is empty object', () => {
    const localData = [{ key: 'key0', name: {} }, { key: 'key1', name: 'Jack' }];
    const wrapper = mount(createTable({ data: localData }));
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
    const wrapper = mount(createTable({ columns, data: localData }));
    expect(wrapper.render()).toMatchSnapshot();
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
    const wrapper = mount(createTable({ columns, data: localData }));
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('shows error if no rowKey specify', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const localData = [{ name: 'Lucy' }, { name: 'Jack' }];
    mount(createTable({ data: localData }));
    expect(spy.mock.calls[0][0]).toMatch(
      'Warning: Each record in table should have a unique `key` prop, or set `rowKey` to an unique primary key.',
    );
    spy.mockRestore();
  });

  it('renders correctly RowClassName as string', () => {
    const wrapper = mount(
      createTable({
        rowClassName: 'test-row-class-name-asStr',
      }),
    );

    wrapper.find('tbody tr').forEach(tr => {
      expect(tr.hasClass('test-row-class-name-asStr')).toBeTruthy();
    });
    expect(wrapper.find('tbody tr').length).toBeTruthy();
  });

  it('renders correctly RowClassName as function', () => {
    const wrapper = mount(
      createTable({
        rowClassName: () => 'test-row-class-name-asFn',
      }),
    );

    wrapper.find('tbody tr').forEach(tr => {
      expect(tr.hasClass('test-row-class-name-asFn')).toBeTruthy();
    });
    expect(wrapper.find('tbody tr').length).toBeTruthy();
  });

  it('renders onRow correctly', () => {
    const onRow = (record, index) => ({
      id: `row-${record.key}`,
      index,
    });
    const wrapper = mount(createTable({ onRow }));

    expect(wrapper.find('tbody tr').length).toBeTruthy();
    wrapper.find('tbody tr').forEach((tr, index) => {
      expect(tr.props().id).toEqual(`row-${data[index].key}`);
    });
  });

  it('renders column.onCell correctly', () => {
    const onCell = record => ({
      id: `cell-${record.name}`,
    });
    const columns = [{ title: 'Name', dataIndex: 'name', key: 'name', onCell }];
    const wrapper = mount(createTable({ columns }));

    expect(wrapper.find('tbody td')).toHaveLength(2);
    wrapper.find('tbody td').forEach((td, index) => {
      expect(td.props().id).toEqual(`cell-${data[index].name}`);
    });
  });

  it('renders onHeaderRow correctly', () => {
    const onHeaderRow = jest.fn((columns, index) => ({
      id: `header-row-${index}`,
    }));
    const wrapper = mount(createTable({ onHeaderRow }));

    expect(wrapper.find('thead tr').props().id).toEqual('header-row-0');
    expect(onHeaderRow).toHaveBeenCalledWith(
      [{ title: 'Name', dataIndex: 'name', key: 'name' }],
      0,
    );
  });

  it('renders column.onHeaderCell', () => {
    const onHeaderCell = column => ({
      id: `header-cell-${column.key}`,
    });
    const columns = [{ title: 'Name', dataIndex: 'name', key: 'name', onHeaderCell }];
    const wrapper = mount(createTable({ columns }));

    expect(wrapper.find('thead th')).toHaveLength(1);
    expect(wrapper.find('thead th').props().id).toEqual('header-cell-name');
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
      const wrapper = mount(createTable({ components }));
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('renders fixed column and header correctly', () => {
      const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name', fixed: 'left' },
        { title: 'Age', dataIndex: 'age', key: 'age' },
        { title: 'Gender', dataIndex: 'gender', key: 'gender', fixed: 'right' },
      ];
      const sampleData = [{ key: 0, name: 'Lucy', age: 27, gender: 'F' }];
      const wrapper = mount(
        createTable({
          columns,
          data: sampleData,
          components,
          scroll: { x: 100, y: 100 },
        }),
      );
      expect(wrapper.render()).toMatchSnapshot();
    });

    describe('scroll content', () => {
      it('with scroll', () => {
        resetWarned();
        const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const wrapper = mount(
          createTable({
            columns: [{ dataIndex: 'a' }, { dataIndex: 'b', width: 903 }],
            components: {
              body: () => <h1>Bamboo</h1>,
            },
            scroll: { x: 100, y: 100 },
          }),
        );
        expect(wrapper.render()).toMatchSnapshot();

        expect(errSpy).toHaveBeenCalledWith(
          'Warning: When use `components.body` with render props. Each column should have a fixed value.',
        );
        errSpy.mockRestore();
      });

      it('without scroll', () => {
        resetWarned();
        const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        mount(
          createTable({
            components: {
              body: () => <h1>Bamboo</h1>,
            },
          }),
        );
        expect(errSpy).toHaveBeenCalledWith(
          'Warning: `components.body` with render props is only work on `scroll.y`.',
        );
        errSpy.mockRestore();
      });
    });
  });

  it('align column', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age', align: 'center' },
    ];
    const wrapper = mount(createTable({ columns }));
    expect(
      wrapper
        .find('th')
        .at(0)
        .props().style.textAlign,
    ).toBeFalsy();
    expect(
      wrapper
        .find('th')
        .at(1)
        .props().style.textAlign,
    ).toEqual('center');
    expect(
      wrapper
        .find('tbody tr')
        .first()
        .find('td')
        .at(0)
        .props().style.textAlign,
    ).toBeFalsy();
    expect(
      wrapper
        .find('tbody tr')
        .first()
        .find('td')
        .at(1)
        .props().style.textAlign,
    ).toEqual('center');
  });

  it('align column should not override cell style', () => {
    const columns = [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        align: 'center',
        onCell: () => ({ style: { color: 'red' } }),
        onHeaderCell: () => ({ style: { color: 'green' } }),
      },
    ];
    const wrapper = mount(createTable({ columns }));
    expect(
      wrapper
        .find('th')
        .first()
        .props().style,
    ).toEqual({
      color: 'green',
      textAlign: 'center',
    });
    expect(
      wrapper
        .find('td')
        .first()
        .props().style,
    ).toEqual({
      color: 'red',
      textAlign: 'center',
    });
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
      const onClick = jest.fn();
      const wrapper = mount(createTable({ onRow: () => ({ onClick }) }));
      const tr = wrapper.find('tbody tr').first();

      tr.simulate('click');
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({
          target: tr.instance(),
        }),
      );
    });

    it('fires double row click event', () => {
      const onDoubleClick = jest.fn();
      const wrapper = mount(createTable({ onRow: () => ({ onDoubleClick }) }));
      const tr = wrapper.find('tbody tr').first();

      tr.first().simulate('doubleClick');
      expect(onDoubleClick).toHaveBeenCalledWith(
        expect.objectContaining({
          target: tr.instance(),
        }),
      );
    });

    it('fires row contextmenu event', () => {
      const onContextMenu = jest.fn();
      const wrapper = mount(createTable({ onRow: () => ({ onContextMenu }) }));
      const tr = wrapper.find('tbody tr').first();

      tr.first().simulate('contextMenu');
      expect(onContextMenu).toHaveBeenCalledWith(
        expect.objectContaining({
          target: tr.instance(),
        }),
      );
    });

    it('fires onRowMouseEnter', () => {
      const onMouseEnter = jest.fn();
      const wrapper = mount(
        createTable({
          onRow: () => ({ onMouseEnter }),
        }),
      );

      const tr = wrapper.find('.rc-table-row').first();

      tr.simulate('mouseEnter');
      expect(onMouseEnter).toHaveBeenCalledWith(
        expect.objectContaining({
          target: tr.instance(),
        }),
      );
    });

    it('fires onRowMouseLeave', () => {
      const onMouseLeave = jest.fn();
      const wrapper = mount(
        createTable({
          onRow: () => ({ onMouseLeave }),
        }),
      );

      const tr = wrapper.find('.rc-table-row').first();

      tr.simulate('mouseLeave');
      expect(onMouseLeave).toHaveBeenCalledWith(
        expect.objectContaining({
          target: tr.instance(),
        }),
      );
    });
  });

  it('columns without key', () => {
    const wrapper = mount(
      createTable({
        columns: [{ dataIndex: null }],
      }),
    );

    expect(
      wrapper
        .find('tbody Cell')
        .first()
        .key(),
    ).toBeTruthy();
  });

  it('syntactic sugar', () => {
    const { Column, ColumnGroup } = Table;
    expect(
      mount(
        <Table>
          <ColumnGroup title="total">
            <Column title="Name" dataIndex="name" />
          </ColumnGroup>
          {'Invalidate Column'}
        </Table>,
      ).render(),
    ).toMatchSnapshot();
  });

  describe('internal api', () => {
    it('transformColumns', () => {
      const wrapper = mount(
        createTable({
          internalHooks: INTERNAL_HOOKS,
          transformColumns: columns => [{ title: 'before' }, ...columns, { title: 'after' }],
        }),
      );

      expect(wrapper.render()).toMatchSnapshot();
    });

    it('internalRefs', () => {
      const internalRefs = {
        body: React.createRef(),
      };

      mount(
        createTable({
          internalHooks: INTERNAL_HOOKS,
          internalRefs,
          scroll: { y: 20 },
        }),
      );

      expect(internalRefs.body).toBeTruthy();
      expect(internalRefs.body.current instanceof HTMLDivElement).toBeTruthy();
    });
  });
});
