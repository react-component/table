import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Table from '../src';

describe('Table.Summary', () => {
  const data = [
    { key: 'key0', name: 'Lucy' },
    { key: 'key1', name: 'Jack' },
  ];
  const createTable = props => {
    const columns = [{ title: 'Name', dataIndex: 'name', key: 'name' }];

    return <Table columns={columns} data={data} {...props} />;
  };

  it('render correctly', () => {
    const { container } = render(
      createTable({
        summary: () => (
          <tr className="summary">
            <td>Good</td>
          </tr>
        ),
      }),
    );

    expect(container.querySelector('tfoot').textContent).toEqual('Good');
  });

  it('support data type', () => {
    const { container } = render(
      <Table
        columns={[
          { dataIndex: 'a', fixed: 'left', width: 10 },
          { dataIndex: 'b', fixed: 'left', width: 20 },
          { dataIndex: 'c', width: 30 },
        ]}
        data={[{ key: 1, a: 2, b: 3, c: 4 }]}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={2} index={0}>
              Light
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>Bamboo</Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="right">
              112.5
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />,
    );

    expect(container.querySelector('tfoot').innerHTML).toMatchSnapshot();
  });

  it('summary row click', async () => {
    const onClick = vi.fn();
    const { container } = render(
      <Table
        columns={[
          { dataIndex: 'a', fixed: 'left', width: 10 },
          { dataIndex: 'b', fixed: 'left', width: 20 },
          { dataIndex: 'c', width: 30 },
        ]}
        data={[{ key: 1, a: 2, b: 3, c: 4 }]}
        summary={() => (
          <Table.Summary.Row onClick={onClick}>
            <Table.Summary.Cell colSpan={2} index={0}>
              Light
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>Bamboo</Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="right">
              112.5
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />,
    );

    const tr = container.querySelector('tfoot tr');
    fireEvent.click(tr);
    expect(onClick).toHaveBeenCalled();
  });

  describe('fixed summary', () => {
    const getSummaryTable = (fixed: boolean | 'top' | 'bottom') =>
      render(
        <Table
          columns={[
            { dataIndex: 'a', fixed: 'left', width: 10 },
            { dataIndex: 'b', width: 20 },
            { dataIndex: 'c', fixed: 'right', width: 30 },
          ]}
          data={[{ key: 1, a: 2, b: 3, c: 4 }]}
          scroll={{ x: 100, y: 100 }}
          summary={() => (
            <Table.Summary fixed={fixed}>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Light</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>Bamboo</Table.Summary.Cell>
                <Table.Summary.Cell index={2}>Little</Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />,
      );

    it('fixed', () => {
      const { container } = getSummaryTable(false);

      expect(container.querySelector('tfoot.rc-table-summary')).toBeTruthy();
    });

    it('fixed bottom', () => {
      const { container } = getSummaryTable('bottom');

      expect(container.querySelector('tfoot.rc-table-summary')).toBeTruthy();
    });

    it('sticky', () => {
      const { container } = getSummaryTable(true);

      expect(container.querySelector('div.rc-table-summary')).toBeTruthy();
    });

    it('fixed top', () => {
      const { container } = getSummaryTable('top');
      expect(container.querySelector('.rc-table-header tfoot.rc-table-summary')).toBeTruthy();
    });
  });
});
