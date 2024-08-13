import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Table from '../src';

describe('Table.ClassComponent', () => {
  it.skip('should re-render', () => {
    class Demo extends React.Component {
      state = {
        count: 0,
      };

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

    const { container } = render(<Demo />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(container.querySelector('td').textContent).toEqual('0');

    fireEvent.click(screen.getByText('0'));
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(container.querySelector('td').textContent).toEqual('1');
  });
});
