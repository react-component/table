import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Table from '../src';

describe('Table.Cell', () => {
  it('shouldCellUpdate', () => {
    let reRenderTime = 0;

    const Demo = () => {
      const [, forceUpdate] = React.useState({});

      return (
        <>
          <Table
            data={[{ key: 'light' }]}
            columns={[
              {
                shouldCellUpdate: (record, prevRecord) => prevRecord.key !== record.key,
                dataIndex: 'key',
                render: value => {
                  reRenderTime += 1;
                  return value;
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

    const { getByRole } = render(<Demo />);
    reRenderTime = 0;

    for (let i = 0; i < 100; i += 1) {
      fireEvent.click(getByRole('button'));
      expect(reRenderTime).toEqual(0);
    }
  });

  it('shouldCellUpdate not block className', () => {
    const getColumns = (props?: object) => [
      {
        shouldCellUpdate: (record, prevRecord) => prevRecord.key !== record.key,
        dataIndex: 'key',
        render: value => {
          return value;
        },
        ...props,
      },
    ];

    const { container, rerender } = render(
      <Table data={[{ key: 'light' }]} columns={getColumns()} />,
    );
    const cellEl = container.querySelector('.rc-table-tbody .rc-table-cell');
    expect(cellEl).not.toHaveClass('test');

    // Update className should re-render
    rerender(<Table data={[{ key: 'light' }]} columns={getColumns({ className: 'test' })} />);
    expect(container.querySelector('.rc-table-tbody .rc-table-cell')).toHaveClass('test');
  });

  it('closure should work on render', () => {
    class Demo extends React.Component {
      state = {
        value: 1,
      };

      columns = [
        {
          render: () => this.state.value,
        },
      ];

      data = [{ key: 0 }];

      render() {
        return (
          <>
            <Table columns={this.columns} data={this.data} />
            <button
              onClick={() => {
                this.setState({
                  value: 2,
                });
              }}
            />
          </>
        );
      }
    }

    const { container, getByRole } = render(<Demo />);
    const cellEl = container.querySelector('.rc-table-tbody .rc-table-cell');
    expect(cellEl?.textContent).toEqual('1');

    fireEvent.click(getByRole('button'));
    expect(container.querySelector('.rc-table-tbody .rc-table-cell')?.textContent).toEqual('2');
  });

  it('onHeaderCell', () => {
    const { container } = render(
      <Table
        columns={[
          {
            title: (
              <div>
                <p>NotYet</p>
              </div>
            ),
            onHeaderCell: () => ({
              title: 'Bamboo',
            }),
          },
        ]}
      />,
    );

    const thEl = container.querySelector('thead th');
    expect(thEl).toHaveAttribute('title', 'Bamboo');
  });

  // https://github.com/ant-design/ant-design/issues/51763
  it('style merge order', () => {
    const { container } = render(
      <Table
        columns={[
          {
            align: 'center',
            onHeaderCell: () => ({
              style: {
                color: 'red',
                textAlign: 'end', // overwrite align
              },
            }),
          },
        ]}
      />,
    );

    const thEl = container.querySelector<HTMLTableCellElement>('thead th');
    expect(thEl?.style.color).toEqual('red');
    expect(thEl?.style.textAlign).toEqual('end');
  });
});
