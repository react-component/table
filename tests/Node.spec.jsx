import React from 'react';
import { renderToString } from 'react-dom/server';
import Table from '../src';

describe('Table.Node', () => {
  // Remove env variables
  window.Element = null;
  global.Element = null;

  it('not crash in node', () => {
    console.log(Element);

    const html = renderToString(
      <Table
        columns={[{ title: 'Name', dataIndex: 'name', key: 'name' }]}
        data={[{ key: 'key0', name: 'Lucy' }]}
        sticky
      />,
    );

    expect(html).toContain('rc-table');
  });
});
