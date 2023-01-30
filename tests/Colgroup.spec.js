import React from 'react';
import { mount } from 'enzyme';
import Table, { INTERNAL_COL_DEFINE } from '../src';

describe('Table.ColGroup', () => {
  it('internal props should render', () => {
    const columns = [
      {
        key: 'test',
        [INTERNAL_COL_DEFINE]: { className: 'show-in-col' },
      },
    ];

    const wrapper = mount(<Table columns={columns} />);
    expect(wrapper.find('colgroup col').props().className).toEqual('show-in-col');
  });

  it('correct key', () => {
    const columns = [
      {
        key: 0,
        width: 1,
      },
    ];

    const wrapper = mount(<Table columns={columns} />);
    expect(String(wrapper.find('colgroup col').key())).toEqual('0');
  });
});
