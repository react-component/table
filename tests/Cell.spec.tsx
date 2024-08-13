import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
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

    render(<Demo />);
    reRenderTime = 0;

    for (let i = 0; i < 100; i += 1) {
      fireEvent.click(screen.getByRole('button'));
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

    const { container, rerender } = render(<Table data={[{ key: 'light' }]} columns={getColumns()} />);
    expect(container.querySelector('.rc-table-tbody .rc-table-cell').classList.contains('test')).toBeFalsy();

    // Update className should re-render
    rerender(<Table data={[{ key: 'light' }]} columns={getColumns({ className: 'test' })} />);
    expect(container.querySelector('.rc-table-tbody .rc-table-cell').classList.contains('test')).toBeTruthy();
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

    const { container } = render(<Demo />);
    expect(container.querySelector('.rc-table-tbody .rc-table-cell').textContent).toEqual('1');

    fireEvent.click(screen.getByRole('button'));
    expect(container.querySelector('.rc-table-tbody .rc-table-cell').textContent).toEqual('2');
  });

  it('onHeaderCell', () => {
    render(
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

    expect(screen.getByRole('columnheader').title).toEqual('Bamboo');
  });
});
