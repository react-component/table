import { render } from '@testing-library/react';
import React from 'react';
import Table from '../src';

describe('Table.ColSpan', () => {
  it('hover the tree table', () => {
    const { container } = render(
      <Table
        columns={[
          {
            title: 'Parent',
            key: 'parent',
            children: [
              {
                title: 'name',
                key: 'name',
                dataIndex: 'name',
                onHeaderCell: () => ({
                  colSpan: 2,
                }),
              },
              {
                title: 'age',
                key: 'age',
                dataIndex: 'age',
                onHeaderCell: () => ({ colSpan: 0 }),
              },
            ],
          },
        ]}
        data={[
          {
            key: '1',
            name: 'Little',
            age: 2,
          },
        ]}
      />,
    );

    // 2 rows
    expect(container.querySelector('thead').querySelectorAll('tr')).toHaveLength(2);

    // one cell
    const lastTr = container.querySelector('thead').querySelectorAll('tr')[1];
    expect(lastTr.querySelectorAll('th')).toHaveLength(1);
    expect(lastTr.querySelector('th')).toHaveAttribute('colSpan', '2');

    // Data 2 cells
    expect(
      container.querySelector('tbody').querySelectorAll('tr')[0].querySelectorAll('td'),
    ).toHaveLength(2);
  });
});
