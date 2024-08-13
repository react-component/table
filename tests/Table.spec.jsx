import { render, screen, fireEvent } from '@testing-library/react';
import { resetWarned } from 'rc-util/lib/warning';
import React from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import Table, { INTERNAL_COL_DEFINE } from '../src';
import BodyRow from '../src/Body/BodyRow';
import Cell from '../src/Cell';
import { INTERNAL_HOOKS } from '../src/constant';

describe('Table.Basic', () => {
  const data = [
    { key: 'key0', name: 'Lucy' },
    { key: 'key1', name: 'Jack' },
  ];
  const createTable = props => {
    const columns = [{ title: 'Name', dataIndex: 'name', key: 'name' }];

    return <Table columns={columns} data={data} {...props} />;
  };

  describe('renders correctly', () => {
    it('basic', () => {
      const { container } = render(
        createTable({
          prefixCls: 'test-prefix',
          className: 'test-class-name',
        }),
      );
      expect(container).toMatchSnapshot();
    });

    it('RTL', () => {
      const { container } = render(
        createTable({
          prefixCls: 'test-prefix',
          className: 'test-class-name',
          direction: 'rtl',
        }),
      );
      expect(container).toMatchSnapshot();
    });

    it('no columns', () => {
      const { container } = render(createTable({ columns: [] }));
      expect(container).toMatchSnapshot();
    });

    it('column children undefined', () => {
      const { container } = render(
        createTable({
          columns: [
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
              children: [],
            },
            {
              title: '年龄',
              dataIndex: 'age',
              key: 'age',
              children: undefined,
            },
          ],
        }),
      );
      expect(container).toMatchSnapshot();
      expect(container.querySelectorAll('th')[0].textContent).toEqual('姓名');
      expect(container.querySelectorAll('th')[1].textContent).toEqual('年龄');
    });

    it('falsy columns', () => {
      const { container } = render(
        createTable({
          columns: [
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
              children: [],
            },
            false,
          ],
        }),
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('renders empty text correctly', () => {
    it('ReactNode', () => {
      const { container } = render(createTable({ data: [], emptyText: 'No data' }));
      expect(container.querySelector('.rc-table-placeholder').textContent).toEqual('No data');
    });

    it('renderProps', () => {
      const { container } = render(createTable({ data: [], emptyText: () => 'No data' }));
      expect(container.querySelector('.rc-table-placeholder').textContent).toEqual('No data');
    });

    it('effect update', () => {
      const App = () => {
        const [emptyText, setEmptyText] = React.useState('light');
        React.useEffect(() => {
          setEmptyText('bamboo');
        }, []);
        return <Table emptyText={emptyText} />;
      };
      const { container } = render(<App />);
      expect(container.querySelector('.rc-table-placeholder').textContent).toEqual('bamboo');
    });
  });

  it('renders without header', () => {
    const { container } = render(createTable({ showHeader: false }));
    expect(container.querySelector('thead')).toBeFalsy();
  });

  it('renders fixed header correctly', () => {
    const { container } = render(createTable({ scroll: { y: 100 } }));
    expect(container.querySelector('.rc-table-header')).toBeTruthy();
  });

  it('renders title correctly', () => {
    const { container } = render(createTable({ title: () => <p>title</p> }));
    expect(container.querySelector('.rc-table-title').textContent).toEqual('title');
  });

  it('renders footer correctly', () => {
    const { container } = render(createTable({ footer: () => <p>footer</p> }));
    expect(container.querySelector('.rc-table-footer').textContent).toEqual('footer');
  });

  it('renders with id correctly', () => {
    const testId = 'test-identifier';
    const { container } = render(createTable({ id: testId }));
    expect(container.querySelector(`div#${testId}`)).toBeTruthy();
  });

  it('renders data- attributes', () => {
    const miscProps = { 'data-test': 'names-table' };
    const { container } = render(createTable(miscProps));
    const props = container.querySelector('div.rc-table').attributes;
    expect(props).toEqual(expect.objectContaining(miscProps));
  });

  it('renders aria- attributes', () => {
    const miscProps = { 'aria-label': 'names-table-aria' };
    const { container } = render(createTable(miscProps));
    const props = container.querySelector('table').attributes;
    expect(props).toEqual(expect.objectContaining(miscProps));
  });

  describe('rowKey', () => {
    it('uses record.key', () => {
      const { container } = render(createTable());
      expect(container.querySelectorAll('tbody tr')[0].key).toBe('key0');
      expect(container.querySelectorAll('tbody tr')[1].key).toBe('key1');
    });

    it('sets by rowKey', () => {
      const { container } = render(createTable({ rowKey: 'name' }));
      expect(container.querySelectorAll('tbody tr')[0].key).toBe('Lucy');
      expect(container.querySelectorAll('tbody tr')[1].key).toBe('Jack');
    });

    it('sets by rowKey function', () => {
      const { container } = render(createTable({ rowKey: record => `${record.key}1` }));
      expect(container.querySelectorAll('tbody tr')[0].key).toBe('key01');
      expect(container.querySelectorAll('tbody tr')[1].key).toBe('key11');
    });
  });

  describe('caption', () => {
    it('renders string caption', () => {
      const miscProps = { caption: 'test_caption' };
      const { container } = render(createTable(miscProps));
      expect(container.querySelector('.rc-table-caption')).toBeTruthy();
    });

    it('renders React.Node caption', () => {
      const miscProps = { caption: <div className="caption_inner" /> };
      const { container } = render(createTable(miscProps));
      expect(container.querySelector('.rc-table-caption .caption_inner')).toBeTruthy();
    });

    it('renders without caption', () => {
      const miscProps = {};
      const { container } = render(createTable(miscProps));
      expect(container.querySelector('.rc-table-caption')).toBeFalsy();
    });
  });

  it('renders tableLayout', () => {
    const { container } = render(createTable({ tableLayout: 'fixed' }));
    expect(container.querySelector('table').style.tableLayout).toEqual('fixed');
    expect(container.querySelector('div.rc-table').classList.contains('rc-table-layout-fixed')).toBeTruthy();
  });

  it('renders ellipsis', () => {
    const { container } = render(
      createTable({
        columns: [
          { title: 'title', ellipsis: true },
          { title: 'node title', ellipsis: true, render: () => <h1>233</h1> },
        ],
      }),
    );

    container.querySelectorAll('td').forEach(td => {
      expect(td.classList.contains('rc-table-cell-ellipsis')).toBeTruthy();
    });
  });

  it('renders ellipsis by showTitle option', () => {
    const { container } = render(
      createTable({
        columns: [
          { title: 'title', ellipsis: { showTitle: true } },
          { title: 'node title', ellipsis: { showTitle: true }, render: () => <h1>233</h1> },
        ],
      }),
    );

    container.querySelectorAll('td').forEach(td => {
      expect(td.classList.contains('rc-table-cell-ellipsis')).toBeTruthy();
    });
  });

  it('not renders ellipsis origin html title', () => {
    const columns = [
      { title: 'title', ellipsis: { showTitle: false } },
      { title: 'node title', ellipsis: { showTitle: false }, render: () => <h1>233</h1> },
    ];
    const { container } = render(
      createTable({
        columns,
      }),
    );

    container.querySelectorAll('.rc-table-thead th').forEach(td => {
      expect(td.getAttribute('title')).toBeTruthy();
    });

    container.querySelectorAll('.rc-table-tbody td').forEach(td => {
      expect(td.getAttribute('title')).toBeFalsy();
    });
  });

  describe('scope', () => {
    it('renders columns scope correctly', () => {
      const { container } = render(
        createTable({
          columns: [
            {
              title: 'Name',
            },
            {
              title: 'Contact',
              children: [
                {
                  title: 'Email',
                },
                {
                  title: 'Phone Number',
                },
              ],
            },
          ],
        }),
      );

      expect(container.querySelectorAll('thead th')[0].getAttribute('scope')).toEqual('col');
      expect(container.querySelectorAll('thead th')[1].getAttribute('scope')).toEqual('colgroup');
      expect(container.querySelectorAll('thead th')[2].getAttribute('scope')).toEqual('col');
      expect(container.querySelectorAll('thead th')[3].getAttribute('scope')).toEqual('col');
    });

    it('renders rows scope correctly', () => {
      const { container } = render(
        createTable({
          columns: [
            {
              title: 'Time',
              dataIndex: 'time',
              key: 'time',
              rowScope: 'row',
            },
          ],
          data: [
            { time: '09:00 - 11:00', key: '1' },
            { time: '11:00 - 13:00', key: '2' },
          ],
        }),
      );

      expect(container.querySelectorAll('tbody th')[0].getAttribute('scope')).toEqual('row');
      expect(container.querySelectorAll('tbody th')[1].getAttribute('scope')).toEqual('row');
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
    const { container } = render(createTable({ columns }));
    container.querySelectorAll('td').forEach((td, index) => {
      expect(td.classList.contains('name-class')).toBeTruthy();
      expect(td.textContent).toEqual(['Lucy', 'Jack'][index]);
    });

    expect(container.querySelector('col').style).toEqual(expect.objectContaining({ width: '100px' }));
  });

  it('renders custom cell correctly', () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        render: text => <p>!!!{text}!!!</p>,
      },
    ];
    const { container } = render(createTable({ columns }));
    container.querySelectorAll('td').forEach((td, index) => {
      expect(td.textContent).toEqual(['!!!Lucy!!!', '!!!Jack!!!'][index]);
    });
  });

  describe('dataIndex', () => {
    it("pass record to render when it's falsy", () => {
      [null, undefined, '', []].forEach(dataIndex => {
        const cellRender = vi.fn();
        const columns = [
          {
            title: 'Name',
            dataIndex,
            key: 'name',
            render: cellRender,
          },
        ];
        render(createTable({ columns }));
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
      const { container } = render(createTable({ columns, data: localData }));

      const targetData = [
        ['John', 'Doe'],
        ['Terry', 'Garner'],
      ];

      container.querySelectorAll('tbody tr').forEach((tr, ri) => {
        tr.querySelectorAll('td').forEach((td, di) => {
          expect(td.textContent).toEqual(targetData[ri][di]);
        });
      });
    });
  });

  it('render empty cell if text is empty object', () => {
    const localData = [
      { key: 'key0', name: {} },
      { key: 'key1', name: 'Jack' },
    ];
    const { container } = render(createTable({ data: localData }));
    expect(container.querySelector('table td').textContent).toBe('');
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
    const { container } = render(createTable({ columns, data: localData }));
    expect(container).toMatchSnapshot();
  });

  it('render with style & className & data-*', () => {
    const columns = [
      {
        dataIndex: 'key',
        render: text => ({
          props: {
            style: { background: 'red' },
            className: 'customize-render',
            'data-light': 'bamboo',
          },
          children: text,
        }),
      },
    ];

    const { container } = render(<Table columns={columns} data={[{ key: '' }]} />);
    const props = container.querySelector('tbody td').attributes;
    expect(props.style).toEqual(expect.objectContaining({ background: 'red' }));
    expect(props.className.includes('customize-render')).toBeTruthy();
    expect(props['data-light']).toEqual('bamboo');
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
    const { container } = render(createTable({ columns, data: localData }));
    expect(container).toMatchSnapshot();
  });

  it('shows error if no rowKey specify', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const localData = [{ name: 'Lucy' }, { name: 'Jack' }];
    render(createTable({ data: localData }));
    expect(spy.mock.calls[0][0]).toMatch(
      'Warning: Each record in table should have a unique `key` prop, or set `rowKey` to an unique primary key.',
    );
    spy.mockRestore();
  });

  it('renders correctly RowClassName as string', () => {
    const { container } = render(
      createTable({
        rowClassName: 'test-row-class-name-asStr',
      }),
    );

    container.querySelectorAll('tbody tr').forEach(tr => {
      expect(tr.classList.contains('test-row-class-name-asStr')).toBeTruthy();
    });
    expect(container.querySelectorAll('tbody tr')).toBeTruthy();
  });

  it('renders correctly RowClassName as function', () => {
    const { container } = render(
      createTable({
        rowClassName: () => 'test-row-class-name-asFn',
      }),
    );

    container.querySelectorAll('tbody tr').forEach(tr => {
      expect(tr.classList.contains('test-row-class-name-asFn')).toBeTruthy();
    });
    expect(container.querySelectorAll('tbody tr')).toBeTruthy();
  });

  describe('onRow', () => {
    it('renders onRow correctly', () => {
      const onRow = (record, index) => ({
        id: `row-${record.key}`,
        index,
      });
      const { container } = render(createTable({ onRow }));

      expect(container.querySelectorAll('tbody tr')).toBeTruthy();
      container.querySelectorAll('tbody tr').forEach((tr, index) => {
        expect(tr.id).toEqual(`row-${data[index].key}`);
        expect(() => fireEvent.click(tr)).not.toThrowError();
      });
    });

    it('onRow should keep update', () => {
      const Test = () => {
        const [count, setCount] = React.useState(0);

        return (
          <div>
            <Table
              columns={[{ dataIndex: 'key' }]}
              data={[{ key: 0 }]}
              onRow={() => ({
                onClick() {
                  setCount(count + 1);
                },
              })}
            />
            <span id="count">{count}</span>
          </div>
        );
      };
      const { container } = render(<Test />);
      for (let i = 0; i < 10; i += 1) {
        fireEvent.click(container.querySelector('tbody tr td').last());
        expect(container.querySelector('#count').textContent).toEqual(String(i + 1));
      }
    });
  });

  it('renders column.onCell correctly', () => {
    const onCell = record => ({
      id: `cell-${record.name}`,
    });
    const columns = [{ title: 'Name', dataIndex: 'name', key: 'name', onCell }];
    const { container } = render(createTable({ columns }));

    expect(container.querySelectorAll('tbody td')).toHaveLength(2);
    container.querySelectorAll('tbody td').forEach((td, index) => {
      expect(td.id).toEqual(`cell-${data[index].name}`);
    });
  });

  it('renders onHeaderRow correctly', () => {
    const onHeaderRow = vi.fn((columns, index) => ({
      id: `header-row-${index}`,
    }));
    const { container } = render(createTable({ onHeaderRow }));

    expect(container.querySelector('thead tr').id).toEqual('header-row-0');
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
    const { container } = render(createTable({ columns }));

    expect(container.querySelectorAll('thead th')).toHaveLength(1);
    expect(container.querySelector('thead th').id).toEqual('header-cell-name');
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
      const { container } = render(createTable({ components }));
      expect(container).toMatchSnapshot();
    });

    it('renders fixed column and header correctly', () => {
      const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name', fixed: 'left' },
        { title: 'Age', dataIndex: 'age', key: 'age' },
        { title: 'Gender', dataIndex: 'gender', key: 'gender', fixed: 'right' },
      ];
      const sampleData = [{ key: 0, name: 'Lucy', age: 27, gender: 'F' }];
      const { container } = render(
        createTable({
          columns,
          data: sampleData,
          components,
          scroll: { x: 100, y: 100 },
        }),
      );
      expect(container).toMatchSnapshot();
    });

    describe('scroll content', () => {
      it('with scroll', () => {
        resetWarned();
        const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const { container } = render(
          createTable({
            columns: [{ dataIndex: 'a' }, { dataIndex: 'b', width: 903 }],
            components: {
              body: () => <h1>Bamboo</h1>,
            },
            scroll: { x: 100, y: 100 },
          }),
        );
        expect(container).toMatchSnapshot();

        expect(errSpy).toHaveBeenCalledWith(
          'Warning: When use `components.body` with render props. Each column should have a fixed `width` value.',
        );
        errSpy.mockRestore();
      });
    });

    it('without warning - columns is empty', () => {
      resetWarned();
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(
        createTable({
          columns: [],
          components: {
            body: () => <h1>Bamboo</h1>,
          },
          scroll: { x: 100, y: 100 },
        }),
      );
      expect(errSpy).not.toHaveBeenCalledWith(
        'Warning: When use `components.body` with render props. Each column should have a fixed `width` value.',
      );
      errSpy.mockRestore();
    });

    it('not crash', () => {
      const Looper = React.forwardRef(() => <td />);
      Looper.looper = Looper;

      render(
        createTable({
          components: {
            body: {
              cell: Looper,
            },
          },
        }),
      );
    });
  });

  it('align column', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age', align: 'center' },
    ];
    const { container } = render(createTable({ columns }));
    expect(container.querySelectorAll('th')[0].style.textAlign).toBeFalsy();
    expect(container.querySelectorAll('th')[1].style.textAlign).toEqual('center');
    expect(container.querySelectorAll('tbody tr')[0].querySelectorAll('td')[0].style.textAlign).toBeFalsy();
    expect(container.querySelectorAll('tbody tr')[0].querySelectorAll('td')[1].style.textAlign).toEqual(
      'center',
    );
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
    const { container } = render(createTable({ columns }));
    expect(container.querySelector('th').style).toEqual({
      color: 'green',
      textAlign: 'center',
    });
    expect(container.querySelector('td').style).toEqual({
      color: 'red',
      textAlign: 'center',
    });
  });

  it('hidden columns', () => {
    const { container } = render(
      createTable({
        columns: [
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
            hidden: true,
          },
        ],
      }),
    );
    expect(container.querySelectorAll('th')[0].textContent).toEqual('姓名');
    expect(container.querySelectorAll('th')[1]).toHaveLength(0);
  });

  describe('row events', () => {
    let spy;

    beforeAll(() => {
      spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      spy.mockReset();
    });

    afterAll(() => {
      spy.mockRestore();
    });

    it('fires row click event', () => {
      const onClick = vi.fn();
      const { container } = render(createTable({ onRow: () => ({ onClick }) }));
      const tr = container.querySelectorAll('tbody tr')[0];

      fireEvent.click(tr);
      expect(onClick).toHaveBeenCalledWith(
        expect.objectContaining({
          target: tr,
        }),
      );
    });

    it('fires double row click event', () => {
      const onDoubleClick = vi.fn();
      const { container } = render(createTable({ onRow: () => ({ onDoubleClick }) }));
      const tr = container.querySelectorAll('tbody tr')[0];

      fireEvent.doubleClick(tr);
      expect(onDoubleClick).toHaveBeenCalledWith(
        expect.objectContaining({
          target: tr,
        }),
      );
    });

    it('fires row contextmenu event', () => {
      const onContextMenu = vi.fn();
      const { container } = render(createTable({ onRow: () => ({ onContextMenu }) }));
      const tr = container.querySelectorAll('tbody tr')[0];

      fireEvent.contextMenu(tr);
      expect(onContextMenu).toHaveBeenCalledWith(
        expect.objectContaining({
          target: tr,
        }),
      );
    });

    it('fires onRowMouseEnter', () => {
      const onMouseEnter = vi.fn();
      const { container } = render(
        createTable({
          onRow: () => ({ onMouseEnter }),
        }),
      );

      const tr = container.querySelector('.rc-table-row');

      fireEvent.mouseEnter(tr);
      expect(onMouseEnter).toHaveBeenCalledWith(
        expect.objectContaining({
          target: tr,
        }),
      );
    });

    it('fires onRowMouseLeave', () => {
      const onMouseLeave = vi.fn();
      const { container } = render(
        createTable({
          onRow: () => ({ onMouseLeave }),
        }),
      );

      const tr = container.querySelector('.rc-table-row');

      fireEvent.mouseLeave(tr);
      expect(onMouseLeave).toHaveBeenCalledWith(
        expect.objectContaining({
          target: tr,
        }),
      );
    });
  });

  it('columns without key', () => {
    const { container } = render(
      createTable({
        columns: [{ dataIndex: null }],
      }),
    );

    expect(container.querySelector('tbody').querySelector(Cell).key).toBeTruthy();
  });

  it('syntactic sugar', () => {
    const { Column, ColumnGroup } = Table;
    expect(
      render(
        <Table>
          <ColumnGroup title="total">
            <Column title="Name" dataIndex="name" />
          </ColumnGroup>
          Invalidate Column
        </Table>,
      ).container,
    ).toMatchSnapshot();
  });

  describe('internal api', () => {
    describe('transformColumns', () => {
      it('basic', () => {
        const { container } = render(
          createTable({
            internalHooks: INTERNAL_HOOKS,
            transformColumns: columns => [{ title: 'before' }, ...columns, { title: 'after' }],
          }),
        );

        expect(container).toMatchSnapshot();
      });

      // Used for antd to check if is expand column
      // We'd better to move selection into rc-table also
      it('internal columnType', () => {
        let existExpandColumn = false;

        render(
          createTable({
            expandable: {
              expandedRowRender: () => null,
            },
            internalHooks: INTERNAL_HOOKS,
            transformColumns: columns => {
              existExpandColumn = columns.some(
                col => col[INTERNAL_COL_DEFINE]?.columnType === 'EXPAND_COLUMN',
              );
              return columns;
            },
          }),
        );

        expect(existExpandColumn).toBeTruthy();
      });
    });

    it('internalRefs', () => {
      const internalRefs = {
        body: React.createRef(),
      };

      render(
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

  it('column render array', () => {
    const { container } = render(
      <Table
        columns={[{ dataIndex: 'test', render: () => [<span className="test" key="test" />] }]}
        data={[{ key: 1 }]}
      />,
    );
    expect(container.querySelector('.test')).toHaveLength(1);
  });

  it('component body should pass `data-row-key`', () => {
    const { container } = render(
      <Table
        columns={[{ dataIndex: 'test' }]}
        components={{ body: { row: props => <tr {...props} /> } }}
        data={[{ test: 'bamboo', key: 'light' }]}
      />,
    );

    expect(container.querySelector('tr').last().getAttribute('data-row-key')).toEqual('light');
  });

  it('render with state change', () => {
    class Test extends React.Component {
      state = {
        change: false,
        columns: [
          {
            render: () => String(this.state.change),
          },
        ],
      };

      render() {
        return <Table columns={this.state.columns} data={[{ key: 1 }]} />;
      }
    }

    const { container } = render(<Test />);
    expect(container.querySelector('tbody td').textContent).toEqual('false');

    fireEvent.click(container.querySelector('button'));
    expect(container.querySelector('tbody td').textContent).toEqual('true');
  });

  it('not crash with raw data', () => {
    expect(() => {
      render(
        createTable({
          data: [122, null, '2333', true, undefined],
        }),
      );
    }).not.toThrow();
  });

  describe('shouldCellUpdate', () => {
    it('basic1', () => {
      const record = { key: 1 };
      let shouldUpdate = false;
      let renderTimes = 0;
      let prev;
      let next;

      const Demo = ({ records }) => {
        const [, forceUpdate] = React.useState({});

        return (
          <>
            <Table
              data={records}
              columns={[
                {
                  dataIndex: 'key',
                  shouldCellUpdate: (nextRecord, prevRecord) => {
                    next = nextRecord;
                    prev = prevRecord;
                    return shouldUpdate;
                  },
                  render() {
                    renderTimes += 1;
                    return null;
                  },
                },
              ]}
            />
            <button
              type="button"
              onClick={() => {
                forceUpdate({});
              }}
            />
          </>
        );
      };

      const { container } = render(<Demo records={[record]} />);
      renderTimes = 0;

      fireEvent.click(container.querySelector('button'));
      expect(renderTimes).toEqual(0);

      shouldUpdate = true;
      fireEvent.click(container.querySelector('button'));
      expect(renderTimes).toEqual(1);

      // Should update match prev & next
      const newRecord = { ...record, next: true };
      render(<Demo records={[newRecord]} />);
      expect(prev).toBe(record);
      expect(next).toBe(newRecord);
    });

    it('not block nest children', () => {
      const onExpandedRowsChange = vi.fn();

      const { container } = render(
        <Table
          columns={[{ dataIndex: 'key', shouldCellUpdate: () => false }]}
          expandable={{ onExpandedRowsChange }}
          data={[
            {
              key: 'parent',
              children: [
                { key: 'light', children: [] },
                { key: 'bamboo', children: [{ key: 'little' }] },
              ],
            },
          ]}
        />,
      );

      // First Level - parent
      fireEvent.click(container.querySelector('span.rc-table-row-expand-icon'));
      expect(
        container.querySelector('span.rc-table-row-expand-icon').classList.contains('rc-table-row-expanded'),
      ).toBeTruthy();

      // Second Level - light twice
      onExpandedRowsChange.mockReset();
      fireEvent.click(container.querySelectorAll('span.rc-table-row-expand-icon')[1]);
      expect(onExpandedRowsChange).toHaveBeenCalledWith(['parent', 'light']);

      onExpandedRowsChange.mockReset();
      fireEvent.click(container.querySelectorAll('span.rc-table-row-expand-icon')[1]);
      expect(onExpandedRowsChange).toHaveBeenCalledWith(['parent']);

      // Second Level - bamboo
      onExpandedRowsChange.mockReset();
      fireEvent.click(container.querySelector('span.rc-table-row-expand-icon').last());
      expect(onExpandedRowsChange).toHaveBeenCalledWith(['parent', 'bamboo']);
    });
  });

  it('render index in tree table', () => {
    const tColumns = [
      {
        title: 'Key',
        dataIndex: 'key',
      },
      {
        title: '行索引',
        key: 'xxx',
        render: (value, record, index) => index,
      },
    ];

    const tData = [
      { key: 'row0', children: [{ key: 'row0-0' }, { key: 'row0-1' }] },
      { key: 'row1', children: [{ key: 'row1-0' }, { key: 'row1-1' }] },
    ];
    const { container } = render(
      <Table columns={tColumns} expandable={{ defaultExpandAllRows: true }} data={tData} />,
    );

    const trs = container.querySelectorAll('BodyRow');

    expect(trs[0].querySelectorAll('Cell')[1].textContent).toEqual('0');
    expect(trs[1].querySelectorAll('Cell')[1].textContent).toEqual('0');
    expect(trs[2].querySelectorAll('Cell')[1].textContent).toEqual('1');
    expect(trs[3].querySelectorAll('Cell')[1].textContent).toEqual('1');
    expect(trs[4].querySelectorAll('Cell')[1].textContent).toEqual('0');
    expect(trs[5].querySelectorAll('Cell')[1].textContent).toEqual('1');
  });

  it('hover the tree table', () => {
    const tColumns = [
      {
        title: 'Key',
        dataIndex: 'key',
      },
    ];

    const tData = [
      { key: 'row0', children: [{ key: 'row0-0' }, { key: 'row0-1' }] },
      { key: 'row1', children: [{ key: 'row1-0' }, { key: 'row1-1' }] },
    ];
    const { container } = render(
      <Table columns={tColumns} expandable={{ defaultExpandAllRows: true }} data={tData} />,
    );

    const trs = container.querySelectorAll('tr.rc-table-row');

    trs.forEach((tr, index) => {
      fireEvent.mouseEnter(tr.querySelectorAll('td.rc-table-cell')[0]);
      const currentClassName = container
        .querySelectorAll('tr.rc-table-row')[index]
        .querySelectorAll('td.rc-table-cell')[0]
        .classList.contains('rc-table-cell-row-hover');

      expect(currentClassName).toEqual(true);
      expect(container.querySelectorAll('td.rc-table-cell-row-hover')).toHaveLength(1);
    });
  });

  it('when rowHoverable is false', () => {
    const tColumns = [
      {
        title: 'Key',
        dataIndex: 'key',
      },
    ];

    const tData = [
      { key: 'row0', children: [{ key: 'row0-0' }, { key: 'row0-1' }] },
      { key: 'row1', children: [{ key: 'row1-0' }, { key: 'row1-1' }] },
    ];
    const { container } = render(
      <Table
        columns={tColumns}
        expandable={{ defaultExpandAllRows: true }}
        data={tData}
        rowHoverable={false}
      />,
    );

    const trs = container.querySelectorAll('tr.rc-table-row');

    trs.forEach((tr, index) => {
      fireEvent.mouseEnter(tr.querySelectorAll('td.rc-table-cell')[0]);
      const currentClassName = container
        .querySelectorAll('tr.rc-table-row')[index]
        .querySelectorAll('td.rc-table-cell')[0]
        .classList.contains('rc-table-cell-row-hover');

      expect(currentClassName).toEqual(false);
      expect(container.querySelectorAll('td.rc-table-cell-row-hover')).toHaveLength(0);
    });
  });

  it('should get scrollbar size', () => {
    const tColumns = [{ title: 'Name', dataIndex: 'name', key: 'name', width: 100 }];
    const { container } = render(
      createTable({
        columns: tColumns,
        scroll: { y: 100 },
        components: {
          body: () => <React.Fragment />,
        },
      }),
    );
    expect(container).toMatchSnapshot();
    expect(container.querySelectorAll('col')).toHaveLength(tColumns.length + 1);
  });
  it('columns support JSX condition', () => {
    const Example = () => {
      const [count, setCount] = React.useState(0);
      const columns = [
        {
          title: 'title',
          dataIndex: 'a',
          render: () => count,
        },
        count === 1 && {
          title: 'title2',
          dataIndex: 'b',
          render: () => count + 1,
        },
        count === 2
          ? {
              title: 'title3',
              dataIndex: 'c',
              render: () => count + 1,
            }
          : null,
      ];
      return (
        <>
          <button
            onClick={() => {
              setCount(val => val + 1);
            }}
          >
            Click {count} times
          </button>
          <Table columns={columns} data={data} />
        </>
      );
    };
    const { container } = render(<Example />);

    fireEvent.click(container.querySelector('button'));
    expect(container.querySelectorAll('.rc-table-cell')[1].textContent).toEqual('title2');

    fireEvent.click(container.querySelector('button'));
    expect(container.querySelectorAll('.rc-table-cell')[1].textContent).toEqual('title3');

    expect(container).toMatchSnapshot();
  });

  it('using both column children and component body simultaneously', () => {
    const width = 150;
    const noChildColLen = 4;
    const ChildColLen = 4;
    const buildChildDataIndex = n => `col${n}`;
    const columns = Array.from({ length: noChildColLen }, (_, i) => ({
      title: `第 ${i} 列`,
      dataIndex: buildChildDataIndex(i),
      width,
    })).concat(
      Array.from({ length: ChildColLen }, (_, i) => ({
        title: `第 ${i} 分组`,
        dataIndex: `parentCol${i}`,
        width: width * 2,
        children: [
          {
            title: `第 ${noChildColLen + i} 列`,
            dataIndex: buildChildDataIndex(noChildColLen + i),
            width,
          },
          {
            title: `第 ${noChildColLen + 1 + i} 列`,
            dataIndex: buildChildDataIndex(noChildColLen + 1 + i),
            width,
          },
        ],
      })),
    );
    const data = Array.from({ length: 10000 }, (_, r) => {
      const colLen = noChildColLen + ChildColLen * 2;
      const record = {};
      for (let c = 0; c < colLen; c++) {
        record[buildChildDataIndex(c)] = `r${r}, c${c}`;
      }
      return record;
    });
    const Demo = props => {
      const gridRef = React.useRef();
      const [connectObject] = React.useState(() => {
        const obj = {};
        Object.defineProperty(obj, 'scrollLeft', {
          get: () => {
            if (gridRef.current) {
              return gridRef.current?.state?.scrollLeft;
            }
            return null;
          },
          set: scrollLeft => {
            if (gridRef.current) {
              gridRef.current.scrollTo({ scrollLeft });
            }
          },
        });

        return obj;
      });

      React.useEffect(() => {
        gridRef.current.resetAfterIndices({
          columnIndex: 0,
          shouldForceUpdate: false,
        });
      }, []);

      const renderVirtualList = (rawData, { scrollbarSize, ref, onScroll }) => {
        ref.current = connectObject;
        return (
          <Grid
            ref={gridRef}
            className="virtual-grid"
            columnCount={columns.length}
            columnWidth={index => {
              const { width } = columns[index];
              return index === columns.length - 1 ? width - scrollbarSize - 1 : width;
            }}
            height={300}
            rowCount={rawData.length}
            rowHeight={() => 50}
            width={800}
            onScroll={({ scrollLeft }) => {
              onScroll({ scrollLeft });
            }}
          >
            {({ columnIndex, rowIndex, style }) => (
              <div
                className={`virtual-cell ${
                  columnIndex === columns.length - 1 ? 'virtual-cell-last' : ''
                }`}
                style={style}
              >
                r{rowIndex}, c{columnIndex}
              </div>
            )}
          </Grid>
        );
      };

      return (
        <Table
          style={{ width: 800 }}
          tableLayout="fixed"
          columns={props.columns}
          data={props.data}
          scroll={{ y: 300, x: 300 }}
          components={{
            body: renderVirtualList,
          }}
        />
      );
    };
    const { container } = render(<Demo columns={columns} data={data} />);
    expect(
      container
        .querySelectorAll('col')[noChildColLen + ChildColLen * 2 - 1]
        .style.width + container.querySelectorAll('col').last().style.width,
    ).toEqual(width);
  });

  it('onScroll event', () => {
    const onScroll = vi.fn();
    const { container } = render(
      createTable({
        onScroll,
        scroll: { x: 100, y: 100 },
      }),
    );

    fireEvent.scroll(container.querySelector('.rc-table-body'));
    expect(onScroll).toHaveBeenCalled();
  });
});
