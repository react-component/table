import { render } from '@testing-library/react';
import { spyElementPrototypes } from '@rc-component/util/lib/test/domHook';
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
    expect(scrollIntoViewElement.textContent).toEqual('light');

    // Scroll key
    ref.current.scrollTo({
      key: 'bamboo',
    });
    expect(scrollIntoViewElement.textContent).toEqual('bamboo');
  });

  it('support scrollTo with offset', () => {
    const ref = React.createRef<Reference>();

    render(
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

    // Scroll To top with offset should ignore offset
    ref.current.scrollTo({
      top: 100,
      offset: 50,
    });
    expect(scrollParam.top).toEqual(100); // offset ignored

    // Scroll index with offset
    ref.current.scrollTo({
      index: 0,
      offset: 30,
    });
    expect(scrollParam.top).toEqual(30); // offsetTop (0) + offset (30)

    // Scroll key with offset
    ref.current.scrollTo({
      key: 'bamboo',
      offset: 20,
    });
    expect(scrollParam.top).toEqual(20); // offsetTop (0) + offset (20)

    // Scroll index without offset should use scrollIntoView
    scrollIntoViewElement = null;
    ref.current.scrollTo({
      index: 0,
    });
    expect(scrollIntoViewElement.textContent).toEqual('light');
  });
});
