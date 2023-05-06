import { mount } from 'enzyme';
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

  it('support data type', () => {
    const wrapper = mount(
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

    expect(wrapper.find('tfoot').render()).toMatchSnapshot();
  });

  it('summary row click', async () => {
    const onClick = vi.fn();
    const wrapper = mount(
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

    const tr = wrapper.find('tfoot tr').first();
    tr.simulate('click');
    expect(onClick).toHaveBeenCalled();
  });

  describe('fixed summary', () => {
    const getSummaryTable = (fixed: boolean | 'top' | 'bottom') =>
      mount(
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
      const wrapper = getSummaryTable(false);

      expect(wrapper.exists('tfoot.rc-table-summary')).toBeTruthy();
    });

    it('fixed bottom', () => {
      const wrapper = getSummaryTable('bottom');

      expect(wrapper.exists('tfoot.rc-table-summary')).toBeTruthy();
    });

    it('sticky', () => {
      const wrapper = getSummaryTable(true);

      expect(wrapper.exists('div.rc-table-summary')).toBeTruthy();
    });

    it('fixed top', () => {
      const wrapper = getSummaryTable('top');
      expect(wrapper.exists('.rc-table-header tfoot.rc-table-summary')).toBeTruthy();
    });
  });
});
