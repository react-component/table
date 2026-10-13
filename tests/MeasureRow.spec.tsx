import { render } from '@testing-library/react';
import React from 'react';
import Table from '../src';

describe('Table.MeasureRow', () => {
  it('preserves column classes for generated keys, numeric keys, and grouped leaves', () => {
    const { container } = render(
      <Table
        columns={[
          { title: 'Generated', dataIndex: 'name', className: 'generated-column' },
          { title: 'Numeric', dataIndex: 'age', key: 7, className: 'numeric-column' },
          {
            title: 'Group',
            className: 'group-column',
            children: [{ title: 'Leaf', dataIndex: 'address', className: 'leaf-column' }],
          },
          { title: 'Plain', dataIndex: 'plain' },
        ]}
        data={[{ key: 'row', name: 'Jack', age: 18, address: 'Home', plain: 'Text' }]}
        scroll={{ y: 100 }}
      />,
    );

    const cells = container.querySelectorAll('.rc-table-measure-row > td');

    expect(Array.from(cells, cell => cell.className)).toEqual([
      'generated-column',
      'numeric-column',
      'leaf-column',
      '',
    ]);
    expect(Array.from(cells, cell => cell.textContent)).toEqual([
      'Generated',
      'Numeric',
      'Leaf',
      'Plain',
    ]);
    expect(cells[3]).not.toHaveAttribute('class');
  });

  it('updates and removes the class when the column changes', () => {
    const renderTable = (className?: string) => (
      <Table
        columns={[{ key: 'name', title: 'Name', dataIndex: 'name', className }]}
        data={[{ key: 'row', name: 'Jack' }]}
        scroll={{ y: 100 }}
      />
    );
    const { container, rerender } = render(renderTable('initial-column'));

    expect(container.querySelector('.rc-table-measure-row > td')).toHaveClass('initial-column', {
      exact: true,
    });

    rerender(renderTable('updated-column'));
    expect(container.querySelector('.rc-table-measure-row > td')).toHaveClass('updated-column', {
      exact: true,
    });

    rerender(renderTable());
    expect(container.querySelector('.rc-table-measure-row > td')).not.toHaveAttribute('class');
  });

  it('keeps the measurement hidden and leaves the title ref on the header', () => {
    const titleRef = React.createRef<HTMLSpanElement>();
    const { container } = render(
      <Table
        columns={[
          {
            title: <span ref={titleRef}>A title longer than the body</span>,
            dataIndex: 'name',
            className: 'title-column',
          },
        ]}
        data={[{ key: 'row', name: 'Jack' }]}
        scroll={{ y: 100 }}
      />,
    );

    const row = container.querySelector('.rc-table-measure-row');
    const cell = row.querySelector('td');
    const content = cell.querySelector('div');

    expect(row).toHaveAttribute('aria-hidden', 'true');
    expect(row).toHaveStyle({ height: '0px' });
    expect(cell).toHaveStyle({
      paddingTop: '0px',
      paddingBottom: '0px',
      borderTopWidth: '0px',
      borderBottomWidth: '0px',
      height: '0px',
    });
    expect(content).toHaveStyle({ height: '0px', overflow: 'hidden' });
    expect(content).toHaveTextContent('A title longer than the body');
    expect(titleRef.current).toBe(container.querySelector('thead span'));
    expect(titleRef.current).not.toBe(content.querySelector('span'));
  });
});
