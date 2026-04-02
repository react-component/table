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
    scrollIntoViewElement = null;
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

  it('support scrollTo with align', () => {
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

    // Default behavior: uses scrollIntoView (not scrollTo)
    ref.current.scrollTo({ index: 0 });
    expect(scrollIntoViewElement).not.toBeNull();
    expect(scrollIntoViewElement.textContent).toEqual('light');

    // Align start - should use scrollIntoView
    scrollIntoViewElement = null;
    ref.current.scrollTo({ index: 0, align: 'start' });
    expect(scrollIntoViewElement.textContent).toEqual('light');

    // Align center - should use scrollIntoView
    ref.current.scrollTo({ index: 1, align: 'center' });
    expect(scrollIntoViewElement.textContent).toEqual('bamboo');

    // Align end - should use scrollIntoView
    scrollIntoViewElement = null;
    ref.current.scrollTo({ key: 'bamboo', align: 'end' });
    expect(scrollIntoViewElement.textContent).toEqual('bamboo');
  });

  it('support scrollTo with align and offset', () => {
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

    // align start + offset 20 = 0 + 20 = 20
    ref.current.scrollTo({ index: 0, align: 'start', offset: 20 });
    expect(scrollParam.top).toEqual(20);

    // align center + offset 30 = 0 + 30 = 30
    ref.current.scrollTo({ index: 1, align: 'center', offset: 30 });
    expect(scrollParam.top).toEqual(30);

    // align end + offset 10 = 0 + 10 = 10
    ref.current.scrollTo({ key: 'bamboo', align: 'end', offset: 10 });
    expect(scrollParam.top).toEqual(10);

    // align nearest + offset 50 = 0 + 50 = 50
    ref.current.scrollTo({ index: 0, align: 'nearest', offset: 50 });
    expect(scrollParam.top).toEqual(50);
  });

  it('support scrollTo with align nearest and element above viewport', () => {
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
          y: 100,
        }}
      />,
    );

    ref.current.scrollTo({ top: 50 });

    ref.current.scrollTo({ index: 0, align: 'nearest', offset: -10 });
    expect(scrollParam.top).toEqual(-10);
  });
});
