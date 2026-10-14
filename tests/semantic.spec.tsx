import { render, fireEvent } from '@testing-library/react';
import { fillRef } from '@rc-component/util';
import React from 'react';
import Table, { TableProps, VirtualTable } from '../src';
describe('support classNames and styles', () => {
  const columns: TableProps['columns'] = [
    {
      title: 'title1',
      dataIndex: 'a',
      className: 'a',
      key: 'a',
      width: 100,
    },
    {
      title: 'title2',
      dataIndex: 'b',
      className: 'b',
      key: 'b',
      width: 100,
    },
    {
      title: 'title3',
      dataIndex: 'c',
      className: 'c',
      key: 'c',
      width: 200,
    },
    {
      title: 'Operations',
      dataIndex: '',
      className: 'd',
      key: 'd',
      render() {
        return <a href="#">Operations</a>;
      },
    },
  ];

  const data = [
    { a: '123', key: '1' },
    { a: 'cdd', b: 'edd', key: '2' },
    { a: '1333', c: 'eee', d: 2, key: '3' },
  ];
  const commonTableProps = {
    columns: columns,
    rowClassName: (record, i) => `row-${i}`,
    expandedRowRender: record => <p>extra: {record.a}</p>,
    expandedRowClassName: (record, i) => `ex-row-${i}`,
    className: 'table',
    title: () => <span>title</span>,
    footer: () => <span>footer</span>,
  };
  it('should support className and style', () => {
    const testClassNames = {
      section: 'test-section',
      title: 'test-title',
      footer: 'test-footer',
      content: 'test-content',
      body: {
        wrapper: 'test-body-wrapper',
        cell: 'test-body-cell',
        row: 'test-body-row',
      },
      header: {
        wrapper: 'test-header-wrapper',
        cell: 'test-header-cell',
        row: 'test-header-row',
      },
    };
    const testStyles = {
      section: { background: 'red' },
      title: { background: 'green' },
      footer: { background: 'pink' },
      content: { background: 'purple' },
      body: {
        wrapper: { background: 'cyan' },
        cell: { background: 'lime' },
        row: { background: 'teal' },
      },
      header: {
        wrapper: { background: 'magenta' },
        cell: { background: 'gold' },
        row: { background: 'silver' },
      },
    };
    const { container } = render(
      <Table {...commonTableProps} classNames={testClassNames} styles={testStyles} data={data} />,
    );
    const section = container.querySelector('.rc-table-container');
    const title = container.querySelector('.rc-table-title');
    const footer = container.querySelector('.rc-table-footer');
    const content = container.querySelector('.rc-table-content');
    const headerWrapper = container.querySelector('.rc-table-thead');
    const headerCell = container.querySelector('.rc-table-cell');
    const headerRow = container.querySelector('tr');
    const bodyWrapper = container.querySelector('.rc-table-tbody');
    const bodyCell = container.querySelector('.rc-table-tbody .rc-table-cell');
    const bodyRow = container.querySelector('.rc-table-row');
    expect(section).toHaveClass(testClassNames.section);
    expect(section).toHaveStyle(testStyles.section);
    expect(title).toHaveClass(testClassNames.title);
    expect(title).toHaveStyle(testStyles.title);
    expect(footer).toHaveClass(testClassNames.footer);
    expect(footer).toHaveStyle(testStyles.footer);
    expect(content).toHaveClass(testClassNames.content);
    expect(content).toHaveStyle(testStyles.content);

    expect(headerWrapper).toHaveClass(testClassNames.header.wrapper);
    expect(headerWrapper).toHaveStyle(testStyles.header.wrapper);
    expect(headerCell).toHaveClass(testClassNames.header.cell);
    expect(headerCell).toHaveStyle({ background: testStyles.header.cell.background });
    expect(headerRow).toHaveClass(testClassNames.header.row);
    expect(headerRow).toHaveStyle(testStyles.header.row);
    expect(bodyWrapper).toHaveClass(testClassNames.body.wrapper);
    expect(bodyWrapper).toHaveStyle(testStyles.body.wrapper);
    expect(bodyCell).toHaveClass(testClassNames.body.cell);
    expect(bodyCell).toHaveStyle(testStyles.body.cell);
    expect(bodyRow).toHaveClass(testClassNames.body.row);
    expect(bodyRow).toHaveStyle(testStyles.body.row);
  });

  describe.each([false, true])('scroll holders (virtual: %s)', virtual => {
    const TableComponent: React.ComponentType<TableProps> = virtual ? VirtualTable : Table;

    it.each([false, true])('supports holder semantics with empty data: %s', empty => {
      const { container, rerender } = render(
        <TableComponent
          prefixCls="custom-table"
          columns={columns}
          data={empty ? [] : data}
          scroll={{ x: 500, y: 100 }}
          sticky={{ offsetHeader: 8 }}
          classNames={{
            content: 'content-only',
            header: { holder: 'header-holder', wrapper: 'header-wrapper' },
            body: { holder: 'body-holder' },
          }}
          styles={{
            content: { outline: '3px solid red' },
            header: { holder: { background: 'pink' } },
            body: { holder: { background: 'cyan', overscrollBehavior: 'contain' } },
          }}
        />,
      );
      const bodySelector =
        virtual && !empty ? '.custom-table-tbody-virtual-holder' : '.custom-table-body';
      const header = container.querySelector('.custom-table-header');
      const body = container.querySelector(bodySelector);

      expect(header).toHaveClass('header-holder');
      expect(header).toHaveStyle({ background: 'pink', top: '8px', overflow: 'hidden' });
      expect(body).toHaveClass('body-holder');
      expect(body).toHaveStyle({
        background: 'cyan',
        overscrollBehavior: 'contain',
        maxHeight: '100px',
      });
      expect(container.querySelectorAll('.body-holder')).toHaveLength(1);
      expect(container.querySelector('.custom-table-thead')).toHaveClass('header-wrapper');
      expect(container.querySelector('.content-only')).toBeNull();

      rerender(
        <TableComponent
          prefixCls="custom-table"
          columns={columns}
          data={empty ? [] : data}
          scroll={{ x: 500, y: 100 }}
          classNames={{ body: { holder: 'updated-holder' } }}
          styles={{ body: { holder: { background: 'green', maxHeight: 80 } } }}
        />,
      );
      expect(container.querySelector(bodySelector)).toBe(body);
      expect(body).toHaveClass('updated-holder');
      expect(body).not.toHaveClass('body-holder');
      expect(body).toHaveStyle({ background: 'green', maxHeight: '80px' });
      expect(container.querySelector('.header-holder')).toBeNull();
      expect(header).not.toHaveStyle({ background: 'pink' });
    });
  });

  it('keeps content semantics separate from sticky holders and fixed summaries', () => {
    const props: TableProps = {
      columns,
      data,
      classNames: {
        content: 'content-only',
        header: { holder: 'header-holder' },
        body: { holder: 'body-holder' },
      },
      styles: { header: { holder: { background: 'pink' } } },
      summary: () => (
        <Table.Summary fixed>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>Summary</Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      ),
    };
    const { container, rerender } = render(<Table {...props} />);
    expect(container.querySelector('.rc-table-content')).toHaveClass('content-only');
    expect(container.querySelector('.header-holder')).toBeNull();
    expect(container.querySelector('.body-holder')).toBeNull();

    rerender(<Table {...props} sticky />);
    expect(container.querySelector('.rc-table-header')).toHaveClass('header-holder');
    expect(container.querySelector('.rc-table-body')).toHaveClass('body-holder');
    expect(container.querySelector('.content-only')).toBeNull();
    expect(container.querySelector('.rc-table-summary')).not.toHaveClass('header-holder');
    expect(container.querySelector('.rc-table-summary')).not.toHaveStyle({ background: 'pink' });
  });

  it('preserves custom virtual wrappers, refs and scroll events', () => {
    const onScroll = vi.fn();
    let wrapperNode: HTMLDivElement;
    const Wrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
      (props, ref) => (
        <div
          {...props}
          data-custom-holder
          ref={node => {
            wrapperNode = node;
            fillRef(ref, node);
          }}
        />
      ),
    );
    const { container } = render(
      <VirtualTable
        columns={columns}
        data={data}
        scroll={{ x: 500, y: 100 }}
        components={{ body: { wrapper: Wrapper } }}
        classNames={{ body: { holder: 'body-holder' } }}
        styles={{ body: { holder: { background: 'cyan' } } }}
        onScroll={onScroll}
      />,
    );
    const holder = container.querySelector('.rc-table-tbody-virtual-holder');
    expect(holder).toHaveAttribute('data-custom-holder');
    expect(holder).toBe(wrapperNode);
    expect(holder).toHaveClass('body-holder');
    expect(holder).toHaveStyle({ background: 'cyan' });
    fireEvent.scroll(holder, { target: { scrollTop: 20 } });
    expect(onScroll).toHaveBeenCalled();
  });
});
