import { mount } from 'enzyme';
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

    const wrapper = mount(<Demo />);
    reRenderTime = 0;

    for (let i = 0; i < 100; i += 1) {
      wrapper.find('button').simulate('click');
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

    const wrapper = mount(<Table data={[{ key: 'light' }]} columns={getColumns()} />);
    expect(wrapper.find('.rc-table-tbody .rc-table-cell').hasClass('test')).toBeFalsy();

    // Update className should re-render
    wrapper.setProps({
      columns: getColumns({ className: 'test' }),
    });
    expect(wrapper.find('.rc-table-tbody .rc-table-cell').hasClass('test')).toBeTruthy();
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

    const wrapper = mount(<Demo />);
    expect(wrapper.find('.rc-table-tbody .rc-table-cell').text()).toEqual('1');

    wrapper.find('button').simulate('click');
    expect(wrapper.find('.rc-table-tbody .rc-table-cell').text()).toEqual('2');
  });

  it('onHeaderCell', () => {
    const wrapper = mount(
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

    expect(wrapper.find('thead th').prop('title')).toEqual('Bamboo');
  });
});
