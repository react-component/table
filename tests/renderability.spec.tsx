import React from 'react';
import { render } from '@testing-library/react';
import Table from '../src';
import MeasureCell from '../src/Body/MeasureCell';

it('sets the scope for zero column and group titles', () => {
  const { container } = render(
    <Table
      columns={[
        {
          title: 0,
          children: [
            { title: 0, dataIndex: 'a' },
            { title: 'B', dataIndex: 'b' },
          ],
        },
      ]}
      data={[]}
    />,
  );
  const headers = container.querySelectorAll('th');
  expect(headers[0]).toHaveAttribute('scope', 'colgroup');
  expect(headers[1]).toHaveAttribute('scope', 'col');
  expect(headers[1].textContent).toBe('0');
});

it('measures the zero title rather than a blank fallback', () => {
  const { container } = render(
    <table>
      <tbody>
        <tr>
          <MeasureCell title={0} columnKey="a" onColumnResize={() => {}} />
        </tr>
      </tbody>
    </table>,
  );
  expect(container.querySelector('td').textContent).toBe('0');
});
