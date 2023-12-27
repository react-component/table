import { render } from '@testing-library/react';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import React from 'react';
import Table, { type Reference } from '../src';

describe('Table.Ref', () => {
  let scrollParam: any = null;

  beforeAll(() => {
    spyElementPrototypes(HTMLElement, {
      scrollTo: (_: any, param: any) => {
        scrollParam = param;
      },
    });
  });

  beforeEach(() => {
    scrollParam = null;
  });

  it('support reference', () => {
    const ref = React.createRef<Reference>();

    const { container } = render(
      <Table
        data={[{ key: 'light' }, { key: 'bamboo' }]}
        columns={[
          {
            dataIndex: 'key',
          },
        ]}
        ref={ref}
        scroll={{
          y: 10,
        }}
      />,
    );

    expect(ref.current.nativeElement).toBe(container.querySelector('.rc-table'));

    // Scroll To number
    ref.current.scrollTo({
      top: 903,
    });

    expect(scrollParam.top).toEqual(903);

    // Scroll index
    ref.current.scrollTo({
      index: 0,
    });
    expect(scrollParam.top).toEqual(0);

    // Scroll key
    ref.current.scrollTo({
      key: 'bamboo',
    });
    expect(scrollParam.top).toEqual(0);
  });
});
