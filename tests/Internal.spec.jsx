import { render } from '@testing-library/react';
import React from 'react';
import Table from '../src';
import { INTERNAL_HOOKS } from '../src/constant';

// All follow test is only for internal usage which should be removed when refactor
describe('Table.Internal', () => {
  it('internal should pass `__PARENT_RENDER_ICON__` for expandable', () => {
    const { container } = render(
      <Table
        internalHooks={INTERNAL_HOOKS}
        columns={[{ dataIndex: 'key' }]}
        data={[{ key: 233 }]}
        expandable={{
          __PARENT_RENDER_ICON__: true,
          expandIcon: () => <div className="expand-icon" />,
        }}
      />,
    );

    expect(container.querySelectorAll('.expand-icon')).toHaveLength(1);
  });
});
