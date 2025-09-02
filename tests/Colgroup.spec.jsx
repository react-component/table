import React from 'react';
import { render } from '@testing-library/react';
import Table, { INTERNAL_COL_DEFINE } from '../src';
import Cell from '../src/Cell';

describe('Table.ColGroup', () => {
  it('internal props should render', () => {
    const columns = [
      {
        key: 'test',
        [INTERNAL_COL_DEFINE]: { className: 'show-in-col' },
      },
    ];
    const { container } = render(<Table columns={columns} />);
    const colEl = container.querySelector('colgroup col');
    expect(colEl?.className).toEqual('show-in-col');
  });

  it('correct key', () => {
    const column1 = {
      key: 'bamboo',
      width: 1,
    };

    const column2 = {
      key: 'little',
      width: 1,
    };

    const column3 = {
      key: 'light',
      width: 1,
    };

    let unmount = 0;

    const ProxyCell = props => {
      React.useEffect(() => {
        return () => {
          unmount += 1;
        };
      }, []);

      return <th {...props} />;
    };

    const { rerender } = render(
      <Table
        columns={[column1, column2]}
        components={{
          header: {
            cell: ProxyCell,
          },
        }}
      />,
    );

    rerender(
      <Table
        columns={[column2, column3]}
        components={{
          header: {
            cell: ProxyCell,
          },
        }}
      />,
    );

    expect(unmount).toEqual(1);
  });

  it('minWidth should be worked', () => {
    const columns = [
      {
        key: 0,
        minWidth: 100,
      },
    ];
    const { container } = render(<Table columns={columns} />);
    const colEl = container.querySelector('colgroup col');
    expect(colEl?.style.minWidth).toEqual('100px');
  });

  it('should not have minWidth when tableLayout is fixed', () => {
    const columns = [
      {
        key: 0,
        width: 100,
        minWidth: 100,
      },
    ];
    const { container } = render(<Table columns={columns} tableLayout="fixed" />);
    const colEl = container.querySelector('colgroup col');
    expect(colEl?.style.minWidth).toBeFalsy();
  });
});
