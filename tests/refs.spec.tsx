import { render } from '@testing-library/react';
import React from 'react';
import Table, { type Reference } from '../src';

describe('Table.Ref', () => {
  it('support reference', () => {
    const ref = React.createRef<Reference>();

    const { container } = render(
      <Table
        data={[{ key: 'light' }]}
        columns={[
          {
            dataIndex: 'key',
          },
        ]}
        reference={ref}
        scroll={{
          y: 10,
        }}
      />,
    );

    expect(ref.current.nativeElement).toBe(container.querySelector('.rc-table'));
  });
});
