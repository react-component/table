import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Table from '../src';

describe('Table.ClassComponent', () => {
  it('should re-render', () => {
    class Demo extends React.Component<{}, { count: number }> {
      state = { count: 0 };

      renderColumn = () => this.state.count;

      data = [{ key: 0 }];

      columns = [
        {
          render: this.renderColumn,
        },
      ];

      render() {
        const { count } = this.state;

        return (
          <>
            <button onClick={() => this.setState({ count: count + 1 })}>{count}</button>
            <Table columns={this.columns} data={this.data} />
          </>
        );
      }
    }

    const { getByRole, container } = render(<Demo />);
    expect(getByRole('button').textContent).toEqual('0');
    const tdElements = container.querySelectorAll('td');
    expect(tdElements[tdElements.length - 1].textContent).toEqual('0');

    fireEvent.click(getByRole('button'));
    expect(getByRole('button').textContent).toEqual('1');
    const updatedTdElements = container.querySelectorAll('td');
    expect(updatedTdElements[updatedTdElements.length - 1].textContent).toEqual('1');
  });
});
