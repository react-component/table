/* eslint-disable no-undef, no-console */
import React from 'react';
import { mount } from 'enzyme';
import Table from '../src';

describe('Table.colgroup', () => {
  it('internal props should render', () => {
    const columns = [
      {
        key: 'test',
        className: 'show-in-col',
      },
    ];

    const wrapper = mount(<Table columns={columns} />);
    expect(wrapper.find('colgroup col').props().className).toEqual('show-in-col-colgroup-col');
  });
});
