import React from 'react';
import { mount } from 'enzyme';
import Table from '../src';

describe('Table.Cell', () => {
  it('shouldCellUpdate', () => {
    let renderTime = 0;

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
                  renderTime += 1;
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

    for (let i = 0; i < 100; i += 1) {
      wrapper.find('button').simulate('click');
      expect(renderTime).toEqual(1);
    }
  });
});
