import React from 'react';
import { mount } from 'enzyme';
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
});
