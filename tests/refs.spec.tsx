import { render } from '@testing-library/react';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import React from 'react';
import Table, { type Reference } from '../src';

describe('Table.Ref', () => {
  let scrollParam: any = null;
  let scrollIntoViewElement: HTMLElement = null;

  beforeAll(() => {
    spyElementPrototypes(HTMLElement, {
      scrollTo: (_: any, param: any) => {
        scrollParam = param;
      },
      scrollIntoView() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        scrollIntoViewElement = this;
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
        reference={ref}
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
    expect(scrollIntoViewElement.textContent).toEqual('light');

    // Scroll key
    ref.current.scrollTo({
      key: 'bamboo',
    });
    expect(scrollIntoViewElement.textContent).toEqual('bamboo');
  });
});
