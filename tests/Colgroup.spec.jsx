import { render } from '@testing-library/react';
import React from 'react';
import Table, { INTERNAL_COL_DEFINE } from '../src';

describe('Table.ColGroup', () => {
  it('internal props should render', () => {
    const columns = [
      {
        key: 'test',
        [INTERNAL_COL_DEFINE]: { className: 'show-in-col' },
      },
    ];

    const { container } = render(<Table columns={columns} />);
    expect(container.querySelector('colgroup col').className).toEqual('show-in-col');
  });

  it('correct key', () => {
    const columns = [
      {
        key: 0,
        width: 1,
      },
    ];

    const { container } = render(<Table columns={columns} />);
    expect(String(container.querySelector('colgroup col').key)).toEqual('0');
  });

  it('minWidth should be worked', () => {
    const columns = [
      {
        key: 0,
        minWidth: 100,
      },
    ];

    const { container } = render(<Table columns={columns} />);
    expect(container.querySelector('colgroup col').style.minWidth).toEqual('100px');
  });

  it('should not have minWidth when tableLayout is fixed', () => {
    const columns = [
      {
        key: 0,
        width: 100,
        minWidth: 100,
      },
    ];

