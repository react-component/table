/* eslint-disable no-undef, no-console */
import React from 'react';
import { mount } from 'enzyme';
import Table, { INTERNAL_COL_DEFINE } from '../src';

describe('Table.colgroup', () => {
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
});
