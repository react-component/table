import { mount } from 'enzyme';
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

    const wrapper = mount(<Demo />);
    expect(wrapper.find('button').text()).toEqual('0');
    expect(wrapper.find('td').last().text()).toEqual('0');

    wrapper.find('button').simulate('click');
    expect(wrapper.find('button').text()).toEqual('1');
    expect(wrapper.find('td').last().text()).toEqual('1');
  });
});
